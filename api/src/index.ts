import {
  addElementToCraftedElement,
  addElementToUser,
  addUser,
  getCraftedElement,
  getUser,
} from "./db";

import cache from "./cache";
import { isElement } from "./types/Element";
import { getNewElement } from "./openai";

let href = "";

type CraftPostBody = {
  uuid: string;
  element1: string;
  element2: string;
};

type Endpoint = {
  [method: string]: (req: Request) => Promise<Response>;
};

type Endpoints = {
  [path: string]: Endpoint;
};

const endpoints: Endpoints = {
  "/user": {
    POST: async (req: Request) => {
      const user = await addUser();
      return new Response(JSON.stringify(user), {
        headers: { "Content-Type": "application/json" },
      });
    },
    GET: async (req: Request) => {
      const params = new URL(req.url).searchParams; //get uuid from query string
      const uuid = params.get("uuid");
      if (!uuid) {
        return new Response("Bad Request", { status: 400 });
      }
      const user = await getUser(uuid);
      if (!user) {
        return new Response("Not Found", { status: 404 });
      }
      return new Response(JSON.stringify(user), {
        headers: { "Content-Type": "application/json" },
      });
    },
  },
  "/craft": {
    POST: async (req: Request) => {
      const body: CraftPostBody = await req.json();

      let user = await getUser(body.uuid);

      //check if user exists
      if (!user) {
        return new Response("User not found", { status: 404 });
      }

      //Check if user has the elements
      const element1 = user.elements.find((e) => e.label === body.element1);
      const element2 = user.elements.find((e) => e.label === body.element2);

      if (!element1 || !element2) {
        return new Response("Element not found", { status: 404 });
      }

      //We need to check if the crafted element already exists in cache
      //we always save in cache with key element1.element2 and value type Element
      //we can have both element1.element2 and element2.element1

      const cacheElement1 = await cache.getElement(
        element1.label,
        element2.label
      );
      const cacheElement2 = await cache.getElement(
        element2.label,
        element1.label
      );
      const cacheCraftedElement = cacheElement1 || cacheElement2;

      if (cacheCraftedElement && isElement(cacheCraftedElement)) {
        // We found it in cache, so we can return it and save it to the user
        await addElementToUser(body.uuid, cacheCraftedElement);
        return new Response(JSON.stringify(cacheCraftedElement), {
          headers: { "Content-Type": "application/json" },
        });
      }
      console.log("Element not found in cache");

      //We need to check if the crafted element already exists in the database
      const craftedElement = await getCraftedElement(
        element1.label,
        element2.label
      );

      if (craftedElement) {
        // We found it in the database, so we can return it and save it to the user
        await addElementToUser(body.uuid, craftedElement);

        //We also save it to cache
        await cache.setElement(element1, element2, craftedElement);

        return new Response(JSON.stringify(craftedElement), {
          headers: { "Content-Type": "application/json" },
        });
      }

      // If we reach this point, we need to create the crafted element
      //So we call OpenAI

      const newElement = await getNewElement(element1, element2);
      if (!newElement) {
        return new Response("Failed to create new element", { status: 500 });
      }

      //save it to the database
      await addElementToCraftedElement(
        [element1, element2],
        newElement,
        body.uuid
      );

      //save it to cache
      await cache.setElement(element1, element2, newElement);

      //save it to user
      await addElementToUser(body.uuid, newElement);

      return new Response(JSON.stringify(newElement), {
        headers: { "Content-Type": "application/json" },
      });
    },
  },
  "/devops/cache": {
    GET: async (req: Request) => {
      const keys = await cache.listCache();
      return new Response(JSON.stringify(keys), {
        headers: { "Content-Type": "application/json" },
      });
    },
  },
};

const server = Bun.serve({
  port: 3000,
  fetch: async (req) => {
    const endpointUri = req.url.replace(href, "/").split("?")[0];
    const method = req.method;
    const endpoint = endpoints[endpointUri];

    if (!endpoint) {
      return new Response("Endpoint not Found", { status: 404 });
    }

    const handler = endpoint[method];
    if (!handler) {
      return new Response("Method Not Allowed", { status: 405 });
    }

    return await handler(req);
  },
});

console.log(`Listening on http://localhost:${server.port}...`);

href = server.url["href"];

import { createClient } from "redis";
import type { Element } from "./types/Element";
import { isElement } from "./types/Element";
const client = createClient({
  socket: {
    host: Bun.env.REDIS_URI || "localhost",
    port: 6379,
  },
});

client.on("error", (err) => {
  console.log("Redis Client Error", err);
  process.exit(1);
});

await client.connect();

async function setElement(
  element1: Element,
  element2: Element,
  result: Element
) {
  await client.set(
    `${element1.label}.${element2.label}`,
    JSON.stringify(result)
  );
}

async function getElement(element1: string, element2: string) {
  const result = await client.get(`${element1}.${element2}`);
  if (!result) {
    return null;
  }

  const parsed = JSON.parse(result);
  if (isElement(parsed)) {
    return parsed;
  } else {
    console.error("Element in cache is corrupted. Deleting...");
    await client.del(`${element1}.${element2}`);
    return null;
  }
}

async function listCache() {
  const keys = await client.keys("*");
  return keys;
}

//epxort as cache.setElement = setElement and cache.getElement = getElement like a namespace module
export default { setElement, getElement, listCache };

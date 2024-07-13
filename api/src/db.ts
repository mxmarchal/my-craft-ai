import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import User from "./models/User";
import Craft from "./models/Craft";
import type { Element } from "./types/Element";

console.log("Connecting to MongoDB");

try {
  await mongoose.connect(
    `${Bun.env.MONGO_URI || "mongodb://127.0.0.1:27017/"}`,
    {}
  );
  console.log("Connected to MongoDB");
} catch (e) {
  console.error("Failed to connect to MongoDB", e);
  process.exit(1);
}

export function addUser() {
  const uuid = uuidv4();
  const user = new User({
    uuid,
    createdAt: new Date(),
    elements: [
      {
        label: "fire",
        emoji: "🔥",
      },
      {
        label: "water",
        emoji: "💧",
      },
      {
        label: "earth",
        emoji: "🌍",
      },
      {
        label: "air",
        emoji: "💨",
      },
    ],
  });

  return user.save();
}

export async function getUser(uuid: string) {
  try {
    const user = await User.findOne({ uuid });
    return user;
  } catch (e) {
    console.error("Failed to get user", e);
    return null;
  }
}

export async function getCraftedElement(element1: string, element2: string) {
  //elements in the collection is an array of Element (label and emoji)
  try {
    const craft = await Craft.findOne({
      $or: [
        { elements: { $all: [{ label: element1 }, { label: element2 }] } },
        { elements: { $all: [{ label: element2 }, { label: element1 }] } },
      ],
    });
    return craft?.craftedElement;
  } catch (e) {
    console.error("Failed to get crafted element", e);
    return null;
  }
}

export function addElementToUser(uuid: string, element: Element) {
  return User.updateOne(
    { uuid },
    {
      $push: {
        elements: element,
      },
    }
  );
}

export async function addElementToCraftedElement(
  elements: Element[],
  newElement: Element,
  uuid: string
) {
  //add the new element to collection with user id and date of discovery
  const craft = new Craft({
    elements,
    craftedElement: newElement,
    foundAt: new Date(),
    userUuid: uuid,
  });

  try {
    const result = await craft.save();
    return result;
  } catch (e) {
    console.error("Failed to add element to crafted element", e);
    return null;
  }
}

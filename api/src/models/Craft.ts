import { Schema, model, Document } from "mongoose";
import type { Element } from "../types/Element";

interface ICraft extends Document {
  elements: Element[];
  craftedElement: Element;
  foundAt: Date;
  userUuid: string;
}

const craftSchema = new Schema<ICraft>({
  elements: {
    type: [
      {
        label: { type: String, required: true },
        emoji: { type: String, required: true },
      },
    ],
    required: true,
    maxlength: 2,
    minlength: 2,
  },
  craftedElement: {
    label: { type: String, required: true },
    emoji: { type: String, required: true },
  },
  foundAt: { type: Date, required: true },
  userUuid: { type: String, required: true },
});

const Craft = model<ICraft>("Craft", craftSchema);

export default Craft;

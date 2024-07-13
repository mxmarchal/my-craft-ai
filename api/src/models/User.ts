import { Schema, model, Document } from "mongoose";
import type { Element } from "../types/Element";

interface IUser extends Document {
  uuid: string;
  createdAt: Date;
  elements: Element[];
}

const userSchema = new Schema<IUser>({
  uuid: { type: String, required: true },
  createdAt: { type: Date, required: true },
  elements: {
    type: [
      {
        label: { type: String, required: true },
        emoji: { type: String, required: true },
      },
    ],
    required: true,
  },
});

const User = model<IUser>("User", userSchema);

export default User;

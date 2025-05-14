import mongoose, { Document, Schema } from "mongoose";

export interface CardsLink {
  platform: string;
  text: string;
  url: string;
  iconColor?: string;
  iconUrl?: string;
}

export interface CardsItem {
  imageUrl: string;
  title: string;
  description: string;
}

export interface CardsTab {
  name: string;
  items: Array<CardsItem>;
}

export interface CardsInfo extends Document {
  layout: string;
  userid: string;
  enabled: boolean;
  updated: Date;
  about: string;
  banner: string;
  avatar: string;
  links: Array<CardsLink>;
  tabs: Array<CardsTab>,
  displayName: string;
  showTimestamps: boolean;
  // these below are added dynamically in the request
  createdAt: Date;
  isVerified: boolean;
  username: string;
  badges: Array<number>;
}

const schema: Schema = new mongoose.Schema({
  layout: String,
  userid: { type: String, required: true, unique: true, index: true },
  updated: Date,
  enabled: Boolean,
  about: String,
  displayName: String,
  showTimestamps: Boolean,
  tabs: Array<CardsTab>,
  banner: String,
  avatar: String,
  links: Array<CardsLink>,
});

export default mongoose.models.Cards || mongoose.model("Cards", schema);

import mongoose, { Document, Schema } from "mongoose";

export interface PortfolioLink  {
    platform: string,
    text: string,
    url: string,
    iconColor?: string,
    iconUrl?: string
  }

export interface PortfolioInfo extends Document {
    layout: string,
    userid: string,
    enabled: boolean,
    updated: Date,
    about: string,
    banner: string,
    avatar: string,
    links: Array<PortfolioLink>,
    displayName: string,
    showTimestamps: boolean,
    // these below are added dynamically in the request
    createdAt: Date,
    isVerified: boolean,
    username: string,
    badges: Array<number>,
}

const schema : Schema = new mongoose.Schema({
    layout: String,
    userid: { type: String, required: true, unique: true, index: true },
    updated: Date,
    enabled: Boolean,
    about: String,
    displayName: String,
    showTimestamps: Boolean,
    banner: String,
    avatar: String,
    links: Array<PortfolioLink>,
})

schema.index({ userid: 1 });
schema.index({ _id: 1, userid: 1 });

export default mongoose.models.Portfolio || mongoose.model("Portfolio", schema);
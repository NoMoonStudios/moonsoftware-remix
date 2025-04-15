import mongoose, { Document, Schema } from "mongoose";

export interface PortfolioLink {
    url: string,
    name: string,
    icon: string
}

export interface Portfolio extends Document {
    layout: string,
    userid: string,
    updated: Date,
    bio: string,
    banner: string,
    avatar: string,
    links: Array<PortfolioLink>
    // these below are added dynamically in the request
    username: string,
    isVerified: boolean,
}

const schema : Schema = new mongoose.Schema({
    layout: String,
    userid: String,
    updated: Date,
    bio: String,
    banner: String,
    avatar: String,
    links: Array<PortfolioLink>,
})

export default mongoose.models.Portfolio || mongoose.model("Portfolio", schema);
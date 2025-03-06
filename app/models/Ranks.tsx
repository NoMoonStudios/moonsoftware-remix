import mongoose, { Document, Schema } from "mongoose";

export interface IRanks extends Document {
    rankName: string;
    rankId: string;
    rankPermissions: Array<string>;
    createdAt : Date;
}

const schema : Schema = new mongoose.Schema({
    rankName: String,
    rankPermissions: Array<String>,
    createdAt : Date
})

export default mongoose.models.User || mongoose.model<IRanks>("Ranks", schema);
import mongoose, { Document, Schema } from "mongoose";

interface Settings {
    emailVisible: boolean;
    connectionVisible: boolean;
}

export interface IUser extends Document {
    displayName : string;
    username : string;
    pronouns : string;

    userid : string;
    email : string;
    passwordHash : string;

    avatar : string;
    banner : string;

    isVerified : boolean;
    isEmailVerified: boolean;

    robloxUserid : number;
    badges: Array<number>;
    customBadge: {
        name: string;
        color: string;
    },
    portfolioid: mongoose.Types.ObjectId;

    bio:string;
    joinedOn: Date;
    createdAt: Date;

    rank: string;
    session: string;

    isTermed: boolean;

    discord : {
        verified: boolean;
        userid: string;
        username: string;
        avatar:string;
        refreshToken: string;
        connections: Array<object>;
    };
    settings: Settings;

    roblox : {
        verified: boolean;
        userid: string;
        username: string;
    };

    sessions: Array<string>;

    isPortfolioEnabled: boolean; // Added in middleware
}

const schema : Schema = new mongoose.Schema({
    displayName : String,
    username : String,
    pronouns : String,

    userid: { type: String, required: true, unique: true, index: true },
    email : String,
    passwordHash : String,

    avatar : String,
    banner : String,

    isEmailVerified: Boolean,
    isVerified : Boolean,

    robloxUserid : Number,
    badges: Array<number>,
    isPortfolioEnabled: { type: Boolean, default: false },
    customBadge: {
        name: String,
        color: String,
    },

    bio:String,
    joinedOn: Date,
    portfolioid: { type: mongoose.Schema.Types.ObjectId },
    
    rank: String,
    isTermed: Boolean,

    discord : {
        verified: Boolean,
        userid: String,
        username: String,
        avatar:String,
        refreshToken: String,
        connections: Array<object>,
    },
    settings: {
        emailVisible: Boolean,
        connectionVisible: Boolean
    },

    roblox : {
        verified: Boolean,
        userid: String,
        username: String,
    },

    sessions: Array,
    createdAt : Date
})
schema.index({ portfolioid: 1 }); 
schema.index({ userid: 1, portfolioid: 1 }); 
export default mongoose.models.User || mongoose.model<IUser>("User", schema);
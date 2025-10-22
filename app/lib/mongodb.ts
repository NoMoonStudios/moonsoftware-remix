import mongoose from "mongoose";
const connection : { isConnected? :number } = {};
const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI is not set in environment variables");
}
async function dbConnect() {
    if (connection.isConnected) {
        return;
    }
    const db = await mongoose.connect(uri!);
    connection.isConnected = db.connections[0].readyState;
}


export default dbConnect
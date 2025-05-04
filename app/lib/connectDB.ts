import mongoose from "mongoose";
import Cards from "~/models/Cards";
import User from "~/models/User";

const connection : { isConnected? :number } = {};

// async function createIndexes() {
//     await User.createIndexes(); 
//     await Cards.createIndexes();
//     console.log('Indexes created successfully');
//   }
async function dbConnect() {
    if (connection.isConnected) {
        return;
    }

    const db = await mongoose.connect(process.env.MONGODB_URI!);

    connection.isConnected = db.connections[0].readyState;
}

// mongoose.connection.on('connected', () => {
//     createIndexes().catch(console.error);
// });

export default dbConnect
import mongoose from "mongoose";

async function connect() {

    mongoose.set('strictQuery', true)
    mongoose.set('debug', true);
    const db = await mongoose.connect(process.env.ATLAS_URI);
    console.log("Database Connected")
    return db;
}

export default connect;
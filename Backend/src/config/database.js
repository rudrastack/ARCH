import mongoose from "mongoose";
import {config} from "dotenv";

const connectDB = async () => {
 await mongoose.connect(config.MONGO_URI);
 console.log("DB connected");
}


export default connectDB;



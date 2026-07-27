import dotenv from "dotenv";

dotenv.config();

if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not defined");
if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined");
if (!process.env.GOOGLE_CLIENT_ID) throw new Error("GOOGLE_Client_ID is not defined");
if (!process.env.GOOGLE_CLIENT_SECRET) throw new Error("GOOGLE_Client_Secret is not defined");
if (!process.env.IMAGEKIT_PVT_KEY) throw new Error("IMAGEKIT_PVT_KEY is not defined");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/arks";
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const IMAGEKIT_PVT_KEY = process.env.IMAGEKIT_PVT_KEY

export const config = {
  MONGO_URI,
  JWT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  IMAGEKIT_PVT_KEY
};

import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/arks";
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export const config = {
  MONGO_URI,
  JWT_SECRET,
};

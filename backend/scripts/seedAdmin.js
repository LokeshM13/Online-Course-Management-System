import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js";

dotenv.config();

const { MONGODB_URI, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  throw new Error("MONGODB_URI, ADMIN_EMAIL, and ADMIN_PASSWORD are required.");
}

try {
  await mongoose.connect(MONGODB_URI);
  const existing = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });
  if (existing) throw new Error("An account already exists with ADMIN_EMAIL.");
  await User.create({ name: ADMIN_NAME || "Administrator", email: ADMIN_EMAIL, password: ADMIN_PASSWORD, role: "admin" });
  console.log(`Admin account created for ${ADMIN_EMAIL}.`);
} finally {
  await mongoose.disconnect();
}

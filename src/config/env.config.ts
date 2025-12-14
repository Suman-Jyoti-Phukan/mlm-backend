import dotenv from "dotenv";

dotenv.config();

// Suman -> Type is inferred automatically.
export const env = {
  PORT: Number(process.env.PORT) || 3000,
  DATABASE_URL: process.env.DATABASE_URL || "",
  ENVIRONMENT: process.env.environment || "development",
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
};

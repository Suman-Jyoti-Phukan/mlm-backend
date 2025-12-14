import bcrypt from "bcrypt";

import jwt, { SignOptions } from "jsonwebtoken";

import { env } from "../config/env.config";

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateToken = (
  id: string,
  userId: string,
  email: string
): string => {
  const jwtSecret = env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign({ id, userId, email }, jwtSecret, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as SignOptions);
};

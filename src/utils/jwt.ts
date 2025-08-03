import jwt from "jsonwebtoken";
import "../config/env";

const secret = process.env.JWT_SECRET;

if (!secret) throw new Error("JWT_SECRET is not defined");

export const generateToken = (payload: object) =>
  jwt.sign(payload, secret, { expiresIn: "1h" });

export const verifyToken = (token: string) =>
  jwt.verify(token, secret!);

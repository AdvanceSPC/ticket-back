import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import { db } from "../db/db";
import { generateToken } from "../utils/jwt";

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  if ((rows as any[]).length > 0)
    return res.status(409).json({ error: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const id = uuid();
  await db.query("INSERT INTO users (id, email, password) VALUES (?, ?, ?)", [
    id,
    email,
    hashed
  ]);

  res.json({ message: "User registered", userId: id });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  const user = (rows as any[])[0];

  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ error: "Invalid credentials" });

  const token = generateToken({ id: user.id, email: user.email });
  res.json({ token });
};

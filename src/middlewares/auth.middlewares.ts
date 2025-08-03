import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer ")) return res.status(401).json({ error: "No token" });

    const token = auth.split(" ")[1];
    try {
        const user = verifyToken(token);
        (req as any).user = user;
        next();
    } catch {
        return res.status(401).json({ error: "Invalid token" });
    }
};

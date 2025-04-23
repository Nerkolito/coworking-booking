import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Typ för vad token ska innehålla
export interface JwtPayload {
  userId: string;
  role: "User" | "Admin";
}

// Utöka Express Request-objektet med "user"
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

// Autentisering – kontrollera JWT-token
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Ingen token tillhandahållen" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    res.status(401).json({ message: "Ogiltig token" });
  }
};

// Behörighetskontroll – endast admin får gå vidare
export const authorizeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== "Admin") {
    res.status(403).json({ message: "Endast admin har åtkomst" });
    return;
  }

  next();
};

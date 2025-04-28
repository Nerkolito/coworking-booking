import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Definierar hur en JWT-payload ska se ut
export interface JwtPayload {
  userId: string; // Användarens ID
  role: "User" | "Admin"; // Användarroll
}

// Middleware för att verifiera JWT och autentisera användaren
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  // Kontroll: Finns token och börjar den med "Bearer "?
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Ingen token tillhandahållen" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verifierar token och sparar info i req.user
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

// Middleware för att kontrollera om användaren är admin
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

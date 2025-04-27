// 📦 Import Express types and jsonwebtoken library
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// 🧩 Define the expected structure of JWT payload
export interface JwtPayload {
  userId: string;
  role: "User" | "Admin";
}

// 🔐 Middleware: Authenticate user by verifying JWT token
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  // Check if Authorization header is present and correct
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Ingen token tillhandahållen" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify token and attach user payload to request
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

// 🛡 Middleware: Authorize only Admins to proceed
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

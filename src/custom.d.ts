import { JwtPayload } from "./middleware/authMiddleware";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
export {};
// This file is used to extend the Express Request object to include the user property, which contains the JWT payload.

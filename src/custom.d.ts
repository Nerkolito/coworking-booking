// Importerar typen JwtPayload som vi själva har definierat i authMiddleware
import { JwtPayload } from "./middleware/authMiddleware";

// Utökar Express Request-objektet så att vi kan lägga till "user" direkt på req.user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload; // Här sparas info om inloggad användare från JWT-token
    }
  }
}

// Exporterar en tom modul för att göra filen till en modul
export {};

import mongoose, { Document, Schema } from "mongoose";

// Beskriver vad en användare ska innehålla (för TypeScript)
export interface IUser extends Document {
  username: string;
  password: string;
  role: "User" | "Admin"; // Användarroll
  comparePassword(candidatePassword: string): Promise<boolean>; // Metod för att jämföra lösenord
}

// Definierar ett schema för användare
const UserSchema: Schema<IUser> = new Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Användarnamn måste vara unikt
  },
  password: {
    type: String,
    required: true, // Lösenord krävs
  },
  role: {
    type: String,
    enum: ["User", "Admin"], // Endast User eller Admin tillåtet
    default: "User", // Standardvärde är User
  },
});

// Hashar lösenordet automatiskt innan användaren sparas i databasen
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  const bcrypt = await import("bcrypt");
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Jämför lösneordet med det hashade lösenordet i databasen
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  const bcrypt = await import("bcrypt");
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>("User", UserSchema);
export default User;

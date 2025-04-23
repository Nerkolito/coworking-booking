import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  role: "User" | "Admin";
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["User", "Admin"], default: "User" },
});

// Hasha lösenord före save
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  const bcrypt = await import("bcrypt");
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Jämför lösenord
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  const bcrypt = await import("bcrypt");
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>("User", UserSchema);
export default User;

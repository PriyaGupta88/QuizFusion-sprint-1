import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    avatar: { type: String, default: "" },
    role: { type: String, enum: ["student", "admin"], default: "student" },
    streak: { type: Number, default: 0 },
    lastActiveDate: { type: Date },
    stats: {
      totalTests: { type: Number, default: 0 },
      totalScore: { type: Number, default: 0 },
      bestScore: { type: Number, default: 0 },
      avgScore: { type: Number, default: 0 },
    },
    weakTopics: [{ type: String }],
    strongTopics: [{ type: String }],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model("User", userSchema);

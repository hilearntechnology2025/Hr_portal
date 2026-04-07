const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: ["agent", "team_leader", "manager", "admin", "super_admin", "hr", "finance", "employee"], 
      default: "agent",
    },
    isActive: { type: Boolean, default: true },
    phone: { type: String, default: "" },
    avatar: { type: String, default: "" },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

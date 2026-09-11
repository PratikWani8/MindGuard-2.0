import bcrypt from "bcrypt";
import User from "../models/User.js";
import { signToken } from "../utils/jwt.js";
import { success, failure } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const publicUser = (u) => ({
  _id: u._id, name: u.name, email: u.email, age: u.age,
  role: u.role, profileImage: u.profileImage, preferences: u.preferences,
  createdAt: u.createdAt, updatedAt: u.updatedAt
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, age } = req.body;
  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) return failure(res, "Email is already registered", [], 409);

  const hashed = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hashed, age });
  const token = signToken(user._id.toString());
  return success(res, { user: publicUser(user), token }, "Registration successful", 201);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return failure(res, "Invalid email or password", [], 401);
  }
  const token = signToken(user._id.toString());
  return success(res, { user: publicUser(user), token }, "Login successful");
});

export const logout = asyncHandler(async (req, res) =>
  success(res, {}, "Logout successful")
);

export const me = asyncHandler(async (req, res) =>
  success(res, { user: publicUser(req.user) }, "Current user")
);
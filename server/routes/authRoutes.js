import { Router } from "express";
import { register, login, logout, me } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";

const router = Router();
const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

router.post("/register", validateBody({
  name: { required: true, type: "string", minLength: 2, maxLength: 100 },
  email: { required: true, type: "string", pattern: email },
  password: { required: true, type: "string", pattern: password },
  age: { min: 13, max: 120 }
}), register);

router.post("/login", validateBody({
  email: { required: true, type: "string", pattern: email },
  password: { required: true, type: "string", minLength: 1 }
}), login);

router.post("/logout", protect, logout);
router.get("/me", protect, me);
export default router;
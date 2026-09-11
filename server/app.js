import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mongoSanitize from "@exortek/express-mongo-sanitize";

import authRoutes from "./routes/authRoutes.js";
import checkInRoutes from "./routes/checkInRoutes.js";
import journalRoutes from "./routes/journalRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import insightsRoutes from "./routes/insightsRoutes.js";
import wellnessRoutes from "./routes/wellnessRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";
import aiAgentRoutes from "./routes/aiAgentRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import riskRoutes from "./routes/riskRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL?.split(",").map(x => x.trim()) || "http://localhost:5173",
  credentials: true
}));
app.use(compression());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(mongoSanitize());

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later", errors: [] }
}));

app.get("/health", (req, res) => res.json({
  success: true,
  data: { service: "mindguard-backend", status: "healthy", timestamp: new Date().toISOString() },
  message: "OK"
}));

app.use("/api/auth", authRoutes);
app.use("/api/checkins", checkInRoutes);
app.use("/api/journals", journalRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/insights", insightsRoutes);
app.use("/api/wellness", wellnessRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/agent", aiAgentRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/risk-events", riskRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
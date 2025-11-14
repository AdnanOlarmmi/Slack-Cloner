import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.get("/health", (_, res) => {
  res.json({
    status: "healthy",
    service: "auth",
    timestamp: new Date().toISOString(),
  });
});

app.use("/auth", authRoutes);

export default app;

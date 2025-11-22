import { Response } from "express";
import z from "zod";

export const handleError = (error: unknown, res: Response) => {
  if (error instanceof z.ZodError) {
    return res
      .status(400)
      .json({ error: "Validation error", details: error.errors });
  }

  if (error instanceof Error) {
    if (
      error.message.includes("already exists") ||
      error.message.includes("already taken")
    ) {
      return res.status(409).json({ error: error.message });
    }
    if (error.message.includes("Invalid credentials")) {
      return res.status(401).json({ error: error.message });
    }
    if (error.message.includes("disabled")) {
      return res.status(403).json({ error: error.message });
    }
  }

  console.error("Unexpected error:", error);
  return res.status(500).json({ error: "Internal server error" });
};

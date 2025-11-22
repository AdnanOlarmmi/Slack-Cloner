import { registerUser, loginUser, toSafeUser } from "../services/auth.service";
import { Request, Response } from "express";
import { RegisterRequest, LoginRequest } from "../types";
import z from "zod";
import { handleError } from "../utils/handleError";
import { prisma } from "../lib/prisma";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role?: string;
      };
    }
  }
}

const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(20),
  displayName: z.string().min(3).max(20),
  password: z
    .string()
    .min(8)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message:
          "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character",
      }
    ),
  timezone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const register = async (req: Request, res: Response) => {
  try {
    const registerRequest: RegisterRequest = registerSchema.parse(req.body);
    const result = await registerUser(registerRequest);
    return res.status(201).json(result);
  } catch (error) {
    return handleError(error, res);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const loginRequest: LoginRequest = loginSchema.parse(req.body);
    const result = await loginUser(loginRequest);
    return res.status(200).json(result);
  } catch (error) {
    return handleError(error, res);
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(toSafeUser(user));
  } catch (error) {
    return handleError(error, res);
  }
};

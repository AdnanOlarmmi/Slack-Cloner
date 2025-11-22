import { Role } from "@prisma/client";
import {
  RegisterRequest,
  LoginRequest,
  User,
  UserResponse,
  AuthResponse,
} from "../types";
import { hashPassword, comparePassword } from "../utils/password";
import { generateToken } from "../utils/jwt";
import { prisma } from "../lib/prisma";

export const toSafeUser = (user: User): UserResponse => {
  const {
    passwordHash,
    resetToken,
    resetTokenExpiry,
    providerId,
    ...safeUser
  } = user;
  return safeUser as UserResponse;
};

const existingUser = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return user;
};

const existingUsername = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: { username },
  });
  return user;
};

export const registerUser = async (
  user: RegisterRequest
): Promise<AuthResponse> => {
  if (await existingUser(user.email)) {
    throw new Error("User already exists");
  }
  if (await existingUsername(user.username)) {
    throw new Error("Username already exists");
  }
  const hashedPassword = await hashPassword(user.password);

  const newUser = await prisma.user.create({
    data: {
      email: user.email,
      username: user.username,
      displayName: user.displayName,
      passwordHash: hashedPassword,
      timezone: user.timezone || "UTC",
      role: Role.USER,
    },
  });

  const token = generateToken({
    userId: newUser.id,
    email: newUser.email,
    role: newUser.role,
  });

  return {
    user: toSafeUser(newUser),
    token,
  };
};

export const loginUser = async (
  loginDetail: LoginRequest
): Promise<AuthResponse> => {
  const user = await prisma.user.findUnique({
    where: { email: loginDetail.email },
  });
  if (!user || !user.passwordHash) {
    throw new Error("Invalid credentials");
  }
  const isPasswordValid = await comparePassword(
    loginDetail.password,
    user.passwordHash
  );
  if (!user.isActive) {
    throw new Error("Account is disabled");
  }
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    user: toSafeUser(user),
    token,
  };
};

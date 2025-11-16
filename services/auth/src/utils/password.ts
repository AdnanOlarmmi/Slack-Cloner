import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string): Promise<string> => {
  if (!password || password.trim().length === 0) {
    throw new Error("Password is required");
  }

  try {
    return await bcrypt.hash(password, SALT_ROUNDS);
  } catch (error) {
    console.error("Password hashing error:", error);
    throw new Error("Failed to hash password");
  }
};

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  if (!password || !hash) {
    throw new Error("Password and hash are required");
  }
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error("Password comparison error:", error);
    throw new Error("Failed to compare password");
  }
};

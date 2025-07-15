"use server";

import { prisma } from "@/lib/db";
import {
  hashPassword,
  comparePasswords,
  generateAccessToken,
  generateRefreshToken,
} from "@/lib/auth";
import { cookies } from "next/headers";

export async function executeAction({ actionFn }) {
  try {
    await actionFn();
    return { success: true };
  } catch (error) {
    console.error("Action execution failed:", error);
    return { success: false, error: error.message };
  }
}

export async function handleSignup(formData) {
  try {
    const { username, email, password } = formData;
    if (!username || !email || !password) {
      return { success: false, error: "All fields are required" };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: "Invalid email format" };
    }
    if (password.length < 6) {
      return {
        success: false,
        error: "Password must be at least 6 characters long",
      };
    }
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { username: username.toLowerCase() },
        ],
      },
    });
    if (existingUser) {
      return {
        success: false,
        error: "User with email or username already exists",
      };
    }
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password: hashedPassword,
      },
    });
    if (!user) {
      return {
        success: false,
        error: "Something went wrong while registering the user",
      };
    }
    return { success: true };
  } catch (error) {
    console.error("Signup failed:", error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred during signup",
    };
  }
}

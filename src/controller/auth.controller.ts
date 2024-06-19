import { db } from "@/lib/db";
import { compare } from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jwt-simple";

const authSecret = process.env.AUTH_SECRET ?? "";

export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ error: "Email and password required!" });
    }

    const user = await db("users").where({ email }).first();

    if (!user) return res.status(400).send("User not found!");

    const isMatch = compare(password, user.password);
    if (!isMatch) return res.status(401).send("Invalid email and password!");

    const now = Math.floor(Date.now() / 1000);
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      admin: user.admin,
      iat: now,
      exp: now + 60 * 60 * 24 * 3, // 3 days
    };

    res.json({
      ...payload,
      token: jwt.encode(payload, authSecret),
    });
  } catch (error) {
    console.error("Error during sign-in:", error);
    res.status(500).send("Internal server error");
  }
};

export const validateToken = async (req: Request, res: Response) => {
  const userData = req.body || null;

  try {
    if (userData) {
      const token = jwt.decode(userData.token, authSecret);
      if (new Date(token.exp * 1000) > new Date()) {
        return res.send(true);
      }
    }
  } catch (err) {
    res.status(403).send({ error: "Invalid token" });
  }

  res.send(false);
};

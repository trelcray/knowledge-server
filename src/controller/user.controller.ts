import { Request, Response } from "express";
import { hash } from "bcryptjs";
import {
  equalsOrError,
  existsOrError,
  notExistsOrError,
} from "@/utils/validations";
import { db } from "@/lib/db";
import { User } from "@/@types/globals";

export const createUser = async (
  req: Request,
  res: Response,
): Promise<Response | undefined> => {
  const user = { ...req.body };
  const currentUser = req.user as User;
  if (req.params.id) user.id = req.params.id;

  if (!req.originalUrl.startsWith("/users")) user.admin = false;
  if (!currentUser || !currentUser.admin) user.admin = false;

  try {
    existsOrError(user.name, "Name not given");
    existsOrError(user.email, "Email not given");
    existsOrError(user.password, "Password not given");
    existsOrError(user.confirmPassword, "Confirm Password invalid");
    equalsOrError(
      user.password,
      user.confirmPassword,
      "Passwords do not match",
    );

    const emailAlreadyExists = await db("users")
      .where({ email: user.email })
      .first();

    if (!user.id) {
      notExistsOrError(emailAlreadyExists, "Email already exists");
    }
  } catch (msg) {
    return res.status(400).send(msg);
  }

  user.password = hash(user.password, 10);

  delete user.confirmPassword;

  if (user.id) {
    db("users")
      .update(user)
      .where({ id: user.id })
      .whereNull("deletedAt")
      .then(() => res.status(204).send())
      .catch((err) => res.status(500).send(err));
  } else {
    db("users")
      .insert(user)
      .then(() => res.status(201).send())
      .catch((err) => res.status(500).send(err));
  }
};

export const getAllUsers = (req: Request, res: Response) => {
  db("users")
    .select("id", "name", "email", "admin")
    .whereNull("deletedAt")
    .then((users) => res.json(users))
    .catch((err) => res.status(500).send(err));
};

export const getUserById = (req: Request, res: Response) => {
  const { id } = req.params;
  db("users")
    .select("id", "name", "email", "admin")
    .where({ id })
    .whereNull("deletedAt")
    .first()
    .then((user) => res.json(user))
    .catch((err) => res.status(500).send(err));
};

export const removeUser = async (req: Request, res: Response) => {
  try {
    const articles = await db("articles").where({ userId: req.params.id });
    notExistsOrError(articles, "User has articles.");

    const rowsUpdated = await db("users")
      .update({ deletedAt: new Date() })
      .where({ id: req.params.id })
      .whereNull("deletedAt");
    existsOrError(rowsUpdated, "User not found");

    res.status(204).send();
  } catch (msg) {
    res.status(400).send(msg);
  }
};

export const unlockUser = async (req: Request, res: Response) => {
  try {
    await db("users").update({ deletedAt: null }).where({ id: req.params.id });

    res.status(204).send();
  } catch (msg) {
    res.status(500).send(msg);
  }
};

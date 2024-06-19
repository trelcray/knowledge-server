import { User } from "@/@types/globals";
import { NextFunction, Request, Response } from "express";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User;

  if (!user || !user.admin) {
    return res.status(401).send("User is not an admin");
  }
  next();
};

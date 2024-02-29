import express from "express";

import { registerUser } from "../controller/user.controller";

export const userRoute = express.Router();

userRoute.get("/", registerUser);

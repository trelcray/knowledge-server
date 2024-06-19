import express from "express";
import cors from "cors";
import { router } from "./routes/routes";
import passport from "@/middlewares/passport";

export const app = express();
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

app.use("/api", router);

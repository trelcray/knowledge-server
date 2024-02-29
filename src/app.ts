import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { userRoute } from "./routes/user";

export const app = express();

dotenv.config();
app.use(cors());

app.use(userRoute);

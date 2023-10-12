import express from "express";
import cors from "cors";
import dotenv from "dotenv";

export const app = express();

dotenv.config();
app.use(cors());

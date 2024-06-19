import { app } from "./app";
import mongoose from "mongoose";
import schedule from "@/schedule/statSchedule";

const requiredEnvVariables: string[] = [
  "PORT",
  "AUTH_SECRET",
  "DB_HOST",
  "POSTGRES_DB",
  "POSTGRES_USER",
  "POSTGRES_PASSWORD",
  "MONGO_INITDB_ROOT_USERNAME",
  "MONGO_INITDB_ROOT_PASSWORD",
  "MONGO_INITDB_DATABASE",
];

const validateEnvVariables = (variables: string[]) => {
  variables.forEach((variable: string) => {
    if (!process.env[variable]) {
      throw new Error(`Environment variable ${variable} is not defined`);
    }
  });
};

const getMongoURI = (): string => {
  const {
    MONGO_INITDB_ROOT_USERNAME,
    MONGO_INITDB_ROOT_PASSWORD,
    MONGO_INITDB_DATABASE,
  } = process.env;

  return `mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@mongodb:27017/${MONGO_INITDB_DATABASE}?authSource=admin`;
};

const connectToMongoDB = async (uri: string) => {
  try {
    await mongoose.connect(uri);
    console.log("Mongodb connection established!");
  } catch (err) {
    const msg = "Error connecting to mongodb!";
    console.error("\x1b[41m%s\x1b[37m", msg, "\x1b[0m", err);
    process.exit(1);
  }
};

const startServer = (port: number) => {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
};

const start = async () => {
  validateEnvVariables(requiredEnvVariables);

  const mongoURI = getMongoURI();
  await connectToMongoDB(mongoURI);

  schedule();

  const port = parseInt(process.env.PORT!);
  startServer(port);
};

start();

import mongoose from "mongoose";
import express from "express";
require("express-async-errors");
import cors from "cors";

import { blogsRouter } from "./routes/blogs";
import { usersRouter } from "./routes/users";
import { loginRouter } from "./routes/login";

import * as config from "./utils/config";
import * as middleware from "./utils/middleware";
import * as logger from "./utils/logger";

export const app = express();

mongoose.set("strictQuery", false);

mongoose.connect(config.MONGODB_URI!)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error: mongoose.Error) => {
    logger.error('error connecting to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);

app.use('/api/blogs', middleware.userExtractor, blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

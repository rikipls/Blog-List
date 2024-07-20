import express, { Request, Response } from "express";
import bcrypt from "bcrypt";

import { UserModel } from "../models/user";

export const usersRouter = express.Router();

usersRouter.get("/", async (_request: Request, response: Response) => {
  const users = await UserModel
    .find({})
    .populate("blogs", { url: 1, title: 1, author: 1 });
  response.json(users);
});

usersRouter.post("/", async (request: Request, response: Response) => {
  const { username, name, password } = request.body;
  if (!(password?.length >= 3)) {
    response.status(400).json({ error: "Password must be at least 3 characters long"});
    return;
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new UserModel({ username, name, passwordHash, blogs: [] });
  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

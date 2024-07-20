import express, { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { UserModel } from '../models/user';

export const loginRouter = express.Router();

loginRouter.post('/', async (request: Request, response: Response) => {
  const { username, password } = request.body;

  const user = await UserModel.findOne({ username });
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    response.status(401).json({
      error: 'invalid username or password'
    });
    return;
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(
    userForToken,
    process.env.SECRET!,
    // 1 hour valid token
    { expiresIn: 60*60 }
  );

  response
    .status(200)
    .send({ id: user._id, token, username: user.username, name: user.name });
});

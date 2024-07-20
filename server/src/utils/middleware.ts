import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import * as logger from './logger';
import * as config from "./config";
import { TokenRequest, UserRequest } from "../types";
import { UserModel } from "../models/user";

export const requestLogger = (request: Request, _response: Response, next: NextFunction) => {
  logger.info('Method:', request.method);
  logger.info('Path:  ', request.path);
  logger.info('Body:  ', request.body);
  logger.info('---');
  next();
};

export const unknownEndpoint = (_request: Request, response: Response,) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

export const errorHandler = (error: Error, _request: Request, response: Response, next: NextFunction) => {
  logger.error(error.message);

  switch (error.name) {
    case "CastError":
      return response.status(400).send({ error: 'malformed id' });
    case "ValidationError":
      return response.status(400).json({ error: error.message });
    case "MongoServerError":
      if (error.message.includes('E11000 duplicate key error')) {
        return response.status(400).json({ error: 'expected `username` to be unique' });
      }
      break;
    case "JsonWebTokenError":
      return response.status(401).json({ error: "token invalid" });
    case "TokenExpiredError":
      return response.status(401).json({ error: "token expired" });
  }

  next(error);
  return;
};

export const tokenExtractor = (request: TokenRequest, _response: Response, next: NextFunction) => {
  const authorization = request.get("authorization");
  if (authorization?.startsWith("Bearer ")) {
    request.token = authorization.replace("Bearer ", "");
  }
  next();
};

export const userExtractor = async (request: UserRequest, _response: Response, next: NextFunction) => {
  if (request.token) {
    const decodedToken = jwt.verify(request.token, config.SECRET!) as JwtPayload;
    if (!decodedToken.id) {
      next({ name: "JsonWebTokenError" });
    }
    try {
      const user = await UserModel.findById(decodedToken.id);

      if (user == null) {
        throw new Error(`User with id ${decodedToken.id} could not be found`);
      }

      request.user = user;
    } catch(error) {
      next(error);
    }
  }
  next();
};

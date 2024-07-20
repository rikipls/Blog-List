import { Types, Document } from "mongoose";
import { Request } from "express";

export interface User {
  id: string,
  username: string,
  name?: string,
  passwordHash: string,
  blogs: Types.ObjectId[]
}

export type MongoUser = Document<unknown, {}, User> & User & { _id: Types.ObjectId };

// For use in tests; see ./src/tests/test_helper.ts
export type UserData = Omit<User, 'id'> & { _id?: string, __v?: 0 };

export interface Blog {
  title: string,
  author?: string,
  url: string,
  likes: number,
  user: Types.ObjectId
}

export type MongoBlog = Document<unknown, {}, Blog> & Blog & { _id: Types.ObjectId };

// For use in tests; see ./src/tests/test_helper.ts
export type BlogData = Omit<Blog, "user"> & { _id?: string, __v?: 0 };

export interface TokenRequest extends Request {
  token?: string
}

export interface UserRequest extends TokenRequest {
  user?: MongoUser
}
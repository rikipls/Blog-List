import express, { Request, Response} from "express";
import { Types } from "mongoose";

import { BlogModel } from "../models/blog";
import { UserRequest } from "../types";
import * as blogParsing from "../utils/parsing/blog_parsing";

export const blogsRouter = express.Router();

blogsRouter.get('/', async (_request: Request, response: Response) => {
  const blogs = await BlogModel
    .find({})
    .populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post('/', async (request: UserRequest, response: Response) => {
  const body = request.body;
  const user = request.user;

  if (user === undefined) {
    response.status(401).json({ error: "blog cannot be posted without a valid user"});
    return;
  }

  if (body == undefined) {
    response.status(400).json({ error: "missing/malformed request body"});
    return;
  }

  let blogFields;
  try {
    blogFields = blogParsing.toBlog({ ...body, user: user.id});
  }
  catch (error: unknown) {
    const msg = `missing/malformed request body: ${error instanceof Error ? error.message : ""}`;
    response.status(400).json({ error: msg});
    return;
  }

  const newBlog = new BlogModel(blogFields);
  const savedBlog = await newBlog.save();
  user.blogs = user.blogs.concat(savedBlog._id as Types.ObjectId);
  await user.save();
  await savedBlog.populate("user", { username: 1, name: 1 });
  response.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', async (request: UserRequest, response: Response) => {
  const user = request.user;
  const id = request.params.id;

  if (user === undefined) {
    response.status(400).json({ error: "blog cannot be deleted without a valid user" });
    return;
  }

  const blog = await BlogModel.findById(id);
  
  if (blog?.user.toString() !== user.id.toString()) {
    response.status(401).json({ error: "cannot delete other user's data" });
    return;
  }
  
  await BlogModel.findByIdAndDelete(id);
  response.status(204).end();
});

blogsRouter.put('/:id', async (request: UserRequest, response: Response) => {
  const user = request.user;
  const body = request.body;
  const { action } = request.query;

  if (user === undefined) {
    response.status(401).json({ error: "blog cannot be updated without a valid user"});
    return;
  }

  if (body == undefined) {
    response.status(400).json({ error: "missing/malformed request body"});
    return;
  }

  let blog;
  try {
    blog = blogParsing.toBlog({...body, user: user.id});
  }
  catch (error: unknown) {
    const msg = `missing/malformed request body: ${error instanceof Error ? error.message : ""}`;
    response.status(400).json({ error: msg });
    return;
  }


  const existingBlog = await BlogModel.findById(request.params.id);
  if (existingBlog === null) {
    response.status(404).json({ error: `blog with id ${request.params.id} not found`});
    return;
  }
  
  else if (action !== "like" && existingBlog.user.toString() !== blog.user.toString()) {
    response.status(401).json({ error: "cannot update other user's data" });
    return;
  }

  // Ensure that if a put request is made by a different user, it doesn't
  // overwrite the original user's identity (e.g. liking a blog post)
  blog.user = existingBlog.user;

  const updatedBlog = await BlogModel
    .findByIdAndUpdate(request.params.id, blog, { new: true })
    .populate("user", { username: 1, name: 1 });

  response.json(updatedBlog);
});

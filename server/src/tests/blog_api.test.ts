import { test, after, beforeEach, describe } from 'node:test';
import assert from 'node:assert';

import mongoose from 'mongoose';
import supertest from 'supertest';

import { app } from '../app';
import { BlogModel } from "../models/blog";
import { UserModel } from "../models/user";
import * as helper from "./test_helper";
import { MongoBlog } from '../types';

const api = supertest(app);

describe("Blog api", () => {
  beforeEach(async () => {
    // Initialize users
    await UserModel.deleteMany({});
    const initPromiseArray = helper.initialUsers.map(user => new UserModel(user).save());
    const users = await Promise.all(initPromiseArray);
    const user = users[0];
    // Initialize blogs and assign them all to one user
    await BlogModel.deleteMany({});

    const intermedPromiseArray = helper.initialBlogs.map(blog => {
      return new BlogModel({ user: user.id, ...blog}).save();
    });
    const savedBlogs = await Promise.all(intermedPromiseArray);
    const ids = savedBlogs.map(blog => blog._id);
    user.blogs = user.blogs.concat(ids);
    await user.save();
    
    // A custom user to use across tests
    const newUser = {
      name: "Dr. Martin",
      username: "drmarten",
      password: "boots"
    };
    
    // Create fresh user first
    let response = await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    
    // Login with the user to retrieve a token
    response = await api
      .post("/api/login")
      .send(newUser)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    // Save token; attach in `Authorization` header when needed
    // as in https://github.com/ladjs/supertest/issues/398
    process.env.token = response.body.token;
  });

  test("correct number of blogs", async () => {
    const response = await api.get("/api/blogs");
    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test("unique identifier 'id' is defined", async () => {
    const response = await api.get("/api/blogs");
    response.body.forEach((blog: MongoBlog) => {
      assert.notStrictEqual(blog.id, undefined);

      assert.strictEqual(blog._id, undefined);
      assert.strictEqual(blog.__v, undefined);
    });
  });

  test("create a new blog post", async () => {
    const newBlog = {
      title: "a",
      author: "b",
      url: "c",
      likes: 5,
    };

    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${process.env.token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    
    const addedBlog = response.body;

    assert.strictEqual(addedBlog.title, newBlog.title);
    assert.strictEqual(addedBlog.author, newBlog.author);
    assert.strictEqual(addedBlog.url, newBlog.url);
    assert.strictEqual(addedBlog.likes, newBlog.likes);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);
  });

  test("'likes' has a default value of 0", async () => {
    // likes is undefined
    const newBlog = {
      title: "d",
      author: "e",
      url: "f",
    };

    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${process.env.token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    
    const addedBlog = response.body;

    // Default value of 0
    assert.strictEqual(addedBlog.likes, 0);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);
  });

  // Change utils/middleware.js/errorHandler to use console.error instead of
  // logger.error to stop silencing errors in test mode
  test("'title' and 'url' are required", async () => {
    const titleUrlUndef = {
      author: "g",
      likes: 1,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${process.env.token}`)
      .send(titleUrlUndef)
      .expect(400);
    
    let blogsInMiddle = await helper.blogsInDb();
    assert.strictEqual(blogsInMiddle.length, helper.initialBlogs.length);

    // url is undefined
    const urlUndef = {
      title: "h",
      author: "g",
      likes: 1
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${process.env.token}`)
      .send(urlUndef)
      .expect(400);
    
    blogsInMiddle = await helper.blogsInDb();
    assert.strictEqual(blogsInMiddle.length, helper.initialBlogs.length);

    // title is undefined
    const titleUndef = {
      author: "g",
      url: "i",
      likes: 1
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${process.env.token}`)
      .send(titleUndef)
      .expect(400);
    
    blogsInMiddle = await helper.blogsInDb();
    assert.strictEqual(blogsInMiddle.length, helper.initialBlogs.length);

    // both are defined
    const newBlog = {
      title: "j",
      author: "k",
      url: "l",
      likes: 1
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${process.env.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);
  });

  test("deleting a single blog post", async () => {
    const newBlog = {
      title: "a",
      author: "b",
      url: "c",
      likes: 5,
    };

    // First create
    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${process.env.token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtMiddle = await helper.blogsInDb();
    assert.strictEqual(blogsAtMiddle.length, helper.initialBlogs.length + 1);

    const deleteId = response.body.id;

    // Then delete
    await api
      .delete(`/api/blogs/${deleteId}`)
      .set("Authorization", `Bearer ${process.env.token}`)
      .expect(204);

    // Removed blog that was just added, so size returns to normal
    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);

    const ids = blogsAtEnd.map(blog => blog.id);
    assert(!ids.includes(deleteId));
  });
  
  test("updating a blog post", async () => {
    const blogToCreate = {
      title: "a",
      author: "b",
      url: "c",
      likes: 5,
    };

    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${process.env.token}`)
      .send(blogToCreate)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    
    const addedBlog = response.body;

    assert.strictEqual(addedBlog.title, blogToCreate.title);
    assert.strictEqual(addedBlog.author, blogToCreate.author);
    assert.strictEqual(addedBlog.url, blogToCreate.url);
    assert.strictEqual(addedBlog.likes, blogToCreate.likes);

    const blogsAtMiddle = await helper.blogsInDb();
    assert.strictEqual(blogsAtMiddle.length, helper.initialBlogs.length + 1);

    const blogToUpdate = blogsAtMiddle.at(-1);

    const newBlog = {
      ...blogToUpdate,
      title: "BlahBlahBlah",
      likes: 5000,
    };

    await api
      .put(`/api/blogs/${newBlog.id}`)
      .set("Authorization", `Bearer ${process.env.token}`)
      .send(newBlog)
      .expect(200);
    
    const blogsAtEnd = await helper.blogsInDb();
    const updatedBlog = blogsAtEnd.at(-1);

    assert.strictEqual(updatedBlog?.title, "BlahBlahBlah");
    assert.strictEqual(updatedBlog?.likes, 5000);
  });

  test("posting a blog fails without a token", async () => {
    const newBlog = {
      title: "a",
      author: "b",
      url: "c",
      likes: 5,
    };

    // No token in authorization header
    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(401);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);

  });

  after(async () => {
    await mongoose.connection.close();
  });
});


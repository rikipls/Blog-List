import { UserModel } from "../models/user";
import { BlogModel } from "../models/blog";
import { UserData, BlogData, MongoBlog, MongoUser } from "../types";

export const listWithOneBlog: BlogData[] = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0,
  }
];

export const initialBlogs: BlogData[]  = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  }
];

export const listWithOneUser = [
  {
    _id: "66612df144bc5088eef2c691",
    username: "hellas",
    name: "Arto Hellas",
    passwordHash: "$2b$10$LZGdwrp/Akv8uJn8TlfZ8OjBbOWOdpSq8dQFp7kOsgHUJ2BfJ/3Yi",
    blogs: [],
    __v: 0
  }
];

export const initialUsers: UserData[] = [
  {
    _id: "66612df144bc5088eef2c691",
    username: "hellas",
    name: "Arto Hellas",
    passwordHash: "$2b$10$LZGdwrp/Akv8uJn8TlfZ8OjBbOWOdpSq8dQFp7kOsgHUJ2BfJ/3Yi",
    blogs: [],
    __v: 0
  },
  {
    _id: "6661e05b428847215d5cf63f",
    username: "mluukkai",
    name: "Matti Luukkainen",
    passwordHash: "$2b$10$SzJVLRW0HL6QDVvj72b8HedH9cObhM0RWCbUHyGkyvMJ4wl6KEokS",
    blogs: [],
    __v: 0
  }
];

export const nonExistingBlogId = async () => {
  const sample: BlogData = {
    title: "will be deleted",
    author: "will be deleted",
    url: "will be deleted",
    likes: 0
  };
  const blog = new BlogModel(sample);
  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

export const blogsInDb = async (): Promise<MongoBlog[]> => {
  const blogs = await BlogModel.find({});
  return blogs.map(blog => blog.toJSON());
};

export const usersInDb = async (): Promise<MongoUser[]> => {
  const users = await UserModel.find({});
  return users.map(user => user.toJSON());
};

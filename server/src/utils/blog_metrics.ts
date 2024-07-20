import lodash from "lodash";

import { Blog } from "../types";

export const totalLikes = (blogs: Blog[]): number => {
  return blogs.reduce((total, currBlog) => total + currBlog.likes, 0);
};

export const favoriteBlog = (blogs: Blog[]): Blog | null => {
  let res = { likes: -1 } as Blog;
  res = blogs.reduce((currMax, currBlog) => {
    return currBlog.likes  > currMax.likes ? currBlog : currMax;
  }, res);
  return res.likes === -1 ? null : res;
};

export const mostBlogs = (blogs: Blog[]): { author: string, blogs: number } | null => {
  if (blogs.length === 0) {
    return null;
  }
  const counts = lodash.countBy(blogs, blog => blog.author);
  const res = lodash.maxBy(Object.entries(counts), count => count[1]);
  return res !== undefined ? { author: res[0], blogs: res[1] } : null;
};

export const mostLikes = (blogs: Blog[]): { author: string, likes: number } | null => {
  if (blogs.length === 0) {
    return null;
  }
  const count = new Map();
  blogs.forEach(blog => {
    count.set(blog.author, (count.get(blog.author) ?? 0) + blog.likes);
  });
  const res = lodash.maxBy(Array.from(count.entries()), countPair => countPair[1]);
  return res !== undefined ? { author: res[0], likes: res[1] } : null;
};


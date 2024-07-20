import { useState } from "react";
import { BlogData, UserData } from "../types";

import * as blogService from "../services/blogs";

interface BlogProps {
  user: UserData,
  currBlog: BlogData
  blogs: BlogData[],
  setBlogs: React.Dispatch<React.SetStateAction<BlogData[]>>
}

export const Blog = ({ user, currBlog, blogs, setBlogs }: BlogProps) => {
  const [fullVisibility, setFullVisibility] = useState(false);

  const buttonText = fullVisibility ? "hide" : "view";

  const handleLike = async () => {
    const id = currBlog.id;
    const newBlog = {...currBlog, likes: currBlog.likes + 1};
    const returnedBlog = await blogService.replaceBlog(id, newBlog, { action: "like"});
    const newBlogs = blogs.map(blog => blog.id === currBlog.id ? returnedBlog : blog);
    newBlogs.sort((a, b) => b.likes - a.likes);
    setBlogs(newBlogs);
  };

  const handleDelete = async () => {
    if (window.confirm(`Remove blog ${currBlog.title}`)) {
      const id = currBlog.id;
      await blogService.deleteBlog(id);
      setBlogs(blogs.filter(blog => blog.id !== currBlog.id));
    }
  };

  const deleteDisplay: { visibility: "visible" | "hidden" } = { visibility: user.id === currBlog.user.id ? "visible" : "hidden"};

  const full = !fullVisibility ? null : (
    <>
    <br/>
    {currBlog.url}
    <br/>
    {currBlog.likes} likes <button onClick={handleLike}>like</button>
    <br/>
    {currBlog.user.name}
    <br/>
    <button onClick={handleDelete} style={deleteDisplay}>remove</button>
    </>
  );

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  };

  return (
    <div style={blogStyle}>
      {currBlog.title} {currBlog.author} <button onClick={() => setFullVisibility(!fullVisibility)}>{buttonText}</button>
      {full}
    </div>  
  );
};

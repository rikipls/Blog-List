import { useState } from 'react';
import { AxiosError } from 'axios';

import * as blogService from "../services/blogs";
import { BlogData, UserData } from '../types';

interface CreateBlogProps {
  user: UserData | null,
  blogs: BlogData[],
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>,
  setNotifMessage: React.Dispatch<React.SetStateAction<string>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
  setBlogs: React.Dispatch<React.SetStateAction<BlogData[]>>,
  toggleForm: () => void
}

export const CreateBlog = (props : CreateBlogProps) => {
  if (props.user === null) {
    return null;
  }

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleNewBlog = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    try {
      const newBlog = await blogService.create({ title, author, url });

      props.setBlogs(props.blogs.concat(newBlog));

      props.setNotifMessage(`A new blog ${newBlog.title} by ${newBlog.author} was added`);
      setTimeout(() => props.setNotifMessage(""), 5000);
      setTitle("");
      setAuthor("");
      setUrl("");
      props.toggleForm();
    }
    catch (error: unknown) {
      const msg = error instanceof AxiosError ? error.response?.data.error : String(error);

      // Auto-logout in an expired token
      if (msg === "token expired") {
        props.setErrorMessage("Expired session. Logging out...");
        setTimeout(() => {
          props.setErrorMessage("");
          props.setUser(null);
        }, 3000);
      }
      else {
        props.setErrorMessage(msg);
        setTimeout(() => props.setErrorMessage(""), 5000);
      }
    }

  };

  return (
    <div>
      <h2>Create new blog</h2>

      <form onSubmit={handleNewBlog}>
        <div>
          Title:
          <input
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          Author: 
          <input
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          URL: 
          <input
            type="text"
            value={url}
            name="URL"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

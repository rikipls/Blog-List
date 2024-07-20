import { useState, useEffect } from 'react';

import { Bloglist } from "./components/Bloglist";

import * as blogService from './services/blogs';
import { BlogData, UserData } from './types';
import { FrontPage } from './components/FrontPage';

export const App = () => {
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    blogService.getAll().then(blogs => {
      blogs.sort((a, b) => b.likes - a.likes);
      setBlogs(blogs);
    });  
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBloglistUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  return (
    <div>
      <FrontPage user={user} setUser={setUser}/>
      <Bloglist blogs={blogs} user={user} setUser={setUser} setBlogs={setBlogs}/>
    </div>
  );
};

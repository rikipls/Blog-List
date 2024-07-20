import { useState, useRef } from 'react';

import { Blog } from './Blog';
import { CreateBlog } from './CreateBlog';
import { AppNotification } from "./AppNotification";
import { ErrorNotification } from './ErrorNotification';
import { Togglable, TogglableRef } from './Togglable';
import { BlogData, UserData } from '../types';

interface BloglistProps {
  blogs: BlogData[],
  user: UserData | null,
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>,
  setBlogs: React.Dispatch<React.SetStateAction<BlogData[]>>
}

export const Bloglist = (props: BloglistProps) => {
  if (props.user === null) {
    return null;
  }

  const [notifMessage, setNotifMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogout = () => {
    props.setUser(null);
    window.localStorage.removeItem("loggedBloglistUser");
  };

  const blogFormRef = useRef<TogglableRef>(null);

  const toggleForm = () => {
    blogFormRef.current?.toggleVisibility();
  };

  return (
    <div>
      <h2>Blogs</h2>

      <AppNotification notifMessage={notifMessage}/>
      <ErrorNotification errorMessage={errorMessage}/>

      {props.user.name} logged in
      <button type="button" onClick={handleLogout}>logout</button>

      <Togglable buttonLabel="create blog" ref={blogFormRef}>
        <CreateBlog
          user={props.user}
          setUser={props.setUser}
          blogs={props.blogs}
          setBlogs={props.setBlogs}
          setNotifMessage={setNotifMessage}
          setErrorMessage={setErrorMessage}
          toggleForm={toggleForm}
        />
      </Togglable>

      <br/>
      {props.blogs.map(blog => <Blog key={blog.id} user={props.user!} currBlog={blog} blogs={props.blogs} setBlogs={props.setBlogs}/>)}
    </div>
  );
};

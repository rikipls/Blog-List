import { useState } from 'react';

import * as loginService from '../services/login';
import * as blogService from "../services/blogs";
import { UserData } from '../types';
import { AxiosError } from 'axios';

interface LoginProps {
  login: boolean
  user: UserData | null,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>
  setLogin: React.Dispatch<React.SetStateAction<boolean>>
  children?: React.ReactNode
}

export const Login = (props: LoginProps) => {
  if (props.user !== null || !props.login) {
    return null;
  }

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event: React.SyntheticEvent)=> {
    event.preventDefault();
    try {
      const data = await loginService.login({ username, password });

      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(data));
      blogService.setToken(data.token);
      props.setUser(data);
      setUsername("");
      setPassword("");
    }
    catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        props.setErrorMessage(`Error: ${error.response.data.error}`);
      }
      else {
        props.setErrorMessage("Could not login");
      }
      setTimeout(() => props.setErrorMessage(""), 5000);
    }
  };

  return (
    <div>
      <h2>Log into the Bloglist</h2>
      {props.children}
      <button onClick={() => props.setLogin(false)}>sign up</button>
      <form onSubmit={handleLogin}>
        <div>
          Username: 
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          Password: 
          <input
            type="text"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

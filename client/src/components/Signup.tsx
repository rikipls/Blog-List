import { useState } from 'react';

import * as signupService from "../services/signup";
import { UserData } from '../types';
import { AxiosError } from 'axios';

interface SignupProps {
  login: boolean
  user: UserData | null,
  setLogin: React.Dispatch<React.SetStateAction<boolean>>
  setNotifMessage: React.Dispatch<React.SetStateAction<string>>
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>
  children?: React.ReactNode
}

export const Signup = (props: SignupProps) => {
  if (props.user !== null || props.login) {
    return null;
  }
  console.log("Help pls");

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (event: React.SyntheticEvent)=> {
    event.preventDefault();
    try {
      const data = await signupService.signup({ name, username, password });

      setName("");
      setUsername("");
      setPassword("");
      props.setLogin(true);
      props.setNotifMessage(`User ${data.name} signed up`);
      setTimeout(() => props.setNotifMessage(""), 5000);
      console.log("Help");
    }
    catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        props.setErrorMessage(`Error: ${error.response.data.error}`);
      }
      else {
        props.setErrorMessage("Could not create user");
      }
      setTimeout(() => props.setErrorMessage(""), 5000);
    }
  };

  return (
    <div>
      <h2>Sign up for the Bloglist</h2>
      {props.children}
      <button onClick={() => props.setLogin(true)}>back to login</button>
      <form onSubmit={handleSignup}>
        <div>
          Name: 
          <input
            type="text"
            value={name}
            name="Name"
            onChange={({ target }) => setName(target.value)}
          />
        </div>
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
        <button type="submit">sign up</button>
      </form>
    </div>
  );
};

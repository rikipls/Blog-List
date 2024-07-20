import { useState } from "react";
import { UserData } from "../types";
import { Login } from "./Login";
import { Signup } from "./Signup";
import { AppNotification } from "./AppNotification";
import { ErrorNotification } from "./ErrorNotification";

interface FrontPageProps {
  user: UserData | null,
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>

}

export const FrontPage = ({ user, setUser }: FrontPageProps) => {
  if (user !== null) {
    return null;
  }
  const [login, setLogin] = useState(true);
  const [notifMessage, setNotifMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <>
    <Signup login={login} user={user} setLogin={setLogin} setNotifMessage={setNotifMessage} setErrorMessage={setErrorMessage}>
      <AppNotification notifMessage={notifMessage}/>
      <ErrorNotification errorMessage={errorMessage}/>
    </Signup>

    <Login login={login} user={user} setUser={setUser} setLogin={setLogin} setErrorMessage={setErrorMessage}>
      <AppNotification notifMessage={notifMessage}/>
      <ErrorNotification errorMessage={errorMessage}/>
    </Login>
    </>
  );
};
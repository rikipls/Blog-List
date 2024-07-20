interface AppNotificationProps {
  notifMessage: string
}

export const AppNotification = ({ notifMessage }: AppNotificationProps) => {
  if (notifMessage === "") {
    return null;
  }

  const style = {
    color: "green",
    backgroundColor: "WhiteSmoke",
    borderStyle: "solid",
    borderRadius: "5px",
    borderColor: "green",
    fontSize: 20
  };

  return (
    <p style={style}>{notifMessage}</p>
  );
};

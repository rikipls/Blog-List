interface ErrorNotificationProps {
  errorMessage: string
}

export const ErrorNotification = ({ errorMessage }: ErrorNotificationProps) => {
  if (errorMessage === "") {
    return null;
  }

  const style = {
    color: "red",
    backgroundColor: "WhiteSmoke",
    borderStyle: "solid",
    borderRadius: "5px",
    borderColor: "red",
    fontSize: 20
  };

  return (
    <p style={style}>{errorMessage}</p>
  );
};

import axios from "axios";
import { UserData } from "../types";
const baseUrl = "/api/users";

export const signup = async (credentials: { username: string, name: string, password: string}): Promise<UserData> => {
  const response = await axios.post(baseUrl, credentials);
  return response.data;
};
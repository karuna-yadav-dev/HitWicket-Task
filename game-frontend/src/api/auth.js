import axiosInstance from "./init";
import Cookies from "js-cookie";

export const register = async (userData) => {
  try {
    const response = await axiosInstance.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error registering user");
  }
};

export const login = async (credentials) => {
  try {
    const response = await axiosInstance.post("/auth/login", credentials);
    const data = response.data;
    Cookies.set("token", data.token, { expires: 7 });
    Cookies.set("userId", data.userId, { expires: 7 });
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error logging in");
  }
};

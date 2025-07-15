import axiosInstance from "./init";
import Cookies from "js-cookie";

export const makeMove = async (roomId, from, to) => {
  try {
    const token = Cookies.get("token");
    const response = await axiosInstance.post(
      "/game/move",
      {
        roomId,
        from,
        to,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error making move:",
      error.response?.data?.error || error.message
    );
    throw error;
  }
};

import axios from "./init";
import Cookies from "js-cookie";

// Function to create a new room
export const createRoom = async () => {
  try {
    const token = Cookies.get("token");
    const response = await axios.post(
      "/room/create",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to create room");
  }
};

// Function to join an existing room
export const joinRoom = async (code) => {
  try {
    const token = Cookies.get("token");
    const response = await axios.post(
      "/room/join",
      { code },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to join room");
  }
};

// Function to get the state of a room
export const getRoomState = async (roomId) => {
  try {
    const token = Cookies.get("token");
    const response = await axios.get(`/room/${roomId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to get room state");
  }
};

export const makeMove = async (roomId, move) => {
  try {
    const token = Cookies.get("token");
    const response = await axios.post(
      "/room/move",
      { roomId, move },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to make move");
  }
};

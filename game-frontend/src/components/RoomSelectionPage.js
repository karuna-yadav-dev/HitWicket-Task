import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "../styles/roomSelection.css";
import { createRoom, joinRoom } from "../api/room";

function RoomSelectionPage() {
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    createRoom().then((data) => {
      Cookies.set("roomId", data.roomId);
      Cookies.set("roomCode", data.roomCode);
      navigate("/game");
    });
  };

  const handleJoinRoom = () => {
    let roomCode = window.prompt("Enter room code");
    roomCode = roomCode.trim().toUpperCase();
    joinRoom(roomCode).then((data) => {
      Cookies.set("roomId", data.roomId);
      Cookies.set("roomCode", data.roomCode);
      navigate("/game");
    });
  };

  useEffect(() => {
    const token = Cookies.get("token");
    console.log(token);
    console.log(Cookies.get("userId"));
    if (!token) {
      navigate("/");
    }
  }, []);

  return (
    <div className="room-selection-container">
      <h2>Choose an Option</h2>
      <button onClick={handleCreateRoom}>Create Room</button>
      <button onClick={handleJoinRoom}>Join Room</button>
    </div>
  );
}

export default RoomSelectionPage;

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import GameBoard from "./GameBoard";
import { getRoomState, makeMove } from "../api/room"; // Import the room API functions
import "../styles/game.css";

function GamePage() {
  const [gameState, setGameState] = useState(
    [...Array(5)].map(() => Array(5).fill(null))
  );
  const [playerTurn, setPlayerTurn] = useState(null);
  const [moveHistory, setMoveHistory] = useState([]);
  const [winner, setWinner] = useState(null);
  const [ws, setWs] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const roomId = Cookies.get("roomId");
    if (!roomId) {
      navigate("/rooms");
      return;
    }

    // Fetch the room state from the backend
    const fetchRoomState = async () => {
      try {
        const data = await getRoomState(roomId);
        const roomState = data.room;
        const logs = data.logs;
        setGameState(JSON.parse(roomState.boardState));
        console.log(roomState);
        setPlayerTurn(
          roomState.currentPlayer === roomState.player1Id
            ? "Player A"
            : "Player B"
        );
      } catch (error) {
        console.error("Failed to fetch room state:", error);
        navigate("/rooms");
      }
    };

    fetchRoomState();

    const socket = new WebSocket("ws://localhost:5000");

    socket.onopen = () => {
      setWs(socket);
    };

    socket.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.type === "UPDATE_BOARD" && data.roomId === roomId) {
        fetchRoomState(roomId);
      }
    };

    return () => {
      socket.close();
    };
  }, [navigate]);

  const handleMove = async (x, y) => {
    try {
      const roomId = Cookies.get("roomId");
      const move = { x, y }; // Adjust this according to your move format
      const result = await makeMove(roomId, move);

      setGameState(JSON.parse(result.boardState));
      console.log(JSON.parse(result.boardState));
      setMoveHistory([...moveHistory, `${playerTurn}: Moved to (${x}, ${y})`]);

      if (result.winner) {
        setWinner(playerTurn);
      } else {
        setPlayerTurn(playerTurn === "Player A" ? "Player B" : "Player A");
      }
    } catch (error) {
      console.error("Failed to make move:", error);
    }
  };

  return (
    <div className="game-page-container">
      <h1>Advanced Chess-like Game</h1>
      {winner && <div className="winner-banner">{winner} wins!</div>}
      <GameBoard
        gameState={gameState}
        setBoardState={setGameState}
        onMove={handleMove}
        currentPlayerId={Cookies.get("userId")}
      />
      <div className="move-history">
        <h2>Move History</h2>
        <ul>
          {moveHistory.map((move, index) => (
            <li key={index}>{move}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default GamePage;

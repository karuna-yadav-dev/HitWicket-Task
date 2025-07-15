const { Room, Log, User } = require("../models");
const { generateRoomCode } = require("../services/roomService");
const { executeMove } = require("../services/gameLogic");
const wss = require("../ws/websocket");
const WebSocket = require("ws");

const createInitialBoardState = (player1Id, player2Id) => {
  const emptyCell = { character: null, userId: null, status: null };

  const board = Array.from({ length: 5 }, () =>
    Array.from({ length: 5 }, () => ({ ...emptyCell }))
  );

  board[0] = [
    { character: "Hero1", userId: player1Id, status: "alive" },
    { character: "Pawn", userId: player1Id, status: "alive" },
    { character: "Hero2", userId: player1Id, status: "alive" },
    { character: "Pawn", userId: player1Id, status: "alive" },
    { character: "Pawn", userId: player1Id, status: "alive" },
  ];

  board[4] = [
    { character: "Hero1", userId: player2Id, status: "alive" },
    { character: "Pawn", userId: player2Id, status: "alive" },
    { character: "Hero2", userId: player2Id, status: "alive" },
    { character: "Pawn", userId: player2Id, status: "alive" },
    { character: "Pawn", userId: player2Id, status: "alive" },
  ];

  return board;
};

exports.createRoom = async (req, res) => {
  try {
    const userId = req.user.id;
    const code = generateRoomCode();

    const boardState = createInitialBoardState(userId, null);

    const room = await Room.create({
      code,
      player1Id: userId,
      currentPlayer: userId,
      boardState: JSON.stringify(boardState),
      status: "waiting",
    });

    res.json({ roomCode: room.code, roomId: room.id });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create room", message: error.message });
  }
};

exports.joinRoom = async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user.id;

    const room = await Room.findOne({ where: { code } });

    if (!room || room.status !== "waiting") {
      return res.status(400).json({ error: "Room not available" });
    }

    // Update the board state with Player 2's ID
    room.boardState = JSON.stringify(
      createInitialBoardState(room.player1Id, userId)
    );

    room.player2Id = userId;
    room.status = "active";
    await room.save();

    res.json({
      message: "Joined room successfully",
      roomCode: room.code,
      roomId: room.id,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to join room" });
  }
};

exports.getRoomState = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findByPk(roomId);

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    const logs = await Log.findAll({
      where: { roomId },
    });

    res.json(room, logs);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to get room state", message: error.message });
  }
};

exports.makeMove = async (req, res) => {
  try {
    const { roomId, from, to } = req.body;
    const userId = req.user.id;
    const room = await Room.findByPk(roomId);
    if (!room || room.status !== "active") {
      if (room.status === "waiting") {
        return res.status(400).json({ error: "Waiting for player 2" });
      } else return res.status(400).json({ error: "Invalid room" });
    }

    if (room.currentPlayer !== userId) {
      return res.status(403).json({ error: "Not your turn" });
    }

    const result = executeMove(room, from, to, userId);

    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    if (result.winner) {
      room.status = "completed";
    }

    // room.boardState is not getting updated because it is a JSON object
    // We need to update it and save it back to the database

    room.boardState = JSON.stringify(result.boardState);
    room.currentPlayer = result.nextPlayer;
    await room.save();

    await Log.create({
      roomId: room.id,
      playerId: userId,
      character: result.character,
      from: result.from,
      to: result.to,
    });

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: "UPDATE_BOARD", roomId }));
      }
    });

    res.json({ boardState: room.boardState, winner: result.winner });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to make move", message: error.message });
  }
};

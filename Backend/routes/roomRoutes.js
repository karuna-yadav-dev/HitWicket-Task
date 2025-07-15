const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  createRoom,
  joinRoom,
  getRoomState,
} = require("../controllers/roomController");

const router = express.Router();

router.post("/create", authMiddleware, createRoom);
router.post("/join", authMiddleware, joinRoom);
router.get("/:roomId", authMiddleware, getRoomState);

module.exports = router;

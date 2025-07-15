const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { makeMove } = require("../controllers/roomController");

const router = express.Router();

router.post("/move", authMiddleware, makeMove);

module.exports = router;

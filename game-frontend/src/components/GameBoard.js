import React from "react";
import "../styles/game.css";
import Cookies from "js-cookie";
import { makeMove } from "../api/game";

function GameBoard({ gameState, setBoardState, onMove, currentPlayerId }) {
  const [selectedCell, setSelectedCell] = React.useState(null);
  const [possibleMoves, setPossibleMoves] = React.useState([]);

  const calculatePossibleMoves = (rowIndex, cellIndex, character) => {
    const moves = [];
    const directions = {
      Pawn: [
        { dr: -1, dc: 0 }, // Forward
        { dr: 1, dc: 0 }, // Backward
        { dr: 0, dc: -1 }, // Left
        { dr: 0, dc: 1 }, // Right
      ],
      Hero1: [
        { dr: -2, dc: 0 }, // Forward 2
        { dr: 2, dc: 0 }, // Backward 2
        { dr: 0, dc: -2 }, // Left 2
        { dr: 0, dc: 2 }, // Right 2
      ],
      Hero2: [
        { dr: -2, dc: -2 }, // Forward-Left 2
        { dr: -2, dc: 2 }, // Forward-Right 2
        { dr: 2, dc: -2 }, // Backward-Left 2
        { dr: 2, dc: 2 }, // Backward-Right 2
      ],
    };

    const validDirections = directions[character];
    validDirections.forEach(({ dr, dc }) => {
      const newRow = rowIndex + dr;
      const newCol = cellIndex + dc;
      if (
        newRow >= 0 &&
        newRow < 5 &&
        newCol >= 0 &&
        newCol < 5 &&
        (!gameState[newRow][newCol] ||
          gameState[newRow][newCol].userId !== currentPlayerId)
      ) {
        moves.push({ row: newRow, col: newCol });
      }
    });

    return moves;
  };

  const handleCellClick = (rowIndex, cellIndex) => {
    const selectedCharacter = gameState[rowIndex][cellIndex];
    if (
      selectedCharacter &&
      selectedCharacter.status === "alive" &&
      selectedCharacter.userId === currentPlayerId
    ) {
      setSelectedCell({ rowIndex, cellIndex });
      setPossibleMoves(
        calculatePossibleMoves(rowIndex, cellIndex, selectedCharacter.character)
      );
    } else if (selectedCell) {
      const validMove = possibleMoves.find(
        (move) => move.row === rowIndex && move.col === cellIndex
      );
      if (validMove) {
        onMove(
          selectedCell.rowIndex,
          selectedCell.cellIndex,
          rowIndex,
          cellIndex
        );
        setSelectedCell(null);
        setPossibleMoves([]);
      }
    }
  };

  const makeAMove = async (toRow, toCol) => {
    try {
      const from = {
        rowIndex: selectedCell.rowIndex,
        cellIndex: selectedCell.cellIndex,
      };
      const to = { rowIndex: toRow, cellIndex: toCol };
      const result = await makeMove(Cookies.get("roomId"), from, to);

      setBoardState(JSON.parse(result.boardState));
      setSelectedCell(null);
      setPossibleMoves([]);

      if (result.winner) {
        alert(`Game over! ${result.winner} wins!`);
      }
    } catch (error) {
      alert(error.response?.data?.error || "Failed to make move.");
      setSelectedCell(null);
      setPossibleMoves([]);
    }
  };

  return (
    <div className="game-board-container">
      <div className="game-board">
        {gameState.map((row, rowIndex) => (
          <div key={rowIndex} className="game-row">
            {row.map((cell, cellIndex) => (
              <div
                key={cellIndex}
                onClick={() => handleCellClick(rowIndex, cellIndex)}
                className={`game-cell ${
                  cell && cell.status === "alive" ? "occupied" : ""
                } ${
                  selectedCell &&
                  selectedCell.rowIndex === rowIndex &&
                  selectedCell.cellIndex === cellIndex
                    ? "selected"
                    : ""
                } ${
                  cell && cell.userId !== currentPlayerId ? "unclickable" : ""
                }`}
              >
                {cell && cell.character && cell.status === "alive"
                  ? `${cell.character[0]}-${
                      cell.userId === currentPlayerId ? "A" : "B"
                    }`
                  : ""}
              </div>
            ))}
          </div>
        ))}
      </div>

      {selectedCell && possibleMoves.length > 0 && (
        <div className="possible-moves">
          {possibleMoves.map((move, index) => (
            <button key={index} onClick={() => makeAMove(move.row, move.col)}>
              Move to ({move.row + 1}, {move.col + 1})
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default GameBoard;

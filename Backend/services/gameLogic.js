exports.executeMove = (room, from, to, playerId) => {
  let boardState = JSON.parse(room.boardState);
  let currentPlayer = room.currentPlayer;
  let opponentPlayer =
    currentPlayer === room.player1Id ? room.player2Id : room.player1Id;

  const { rowIndex: fromRow, cellIndex: fromCol } = from;
  const { rowIndex: toRow, cellIndex: toCol } = to;

  const character = boardState[fromRow][fromCol];
  const targetCell = boardState[toRow][toCol];

  // Validate move
  if (!character || character.userId !== playerId) {
    return { error: "Invalid move" };
  }

  if (targetCell.character && targetCell.userId === playerId) {
    return { error: "Cannot move to a cell occupied by your own character" };
  }

  // Calculate valid moves based on character type
  const validMoves = getValidMoves(character, fromRow, fromCol);

  // Check if the move is within the valid moves
  if (!validMoves.some((move) => move.row === toRow && move.col === toCol)) {
    return { error: "Invalid move" };
  }

  // Perform move
  boardState[toRow][toCol] = character;
  boardState[fromRow][fromCol] = {
    character: null,
    userId: null,
    status: null,
  };

  // Check if the move results in eliminating the opponent's character, even if the character jumps over the opponent's character, it is considered dead

  if (targetCell.character && targetCell.userId === opponentPlayer) {
    boardState[toRow][toCol] = character;
  }

  for (let i = fromRow; i <= toRow; i++) {
    for (let j = fromCol; j <= toCol; j++) {
      if (boardState[i][j].userId === opponentPlayer) {
        boardState[i][j].status = "dead";
      }
    }
  }

  // Check if the move results in a win
  const opponentCharactersAlive = boardState
    .flat()
    .filter(
      (cell) => cell.userId === opponentPlayer && cell.status === "alive"
    ).length;

  const winner = opponentCharactersAlive === 0 ? currentPlayer : null;

  console.log(boardState);

  return {
    boardState,
    nextPlayer: opponentPlayer,
    from,
    to,
    character: character.character,
    winner,
  };
};

const getValidMoves = (character, row, col) => {
  const moves = [];
  switch (character.character) {
    case "Pawn":
      moves.push({ row: row + 1, col });
      moves.push({ row: row - 1, col });
      moves.push({ row, col: col + 1 });
      moves.push({ row, col: col - 1 });
      break;
    case "Hero1":
      moves.push({ row: row + 2, col });
      moves.push({ row: row - 2, col });
      moves.push({ row, col: col + 2 });
      moves.push({ row, col: col - 2 });
      break;
    case "Hero2":
      moves.push({ row: row + 2, col: col + 2 });
      moves.push({ row: row + 2, col: col - 2 });
      moves.push({ row: row - 2, col: col + 2 });
      moves.push({ row: row - 2, col: col - 2 });
      break;
  }

  // Filter out-of-bounds moves
  return moves.filter(
    (move) => move.row >= 0 && move.row < 5 && move.col >= 0 && move.col < 5
  );
};

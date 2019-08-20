import React from "react";
import "./Game.css";

enum PlayerT {
  Cross = "Cross",
  Circle = "Circle"
}

enum StatusT {
  Running = "Running",
  Draw = "Draw",
  Won = "Won"
}

type MarkT = null | PlayerT;

type BoardT = MarkT[];

interface GameStateT {
  board: BoardT;
  player: PlayerT;
  status: StatusT;
}

type GameActionT = { type: "PLAY"; square: number };

type GameDispatchT = (action: GameActionT) => void;

const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [2, 4, 6],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8]
];

function nextPlayer(currentPlayer: PlayerT) {
  switch (currentPlayer) {
    case PlayerT.Circle:
      return PlayerT.Cross;
    case PlayerT.Cross:
      return PlayerT.Circle;
  }
}

function isWon(board: BoardT) {
  return winningCombos.some(
    ([x, y, z]) => board[x] && board[x] === board[y] && board[y] === board[z]
  );
}

function isDraw(board: BoardT) {
  return board.every(Boolean);
}

function handlePlay(state: GameStateT, { square }: GameActionT) {
  const { board, player, status } = state;

  // illegal play
  if (status !== StatusT.Running || board[square]) {
    return state;
  }

  // dont do that, it breaks shallow comparisons
  board[square] = player;

  if (isWon(board)) return { ...state, status: StatusT.Won };

  if (isDraw(board)) return { ...state, status: StatusT.Draw };

  return { ...state, player: nextPlayer(player) };
}

function gameStateReducer(state: GameStateT, action: GameActionT) {
  switch (action.type) {
    case "PLAY":
      return handlePlay(state, action);
    default:
      return state;
  }
}

function gameStatus(player: PlayerT, status: StatusT) {
  switch (status) {
    case StatusT.Draw:
      return "It's a draw !";
    case StatusT.Won:
      return `Won: ${player}`;
    default:
      return `Playing: ${player}`;
  }
}

function markToString(mark: MarkT) {
  switch (mark) {
    case PlayerT.Cross:
      return "X";
    case PlayerT.Circle:
      return "O";
    case null:
    default:
      return "";
  }
}

interface SquareProps {
  mark: MarkT;
  onClick?: () => void;
}

function Square({ mark, onClick }: SquareProps) {
  return (
    <div className="square" onClick={onClick}>
      {markToString(mark)}
    </div>
  );
}

interface BoardProps {
  board: BoardT;
  dispatch: GameDispatchT;
}

function Board({ board, dispatch }: BoardProps) {
  return (
    <div className="board">
      {board.map((mark, index) => (
        <Square
          key={index}
          mark={mark}
          onClick={() => dispatch({ type: "PLAY", square: index })}
        />
      ))}
    </div>
  );
}

interface GameStatusProps {
  player: PlayerT;
  status: StatusT;
}

function GameStatus({ player, status }: GameStatusProps) {
  return <div className="gameStatus">{gameStatus(player, status)}</div>;
}

function Game() {
  const [gameState, dispatch] = React.useReducer(gameStateReducer, {
    board: Array(9).fill(null),
    player: PlayerT.Circle,
    status: StatusT.Running
  });

  const { board, status, player } = gameState;

  return (
    <>
      <GameStatus player={player} status={status} />
      <Board board={board} dispatch={dispatch} />
    </>
  );
}

export default Game;

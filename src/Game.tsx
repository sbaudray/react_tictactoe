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
  const { board, player } = state;

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

function gameStateToString(state: GameStateT) {
  const { status, player } = state;

  if (status === StatusT.Draw) return "It's a draw !";

  if (status === StatusT.Won) return `Won: ${player}`;

  return `Playing: ${player}`;
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
  children: React.ReactNode;
}

function Board({ children }: BoardProps) {
  return <div className="board">{children}</div>;
}

interface GameStatusProps {
  state: GameStateT;
}

function GameStatus({ state }: GameStatusProps) {
  return <div className="gameStatus">{gameStateToString(state)}</div>;
}

function Game() {
  const [gameState, dispatch] = React.useReducer(gameStateReducer, {
    board: Array(9).fill(null),
    player: PlayerT.Circle,
    status: StatusT.Running
  });

  const { board, status } = gameState;

  const squares = board.map((mark, index) => (
    <Square
      key={index}
      mark={mark}
      onClick={
        status !== StatusT.Running || mark
          ? undefined
          : () => dispatch({ type: "PLAY", square: index })
      }
    />
  ));

  return (
    <>
      <GameStatus state={gameState} />
      <Board>{squares}</Board>
    </>
  );
}

export default Game;

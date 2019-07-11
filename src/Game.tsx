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

function gameStateReducer(state: GameStateT, action: GameActionT) {
  const { type, square } = action;
  const { board, player } = state;

  switch (type) {
    case "PLAY": {
      // dont do that, it breaks shallow comparisons
      board[square] = player;

      let winner = null;

      for (const [x, y, z] of winningCombos) {
        if (board[x] && board[x] === board[y] && board[y] === board[z]) {
          winner = board[x];
        }
      }

      if (winner) return { ...state, status: StatusT.Won };

      if (board.every(Boolean)) return { ...state, status: StatusT.Draw };

      return {
        ...state,
        player: player === PlayerT.Circle ? PlayerT.Cross : PlayerT.Circle
      };
    }
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

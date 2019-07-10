import React from "react";
import "./Game.css";

const board: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

interface CellProps {
  mark?: number;
}

function Cell({ mark }: CellProps) {
  return <div>{mark}</div>;
}

interface BoardProps {
  board: typeof board;
}

function Board({ board }: BoardProps) {
  return (
    <div>
      {board.map(item => (
        <Cell key={item} mark={item} />
      ))}
    </div>
  );
}

const Game: React.FC = () => {
  return <Board board={board} />;
};

export default Game;


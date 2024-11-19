import React, { useState, useEffect } from "react";
import "./../css/mazegame.css";

const MazeGame = () => {
  const gridSize = 15; // Maze size (15x15 grid)
  const [maze, setMaze] = useState([]);
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [goalPosition, setGoalPosition] = useState({ x: gridSize - 1, y: gridSize - 1 });
  const [path, setPath] = useState([]);

  const directions = [
    { dx: -1, dy: 0 },
    { dx: 1, dy: 0 },
    { dx: 0, dy: -1 },
    { dx: 0, dy: 1 },
  ];

  const generateMaze = () => {
    const newMaze = Array(gridSize)
      .fill(null)
      .map(() => Array(gridSize).fill(1)); // Start with all walls (1 for wall, 0 for path)

    const carvePath = (x, y) => {
      newMaze[x][y] = 0;
      const shuffledDirections = directions.sort(() => Math.random() - 0.5);

      for (const { dx, dy } of shuffledDirections) {
        const nx = x + dx * 2;
        const ny = y + dy * 2;

        if (nx >= 0 && ny >= 0 && nx < gridSize && ny < gridSize && newMaze[nx][ny] === 1) {
          newMaze[x + dx][y + dy] = 0;
          carvePath(nx, ny);
        }
      }
    };

    carvePath(0, 0);
    newMaze[0][0] = 0;
    newMaze[gridSize - 1][gridSize - 1] = 0;

    setMaze(newMaze);
    setPlayerPosition({ x: 0, y: 0 });
    setGoalPosition({ x: gridSize - 1, y: gridSize - 1 });
    setPath([{ x: 0, y: 0 }]);
  };

  const movePlayer = (dx, dy) => {
    const newX = playerPosition.x + dx;
    const newY = playerPosition.y + dy;

    if (
      newX >= 0 &&
      newY >= 0 &&
      newX < gridSize &&
      newY < gridSize &&
      maze[newX][newY] === 0
    ) {
      setPlayerPosition({ x: newX, y: newY });
      setPath((prevPath) => [...prevPath, { x: newX, y: newY }]);

      if (newX === goalPosition.x && newY === goalPosition.y) {
        alert("🎉 The cat caught the mouse! Press Play to start a new game.");
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowUp":
          movePlayer(-1, 0);
          break;
        case "ArrowDown":
          movePlayer(1, 0);
          break;
        case "ArrowLeft":
          movePlayer(0, -1);
          break;
        case "ArrowRight":
          movePlayer(0, 1);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [playerPosition, maze]);

  return (
    <div className="maze-game">
      <button className="play-button" onClick={generateMaze}>
        Play
      </button>
      <div className="maze-grid">
        {maze.map((row, i) =>
          row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              className={`maze-cell ${
                i === playerPosition.x && j === playerPosition.y
                  ? "player"
                  : i === goalPosition.x && j === goalPosition.y
                  ? "goal"
                  : path.some((p) => p.x === i && p.y === j)
                  ? "highlighted-path"
                  : cell === 1
                  ? "wall"
                  : "path"
              }`}
            >
              {i === playerPosition.x && j === playerPosition.y ? "🐱" : ""}
              {i === goalPosition.x && j === goalPosition.y ? "🐭" : ""}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MazeGame;

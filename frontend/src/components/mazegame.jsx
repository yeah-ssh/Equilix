import React, { useCallback, useEffect, useRef, useState } from 'react';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';

const GRID_SIZE = 15;
const GOAL = { x: GRID_SIZE - 1, y: GRID_SIZE - 1 };
const DIRECTIONS = [
  { dx: -1, dy: 0 },
  { dx: 1, dy: 0 },
  { dx: 0, dy: -1 },
  { dx: 0, dy: 1 },
];

const KEY_MOVES = {
  ArrowUp: [-1, 0],
  ArrowDown: [1, 0],
  ArrowLeft: [0, -1],
  ArrowRight: [0, 1],
  w: [-1, 0],
  s: [1, 0],
  a: [0, -1],
  d: [0, 1],
};

const generateMaze = () => {
  const maze = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(1));
  const carve = (x, y) => {
    maze[x][y] = 0;
    const shuffled = [...DIRECTIONS].sort(() => Math.random() - 0.5);
    shuffled.forEach(({ dx, dy }) => {
      const nx = x + dx * 2;
      const ny = y + dy * 2;
      if (nx >= 0 && ny >= 0 && nx < GRID_SIZE && ny < GRID_SIZE && maze[nx][ny] === 1) {
        maze[x + dx][y + dy] = 0;
        carve(nx, ny);
      }
    });
  };
  carve(0, 0);
  maze[GOAL.x][GOAL.y] = 0;
  return maze;
};

const MazeGame = () => {
  const [maze, setMaze] = useState(generateMaze);
  const [player, setPlayer] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState(() => new Set(['0-0']));
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const boardRef = useRef(null);

  const newMaze = () => {
    setMaze(generateMaze());
    setPlayer({ x: 0, y: 0 });
    setTrail(new Set(['0-0']));
    setMoves(0);
    setWon(false);
    boardRef.current?.focus();
  };

  const move = useCallback(
    (dx, dy) => {
      if (won) return;
      const x = player.x + dx;
      const y = player.y + dy;
      if (x < 0 || y < 0 || x >= GRID_SIZE || y >= GRID_SIZE || maze[x][y] !== 0) return;
      setPlayer({ x, y });
      setTrail((t) => new Set(t).add(`${x}-${y}`));
      setMoves((m) => m + 1);
      if (x === GOAL.x && y === GOAL.y) setWon(true);
    },
    [maze, player, won]
  );

  const handleKeyDown = (e) => {
    const step = KEY_MOVES[e.key] || KEY_MOVES[e.key.toLowerCase()];
    if (!step) return;
    e.preventDefault();
    move(step[0], step[1]);
  };

  useEffect(() => {
    boardRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <div className="game">
      <div className="game-bar">
        <dl className="game-stats">
          <div><dt>Moves</dt><dd>{moves}</dd></div>
        </dl>
        <button type="button" className="btn btn-quiet" onClick={newMaze}>
          <ReplayRoundedIcon /> New maze
        </button>
      </div>

      <div className="maze-wrap">
        <div
          className="maze-board"
          ref={boardRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          role="application"
          aria-label="Maze. Use the arrow keys or W, A, S and D to move the cat to the mouse."
          style={{ '--maze-size': GRID_SIZE }}
        >
          {maze.map((row, i) =>
            row.map((cell, j) => {
              const isPlayer = i === player.x && j === player.y;
              const isGoal = i === GOAL.x && j === GOAL.y;
              const kind = cell === 1 ? 'wall' : trail.has(`${i}-${j}`) ? 'trail' : 'open';
              return (
                <div key={`${i}-${j}`} className={`maze-cell is-${kind}`}>
                  {isPlayer && <span className="maze-token" role="img" aria-label="Cat">🐱</span>}
                  {isGoal && !isPlayer && <span className="maze-token" role="img" aria-label="Mouse">🐭</span>}
                </div>
              );
            })
          )}

          {won && (
            <div className="maze-won" role="status">
              <p className="game-result-title">Caught it in {moves} moves.</p>
              <button type="button" className="btn btn-primary" onClick={newMaze}>New maze</button>
            </div>
          )}
        </div>

        <div className="maze-pad" aria-label="Move">
          <button type="button" className="maze-pad-up" onClick={() => move(-1, 0)} aria-label="Up"><KeyboardArrowUpRoundedIcon /></button>
          <button type="button" className="maze-pad-left" onClick={() => move(0, -1)} aria-label="Left"><KeyboardArrowLeftRoundedIcon /></button>
          <button type="button" className="maze-pad-right" onClick={() => move(0, 1)} aria-label="Right"><KeyboardArrowRightRoundedIcon /></button>
          <button type="button" className="maze-pad-down" onClick={() => move(1, 0)} aria-label="Down"><KeyboardArrowDownRoundedIcon /></button>
        </div>
      </div>
      <p className="game-hint">Use the arrow keys or W, A, S, D. On a phone, use the buttons.</p>
    </div>
  );
};

export default MazeGame;

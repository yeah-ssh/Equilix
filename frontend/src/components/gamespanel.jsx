import React, { useState } from 'react';
import MemoryGame from './memorygame';
import WhackAMole from './whackamole';
import MazeGame from './mazegame';
import '../css/games.css';

const games = [
  { id: 'memory', name: 'Memory cards', about: 'Find the matching pairs. Slow and steady works best.', Component: MemoryGame },
  { id: 'whack', name: 'Whack-a-mole', about: 'Thirty seconds of quick taps to shake off tension.', Component: WhackAMole },
  { id: 'maze', name: 'Cat & mouse', about: 'Guide the cat through the maze to the mouse.', Component: MazeGame },
];

const GamesPanel = ({ initialGame = 'memory' }) => {
  const [active, setActive] = useState(initialGame);
  const game = games.find((g) => g.id === active) || games[0];
  const { Component } = game;

  return (
    <div className="games">
      <div className="games-picker" role="tablist" aria-label="Games">
        {games.map((g) => (
          <button
            key={g.id}
            type="button"
            role="tab"
            aria-selected={g.id === active}
            className={`games-pick${g.id === active ? ' is-active' : ''}`}
            onClick={() => setActive(g.id)}
          >
            <span className="games-pick-name">{g.name}</span>
            <span className="games-pick-about">{g.about}</span>
          </button>
        ))}
      </div>
      <div className="games-stage" role="tabpanel" aria-label={game.name} key={game.id}>
        <Component />
      </div>
    </div>
  );
};

export default GamesPanel;

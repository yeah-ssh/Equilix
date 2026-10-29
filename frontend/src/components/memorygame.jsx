import React, { useEffect, useRef, useState } from 'react';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
import { BrandMark } from './brand';

const items = ['🍎', '🍌', '🍇', '🍒', '🍍', '🥝', '🍉', '🍑'];
const BEST_KEY = 'equilix:memoryBest';

const shuffle = (array) => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const readBest = () => {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || null;
  } catch (e) {
    return null;
  }
};

const MemoryGame = () => {
  const [cards, setCards] = useState(() => shuffle([...items, ...items]));
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [best, setBest] = useState(readBest);
  const lockTimer = useRef(null);

  const isComplete = matched.length === cards.length;

  useEffect(() => () => clearTimeout(lockTimer.current), []);

  useEffect(() => {
    if (!isComplete || moves === 0) return;
    if (!best || moves < best) {
      setBest(moves);
      try {
        localStorage.setItem(BEST_KEY, String(moves));
      } catch (e) {
        // Best score is a nicety; ignore storage failures.
      }
    }
  }, [isComplete]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCardClick = (index) => {
    if (flipped.length === 2 || matched.includes(index) || flipped.includes(index)) return;

    const next = [...flipped, index];
    setFlipped(next);

    if (next.length === 2) {
      setMoves((m) => m + 1);
      if (cards[next[0]] === cards[next[1]]) {
        setMatched((prev) => [...prev, ...next]);
        setFlipped([]);
      } else {
        lockTimer.current = setTimeout(() => setFlipped([]), 900);
      }
    }
  };

  const restart = () => {
    clearTimeout(lockTimer.current);
    setCards(shuffle([...items, ...items]));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  return (
    <div className="game">
      <div className="game-bar">
        <dl className="game-stats">
          <div><dt>Moves</dt><dd>{moves}</dd></div>
          <div><dt>Pairs</dt><dd>{matched.length / 2} of {items.length}</dd></div>
          {best && <div><dt>Best</dt><dd>{best} moves</dd></div>}
        </dl>
        <button type="button" className="btn btn-quiet" onClick={restart}>
          <ReplayRoundedIcon /> Shuffle
        </button>
      </div>

      <div className="memory-board">
        {cards.map((card, index) => {
          const isUp = flipped.includes(index) || matched.includes(index);
          return (
            <button
              type="button"
              key={index}
              className={`memory-card${isUp ? ' is-up' : ''}${matched.includes(index) ? ' is-matched' : ''}`}
              onClick={() => handleCardClick(index)}
              aria-label={isUp ? card : `Card ${index + 1}, face down`}
              disabled={matched.includes(index)}
            >
              <span className="memory-face memory-back" aria-hidden="true">
                <BrandMark className="memory-mark" />
              </span>
              <span className="memory-face memory-front" aria-hidden="true">{card}</span>
            </button>
          );
        })}
      </div>

      {isComplete && (
        <div className="game-result" role="status">
          <p className="game-result-title">All pairs found in {moves} moves.</p>
          <button type="button" className="btn btn-primary" onClick={restart}>Play again</button>
        </div>
      )}
    </div>
  );
};

export default MemoryGame;

import React, { useEffect, useRef, useState } from 'react';

const ROUND_SECONDS = 30;
const HOLES = 9;
const BEST_KEY = 'equilix:whackBest';

const readBest = () => {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch (e) {
    return 0;
  }
};

const WhackAMole = () => {
  const [score, setScore] = useState(0);
  const [molePosition, setMolePosition] = useState(null);
  const [hitPosition, setHitPosition] = useState(null);
  const [timer, setTimer] = useState(ROUND_SECONDS);
  const [isGameActive, setIsGameActive] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [best, setBest] = useState(readBest);
  const scoreRef = useRef(0);
  const timerRef = useRef(ROUND_SECONDS);
  timerRef.current = timer;

  // Moles appear a little faster as the round goes on
  useEffect(() => {
    if (!isGameActive) return undefined;
    const elapsed = ROUND_SECONDS - timerRef.current;
    const delay = Math.max(520, 900 - elapsed * 14);
    const moleTimer = setTimeout(() => {
      setMolePosition((prev) => {
        let next = Math.floor(Math.random() * HOLES);
        if (next === prev) next = (next + 1 + Math.floor(Math.random() * (HOLES - 1))) % HOLES;
        return next;
      });
    }, delay);
    return () => clearTimeout(moleTimer);
  }, [isGameActive, molePosition]);

  useEffect(() => {
    if (!isGameActive) return undefined;
    if (timer === 0) {
      setIsGameActive(false);
      setMolePosition(null);
      if (scoreRef.current > best) {
        setBest(scoreRef.current);
        try {
          localStorage.setItem(BEST_KEY, String(scoreRef.current));
        } catch (e) {
          // Best score is a nicety; ignore storage failures.
        }
      }
      return undefined;
    }
    const countdown = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(countdown);
  }, [isGameActive, timer, best]);

  const startGame = () => {
    scoreRef.current = 0;
    setScore(0);
    setTimer(ROUND_SECONDS);
    setMolePosition(null);
    setHasPlayed(true);
    setIsGameActive(true);
  };

  const whackMole = (index) => {
    if (!isGameActive || index !== molePosition) return;
    scoreRef.current += 1;
    setScore(scoreRef.current);
    setHitPosition(index);
    setMolePosition(null);
    setTimeout(() => setHitPosition(null), 260);
  };

  return (
    <div className="game">
      <div className="game-bar">
        <dl className="game-stats">
          <div><dt>Score</dt><dd>{score}</dd></div>
          <div><dt>Time</dt><dd>{timer}s</dd></div>
          {best > 0 && <div><dt>Best</dt><dd>{best}</dd></div>}
        </dl>
        {!isGameActive && (
          <button type="button" className="btn btn-primary" onClick={startGame}>
            {hasPlayed ? 'Play again' : 'Start'}
          </button>
        )}
      </div>

      <div className="whack-time" aria-hidden="true">
        <span style={{ transform: `scaleX(${timer / ROUND_SECONDS})` }} />
      </div>

      <div className={`whack-grid${isGameActive ? ' is-live' : ''}`}>
        {Array.from({ length: HOLES }).map((_, index) => (
          <button
            type="button"
            key={index}
            className={`whack-hole${index === molePosition ? ' is-up' : ''}${index === hitPosition ? ' is-hit' : ''}`}
            onClick={() => whackMole(index)}
            aria-label={index === molePosition ? 'Mole! Tap it' : `Hole ${index + 1}`}
            disabled={!isGameActive}
          >
            <span className="whack-burrow" aria-hidden="true">
              <span className="whack-mole">
                <span className="whack-eyes" />
                <span className="whack-nose" />
              </span>
            </span>
            <span className="whack-dirt" aria-hidden="true" />
            {index === hitPosition && <span className="whack-plus" aria-hidden="true">+1</span>}
          </button>
        ))}
      </div>

      {hasPlayed && !isGameActive && (
        <div className="game-result" role="status">
          <p className="game-result-title">
            {score === 0 ? 'Time’s up. Those moles are quick.' : `Time’s up. You got ${score}.`}
            {score > 0 && score >= best ? ' That’s your best yet.' : ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default WhackAMole;

import React, { useState, useEffect } from 'react';
import './../css/whackamole.css';

const WhackAMole = () => {
  const [score, setScore] = useState(0);
  const [molePosition, setMolePosition] = useState(null);
  const [timer, setTimer] = useState(30);
  const [isGameActive, setIsGameActive] = useState(false);

  useEffect(() => {
    let moleInterval;
    let countdownInterval;

    if (isGameActive && timer > 0) {
      // Move the mole every 800ms
      moleInterval = setInterval(() => {
        const newPosition = Math.floor(Math.random() * 9);
        setMolePosition(newPosition);
      }, 800);

      // Countdown timer
      countdownInterval = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
    }

    if (timer === 0) {
      setIsGameActive(false);
      clearInterval(moleInterval);
      clearInterval(countdownInterval);
    }

    return () => {
      clearInterval(moleInterval);
      clearInterval(countdownInterval);
    };
  }, [isGameActive, timer]);

  const startGame = () => {
    setScore(0);
    setTimer(30);
    setIsGameActive(true);
    setMolePosition(null);
  };

  const whackMole = (index) => {
    if (index === molePosition && isGameActive) {
      setScore((prevScore) => prevScore + 1);
      setMolePosition(null);
    }
  };

  return (
    <div className="whack-a-mole">
      <h1>Whack-a-Mole</h1>
      <p>Score: {score}</p>
      <p>Time Left: {timer} seconds</p>
      <div className="game-grid">
        {Array.from({ length: 9 }).map((_, index) => (
          <div
            key={index}
            className={`hole ${index === molePosition ? 'mole' : ''}`}
            onClick={() => whackMole(index)}
          ></div>
        ))}
      </div>
      {!isGameActive && <button onClick={startGame} className="start-button">Start Game</button>}
      {timer === 0 && <p className="game-over">Game Over! Your Score: {score}</p>}
    </div>
  );
};

export default WhackAMole;

import React, { useState, useEffect } from 'react';
import '../css/memorygame.css';

const MemoryGame = () => {
  
  const items = ['🍎', '🍌', '🍇', '🍒', '🍍', '🥝', '🍉', '🍑'];
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [isGameComplete, setIsGameComplete] = useState(false);

  useEffect(() => {
    
    setCards(shuffle([...items, ...items]));
  }, []);

  useEffect(() => {
    
    if (matchedCards.length === cards.length && cards.length > 0) {
      setTimeout(() => setIsGameComplete(true), 500);
    }
  }, [matchedCards, cards]);

  
  const shuffle = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const handleCardClick = (index) => {
    
    if (
      flippedCards.length === 2 ||
      matchedCards.includes(index) ||
      flippedCards.includes(index)
    ) return;

    setFlippedCards((prev) => [...prev, index]);

    if (flippedCards.length === 1) {
      const firstCard = cards[flippedCards[0]];
      const secondCard = cards[index];
      if (firstCard === secondCard) {
        setMatchedCards((prev) => [...prev, flippedCards[0], index]);
      }
      setTimeout(() => setFlippedCards([]), 1000);
    }
  };

  return (
    <div className="memory-game-container">
      <h2 className="memory-game-title">Memory Game</h2>
      <div className="memory-game-board">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`memory-card ${
              flippedCards.includes(index) || matchedCards.includes(index) ? 'flipped' : ''
            }`}
            onClick={() => handleCardClick(index)}
          >
            <div className="card-front">?</div>
            <div className="card-back">{card}</div>
          </div>
        ))}
      </div>
      {isGameComplete && (
        <div className="game-complete-message">
          🎉 Congratulations! You've matched all pairs! 🎉
        </div>
      )}
    </div>
  );
};

export default MemoryGame;

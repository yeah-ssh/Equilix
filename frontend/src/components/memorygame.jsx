import React, { useState, useEffect } from 'react';
import '../css/memorygame.css';

const MemoryGame = () => {
  // Updated items list to 8 unique items for a 4x4 layout
  const items = ['🍎', '🍌', '🍇', '🍒', '🍍', '🥝', '🍉', '🍑'];
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [isGameComplete, setIsGameComplete] = useState(false);

  useEffect(() => {
    // Doubling the items array to create pairs, then shuffling
    setCards(shuffle([...items, ...items]));
  }, []);

  useEffect(() => {
    // Check if all cards are matched
    if (matchedCards.length === cards.length && cards.length > 0) {
      setTimeout(() => setIsGameComplete(true), 500);
    }
  }, [matchedCards, cards]);

  // Shuffle function to randomize cards
  const shuffle = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const handleCardClick = (index) => {
    // Ignore click if two cards are flipped, or card is already matched/flipped
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

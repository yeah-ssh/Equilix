import React from 'react';
import './../css/main.css';

const Main = () => {
  return (
    <div className="main-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="text-content">
          <h1 className="main-title">Supporting Teen Mental Health</h1>
          <p className="sub-title">
            Equilix is dedicated to helping teens detect early signs of depression and providing the resources they need for recovery.
          </p>
          <div className="cta-buttons">
            <button className="cta-button">Teenagers</button>
            <button className="cta-button">Parents</button>
          </div>
        </div>
        
        {/* Images Section */}
        <div className="image-content">
          <img src={require('./../images/teen-group.png')} alt="Teen Group" className="teen-group-image" />
          <img src={require('./../images/mind-neurons.png')} alt="Mind Neurons" className="mind-neurons-image" />
        </div>
      </div>

      {/* Yoga & Meditation Section */}
      <div className="activities-section">
        <h2>Yoga and Meditation for Teens</h2>
        <p>Engage in mindful activities to help manage stress and emotions.</p>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/v7AYKMP6rOE"
          title="Yoga for Beginners"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      {/* Online Games Section */}
      <div className="games-section">
        <h2>Interactive Games to Improve Mental Health</h2>
        <p>Try out these fun, interactive games designed to uplift your mood and boost mental well-being.</p>
        <a
          href="https://www.superbetter.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="game-link"
        >
          SuperBetter: Build Resilience Through Play
        </a>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>© 2024 Equilix. All rights reserved. | Privacy Policy | Terms of Service</p>
      </footer>
    </div>
  );
};

export default Main;

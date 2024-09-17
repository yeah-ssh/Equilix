import React, { useState } from 'react';
import './../css/main.css';

// Example Yoga Videos Data
const yogaVideos = [
  { id: 1, title: 'Yoga for Beginners', src: 'https://www.youtube.com/embed/v7AYKMP6rOE' },
  { id: 2, title: 'Intermediate Yoga Session', src: 'https://www.youtube.com/embed/iGLeS1wKnSE' },
  { id: 3, title: 'Yoga for Stress Relief', src: 'https://www.youtube.com/embed/3KkUeW8fTaI' }
];

// Example Games Data
const games = [
  { id: 1, title: 'SuperBetter', url: 'https://www.superbetter.com/' },
  { id: 2, title: 'Moodfit', url: 'https://www.getmoodfit.com/' },
  { id: 3, title: 'Happify', url: 'https://www.happify.com/' }
];

const Main = () => {
  const [selectedVideo, setSelectedVideo] = useState(yogaVideos[0].src);
  const [selectedGame, setSelectedGame] = useState(games[0].url);

  return (
    <div className="main-container">
      {/* Full-screen Hero Section with Video */}
      <div className="hero-section">
        <video autoPlay muted loop className="background-video">
          <source src={require('./../images/background.mp4')} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="hero-content">
          <h1 className="main-title">Supporting Teen Mental Health</h1>
          <p className="sub-title">
            Equilix helps teens detect early signs of depression and provides the resources they need for recovery.
          </p>
          <div className="cta-buttons">
            <button className="cta-button">Teenagers</button>
            <button className="cta-button">Parents</button>
          </div>
        </div>
      </div>

      {/* Yoga Section */}
      <div className="activities-section">
        <h2>Yoga and Meditation for Teens</h2>
        <p>Engage in mindful activities to help manage stress and emotions.</p>
        <div className="video-dropdown">
          <label htmlFor="yoga-videos">Choose a Yoga Video:</label>
          <select
            id="yoga-videos"
            onChange={(e) => setSelectedVideo(yogaVideos.find(video => video.id === parseInt(e.target.value)).src)}
          >
            {yogaVideos.map(video => (
              <option key={video.id} value={video.id}>
                {video.title}
              </option>
            ))}
          </select>
        </div>
        <iframe
          width="100%"
          height="315"
          src={selectedVideo}
          title="Yoga Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      {/* Online Games Section */}
      <div className="games-section">
        <h2>Interactive Games to Improve Mental Health</h2>
        <p>Try out these fun, interactive games designed to uplift your mood and boost mental well-being.</p>
        <div className="game-dropdown">
          <label htmlFor="games">Choose a Game:</label>
          <select
            id="games"
            onChange={(e) => setSelectedGame(games.find(game => game.id === parseInt(e.target.value)).url)}
          >
            {games.map(game => (
              <option key={game.id} value={game.id}>
                {game.title}
              </option>
            ))}
          </select>
        </div>
        <a
          href={selectedGame}
          target="_blank"
          rel="noopener noreferrer"
          className="game-link"
        >
          Visit Game
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

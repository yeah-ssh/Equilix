import React from 'react';
import AppHeader from './appheader';
import GamesPanel from './gamespanel';

const GamesPage = ({ initialGame }) => (
  <div className="standalone horizon">
    <AppHeader />
    <main className="standalone-main">
      <h1 className="standalone-title">Games</h1>
      <p className="standalone-intro">A few minutes of play can quiet a busy mind. Pick one and take your time.</p>
      <GamesPanel initialGame={initialGame} />
    </main>
  </div>
);

export default GamesPage;

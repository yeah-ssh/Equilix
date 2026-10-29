import React from 'react';
import AppHeader from './appheader';
import Chat from './aicomponent';

const ChatPage = () => (
  <div className="standalone horizon">
    <AppHeader />
    <main className="standalone-main">
      <Chat />
    </main>
  </div>
);

export default ChatPage;

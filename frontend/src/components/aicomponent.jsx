import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import { BrandMark } from './brand';
import RichText from './richtext';
import { API_URL } from '../config';
import '../css/aicomponent.css';

const suggestions = [
  'I can’t stop overthinking at night',
  'How do I deal with exam stress?',
  'My friend seems down. How can I help?',
  'What does anxiety feel like in the body?',
];

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState('');
  const threadEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (messages.length === 0) return;
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isThinking]);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, 180)}px`;
  }, [draft]);

  const send = async (history) => {
    setIsThinking(true);
    setError('');
    try {
      const response = await axios.post(`${API_URL}/api/chat`, { messages: history });
      setMessages([...history, { role: 'assistant', content: response.data.answer }]);
    } catch (err) {
      setError('The assistant didn’t answer. Check your connection and try again.');
    } finally {
      setIsThinking(false);
    }
  };

  const ask = (text) => {
    const question = text.trim();
    if (!question || isThinking) return;
    const history = [...messages, { role: 'user', content: question }];
    setMessages(history);
    setDraft('');
    send(history);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    ask(draft);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      ask(draft);
    }
  };

  const startNew = () => {
    setMessages([]);
    setError('');
    inputRef.current?.focus();
  };

  return (
    <div className="chat">
      <div className="chat-thread" aria-live="polite">
        {messages.length === 0 ? (
          <div className="chat-empty">
            <h2>What’s on your mind?</h2>
            <p>
              Ask about stress, anxiety, low mood, sleep, friends or school. There are no wrong
              questions here.
            </p>
            <div className="chat-suggestions">
              {suggestions.map((s) => (
                <button type="button" key={s} className="chat-suggestion" onClick={() => ask(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, i) =>
            m.role === 'user' ? (
              <div className="chat-msg chat-msg-user" key={i}>
                <p>{m.content}</p>
              </div>
            ) : (
              <div className="chat-msg chat-msg-assistant" key={i}>
                <BrandMark className="chat-avatar" />
                <RichText text={m.content} />
              </div>
            )
          )
        )}

        {isThinking && (
          <div className="chat-msg chat-msg-assistant">
            <BrandMark className="chat-avatar" />
            <span className="chat-typing" aria-label="The assistant is writing">
              <i /> <i /> <i />
            </span>
          </div>
        )}

        {error && (
          <div className="chat-error">
            <p className="form-error" role="alert">{error}</p>
            <button type="button" className="btn btn-text" onClick={() => send(messages)}>
              Try again
            </button>
          </div>
        )}
        <div ref={threadEndRef} className="chat-thread-end" />
      </div>

      <form className="chat-composer" onSubmit={handleSubmit}>
        <label htmlFor="chat-input" className="visually-hidden">Your message</label>
        <textarea
          id="chat-input"
          ref={inputRef}
          rows={1}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a message"
        />
        <button type="submit" className="chat-send" disabled={!draft.trim() || isThinking} aria-label="Send message">
          <ArrowUpwardRoundedIcon />
        </button>
      </form>
      <div className="chat-foot">
        <p className="support-note">
          This assistant is AI and can get things wrong. It isn’t a replacement for a professional.
          In a crisis, call or text 988 (US) or visit{' '}
          <a href="https://findahelpline.com" target="_blank" rel="noreferrer">findahelpline.com</a>.
        </p>
        {messages.length > 0 && (
          <button type="button" className="btn btn-text" onClick={startNew}>
            New conversation
          </button>
        )}
      </div>
    </div>
  );
};

export default Chat;

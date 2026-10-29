import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AppHeader from './appheader';
import Questionnaire from './questionnaire';
import { questions, scales, scaleInfo } from '../data/questions';
import { ML_URL } from '../config';
import { getEmail, loadResult, saveResult } from '../session';
import './../css/main.css';

const Main = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [isScoring, setIsScoring] = useState(false);
  const [scoreError, setScoreError] = useState('');
  const lastResult = loadResult();

  const answeredCount = Object.keys(responses).length;
  const inProgress = answeredCount > 0;

  const handleAnswer = (questionId, value, time) => {
    setResponses((prev) => ({ ...prev, [questionId]: { answer: value, time } }));
  };

  const startOver = () => {
    setResponses({});
    setIndex(0);
    setScoreError('');
    setIsOpen(true);
  };

  const handleFinish = async () => {
    const formattedResponses = Object.fromEntries(
      Object.entries(scales).map(([scale, ids]) => [scale, ids.map((id) => responses[id]?.answer ?? 0)])
    );

    setIsScoring(true);
    setScoreError('');
    try {
      const result = await axios.post(`${ML_URL}/predict`, { responses: formattedResponses });
      const { depression, stress, anxiety } = result.data;
      const report = { depression, stress, anxiety, responses, email: getEmail(), takenAt: Date.now() };
      saveResult(report);
      navigate('/report', { state: report });
    } catch (error) {
      setScoreError('We couldn’t work out your results just now. Your answers are still here, so try again in a moment.');
    } finally {
      setIsScoring(false);
    }
  };

  return (
    <div className="home">
      <section className="home-hero">
        <video className="home-video" autoPlay muted loop playsInline poster={require('./../images/hero-poster.jpg')} aria-hidden="true">
          <source src={require('./../images/hero.mp4')} type="video/mp4" />
        </video>
        <div className="home-hero-shade" aria-hidden="true" />
        <AppHeader />

        <div className="home-hero-copy">
          <h1 className="home-title">Supporting teen mental health</h1>
          <p className="home-subtitle">
            A five-minute check-in that helps you spot early signs of depression, anxiety and stress,
            and points you to what helps.
          </p>
          <div className="home-actions">
            {inProgress ? (
              <>
                <button type="button" className="btn btn-primary" onClick={() => setIsOpen(true)}>
                  Continue check-in
                </button>
                <button type="button" className="btn btn-text" onClick={startOver}>
                  Start over
                </button>
              </>
            ) : (
              <button type="button" className="btn btn-primary" onClick={startOver}>
                Take the check-in
              </button>
            )}
            {lastResult && !inProgress && (
              <Link to="/report" className="btn btn-quiet">
                See my last results
              </Link>
            )}
          </div>
          {inProgress && (
            <p className="home-progress">
              {answeredCount} of {questions.length} answered
            </p>
          )}
        </div>
      </section>

      <section className="home-about horizon" aria-labelledby="home-about-title">
        <div className="home-about-intro">
          <h2 id="home-about-title">What the check-in looks at</h2>
          <p>
            It uses the DASS-21, a questionnaire researchers and clinicians use worldwide. Seven
            questions for each area, all about the past week.
          </p>
        </div>
        <dl className="home-scales">
          {Object.entries(scaleInfo).map(([key, info]) => (
            <div className="home-scale" key={key}>
              <dt>{info.name}</dt>
              <dd>{info.about}</dd>
            </div>
          ))}
        </dl>
        <div className="home-extras">
          <p>
            Need a breather first? <Link to="/games">Play a calming game</Link> or{' '}
            <Link to="/gpt">talk something through</Link>.
          </p>
        </div>
      </section>

      <footer className="home-footer support-note">
        Equilix is a self-check, not a diagnosis. If you’re thinking about harming yourself, call or
        text 988 in the US, or find a local helpline at{' '}
        <a href="https://findahelpline.com" target="_blank" rel="noreferrer">findahelpline.com</a>.
      </footer>

      {isOpen && (
        <Questionnaire
          responses={responses}
          onAnswer={handleAnswer}
          index={index}
          onIndexChange={setIndex}
          onClose={() => setIsOpen(false)}
          onFinish={handleFinish}
          isScoring={isScoring}
          scoreError={scoreError}
        />
      )}
    </div>
  );
};

export default Main;

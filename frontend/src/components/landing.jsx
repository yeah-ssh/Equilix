import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Brand from './brand';
import { getToken } from '../session';
import './../css/landing.css';

const steps = [
  {
    title: 'Check in',
    text: '21 short questions about the past week. Takes about five minutes.',
  },
  {
    title: 'Understand',
    text: 'See where you are on depression, anxiety and stress, in plain words.',
  },
  {
    title: 'Unwind',
    text: 'Calming games and a place to talk things through, whenever you need them.',
  },
];

const Landing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (getToken()) {
      navigate('/main');
    }
  }, [navigate]);

  return (
    <div className="landing">
      <div className="landing-art" aria-hidden="true" />

      <header className="landing-header">
        <Brand />
        <Link to="/login" className="btn btn-quiet">Sign in</Link>
      </header>

      <main className="landing-hero">
        <h1 className="landing-title">Equilix</h1>
        <p className="landing-tagline">Overcoming the darkness</p>
        <p className="landing-description">
          A quiet place for teens to check in on how they’re really doing, understand it, and take
          the next small step.
        </p>
        <div className="landing-actions">
          <button type="button" className="btn btn-primary" onClick={() => navigate('/login', { state: { mode: 'signup' } })}>
            Begin your journey
          </button>
          <Link to="/login" className="btn btn-text">I already have an account</Link>
        </div>
      </main>

      <section className="landing-steps" aria-label="How Equilix works">
        {steps.map((step) => (
          <div className="landing-step" key={step.title}>
            <h2>{step.title}</h2>
            <p>{step.text}</p>
          </div>
        ))}
      </section>

      <footer className="landing-footer support-note">
        Equilix is a self-check, not a diagnosis. If you’re thinking about harming yourself, call or
        text 988 in the US, or find a local helpline at{' '}
        <a href="https://findahelpline.com" target="_blank" rel="noreferrer">findahelpline.com</a>.
      </footer>
    </div>
  );
};

export default Landing;

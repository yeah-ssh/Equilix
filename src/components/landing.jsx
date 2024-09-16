import React from 'react';
import { useNavigate } from 'react-router-dom';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import './../css/landing.css';

const Landing = () => {
  const navigate = useNavigate();

  // Particle options for background with neuron-like effect
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  const particlesOptions = {
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "repulse",
        },
        resize: true,
      },
    },
    particles: {
      number: {
        value: 120,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: "#ffffff",
      },
      shape: {
        type: "circle",
        stroke: {
          width: 0,
          color: "#000000",
        },
      },
      opacity: {
        value: 0.5,
        anim: {
          enable: true,
          speed: 1,
          opacity_min: 0.1,
          sync: false,
        },
      },
      size: {
        value: 5,
        random: true,
        anim: {
          enable: true,
          speed: 5,
          size_min: 0.5,
          sync: false,
        },
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#00ff99",
        opacity: 0.6,
        width: 2,
      },
      move: {
        enable: true,
        speed: 2,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200,
        },
      },
    },
    retina_detect: true,
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="landing-container">
      <Particles className="particles-bg" id="tsparticles" init={particlesInit} options={particlesOptions} />
      <div className="content">
        <h1 className="title">Welcome to Equilix</h1>
        <p className="subtitle">Where Minds Connect and Ideas Spark</p>
        <button className="btn" onClick={handleLogin}>
          Enter the World of Equilix
        </button>
      </div>
    </div>
  );
};

export default Landing;

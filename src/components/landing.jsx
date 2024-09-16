import React from 'react';
import { useNavigate } from 'react-router-dom';
import './../css/landing.css';
import Image from '/../images/Screenshot 2024-09-15 023509.png'; // Add the correct path to your image

const Landing = () => {
   const navigate = useNavigate();

   const handleLogin = () => {
     navigate('/login');
   };

   return (
     <div className="landing-container">
       <div className="image-container">
         <img src={Image} alt="Depressed teen illustration" className="landing-image" />
       </div>
       <div className="text-container">
         <h1 className="project-name">Equilix</h1>
         <h2 className="tagline">Overcoming the Darkness</h2>
         <p className="description">
           Equilix is a platform dedicated to helping teens navigate through depression and mental health challenges.
         </p>
         <button className="landing-btn" onClick={handleLogin}>
           Begin Your Journey
         </button>
       </div>
     </div>
   );
}

export default Landing;

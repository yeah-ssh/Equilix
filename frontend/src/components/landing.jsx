import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './../css/landing.css'; 

const Landing = () => {
  const navigate = useNavigate();
  useEffect(() => {
    
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/main'); 
    }
  }, [navigate]);

 

   const handleLogin = () => {
     navigate('/login');
   };

   return (
     <div className="landing-container">
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

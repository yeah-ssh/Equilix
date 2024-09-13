import React from 'react';
import { useNavigate } from 'react-router-dom';
import './../css/landing.css'

const Landing = () => {
   const navigate = useNavigate();

 const handleLogin = () => {
   navigate('/login');
 };
  return (
   <div className="login-container">
     <h1 className="login-title">Welcome</h1>
     <button className="login-btn" onClick={handleLogin}>
       Go to Login
     </button>
   </div>
 );
}

export default Landing
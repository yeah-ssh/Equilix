import React from 'react';
import { useNavigate } from 'react-router-dom';
import './../css/landing.css'

const Login = () => {
   const navigate = useNavigate();

 const handleLogin = () => {
   navigate('/main');
 };
  return (
   <div className="login-container">
     <h1 className="login-title">Welcome</h1>
     <button className="login-btn" onClick={handleLogin}>
       Go to Main
     </button>
   </div>
 );
}

export default Login
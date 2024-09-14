import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './../css/login.css';

const Login = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const toggleMode = () => setIsSignUp(!isSignUp);

  const handleLogin = () => {
    if (email && password) {
      // Add validation and auth logic here
      navigate('/main');
    }
  };

  const handleSignUp = () => {
    if (email && password && password === confirmPassword) {
      // Add sign-up logic here
      navigate('/main');
    }
  };

  return (
    <div className="login-container">
      <div className="left-section">
        <h1 className="product-title">Equilix</h1>
        <p className="welcome-text">Welcome to Equilix. Please sign in or sign up to continue.</p>
        <div className="animation-area">
          {/* Placeholder for future animations */}
        </div>
      </div>
      <div className="right-section">
        <form>
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          {isSignUp && (
            <input 
              type="password" 
              placeholder="Confirm Password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />
          )}
          <button 
            type="button" 
            onClick={isSignUp ? handleSignUp : handleLogin}
            className="auth-btn"
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
          <p className="toggle-mode">
            {isSignUp ? 'Already have an account?' : 'Don’t have an account?'}
            <span onClick={toggleMode}>
              {isSignUp ? ' Sign In' : ' Sign Up'}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;

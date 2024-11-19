import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './../css/login.css';

const Login = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bubbles, setBubbles] = useState([]);

  const toggleMode = () => setIsSignUp(!isSignUp);

  const handleLogin = () => {
    if (email && password) {
      navigate('/main');
    }
  };

  const handleSignUp = () => {
    if (email && password && password === confirmPassword) {
      navigate('/main');
    }
  };

  const createBubbles = () => {
    const bubbleArray = [];
    for (let i = 0; i < 30; i++) {
      const bubble = {
        id: i,
        size: Math.random() * 100 + 10,
        top: Math.random() * 100 + '%',
        left: Math.random() * 100 + '%',
      };
      bubbleArray.push(bubble);
    }
    setBubbles(bubbleArray);
  };

  useEffect(() => {
    createBubbles(); 
  }, []);

  const burstBubble = (id) => {
    setBubbles(bubbles.filter((bubble) => bubble.id !== id));
  };

  return (
    <div className="login-container">
      <div className="left-section">
        <h1 className="product-title">Equilix</h1>
        <p className="welcome-text">Welcome to Equilix. Please sign in or sign up to continue.</p>
        <div className="animation-area">
          {bubbles.map((bubble) => (
            <div
              key={bubble.id}
              className="bubble"
              style={{
                width: bubble.size + 'px',
                height: bubble.size + 'px',
                top: bubble.top,
                left: bubble.left,
              }}
              onClick={() => burstBubble(bubble.id)}
            />
          ))}
        </div>
      </div>
      <div className="right-section">
        <div className="tile">
          <h2 className="auth-header">{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
           <hr className="header-line" />
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
    </div>
  );
};

export default Login;

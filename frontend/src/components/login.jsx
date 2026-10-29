import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import Brand from './brand';
import BubbleField from './bubblefield';
import { API_URL } from '../config';
import { getToken, saveSession } from '../session';
import './../css/login.css';

// Shown as the pop count grows: small prompts to slow down, never a score to chase.
const calmLines = [
  [0, 'Pop a few bubbles while you settle in.'],
  [5, 'Nice. Let your shoulders drop.'],
  [12, 'Breathe in for four, out for six.'],
  [25, 'No rush. Stay as long as you like.'],
  [50, 'That’s a lot of bubbles. You’re doing fine.'],
];

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSignUp, setIsSignUp] = useState(location.state?.mode === 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popped, setPopped] = useState(0);

  useEffect(() => {
    if (getToken()) {
      navigate('/main');
    }
  }, [navigate]);

  const switchMode = (signUp) => {
    setError('');
    setIsSignUp(signUp);
  };

  const validate = () => {
    if (!email || !password) return 'Enter your email and password.';
    if (isSignUp && password.length < 8) return 'Use at least 8 characters for your password.';
    if (isSignUp && password !== confirmPassword) return 'The two passwords don’t match.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/${isSignUp ? 'signup' : 'login'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        saveSession(data.token, data.user.email);
        navigate(location.state?.from || '/main');
      } else {
        setError(data.message || (isSignUp ? 'Couldn’t create your account.' : 'Couldn’t sign you in.'));
      }
    } catch (err) {
      setError('Can’t reach Equilix right now. Check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calmLine = calmLines.filter(([min]) => popped >= min).pop()[1];
  const submitLabel = isSignUp ? 'Create account' : 'Sign in';

  return (
    <div className="login">
      <section className="login-field">
        <BubbleField className="login-canvas" onPop={() => setPopped((n) => n + 1)} />
        <div className="login-field-top">
          <Brand />
        </div>
        <div className="login-field-copy">
          <p className="login-calm" key={calmLine}>
            {calmLine}
          </p>
          <p className="login-count" aria-hidden={popped === 0}>
            {popped > 0 && (
              <>
                <span className="login-count-number">{popped}</span> popped
              </>
            )}
          </p>
        </div>
      </section>

      <main className="login-panel horizon">
        <div className="login-form-wrap">
          <h1 className="login-title">{isSignUp ? 'Create your account' : 'Welcome back'}</h1>
          <p className="login-subtitle">
            {isSignUp
              ? 'One account keeps your check-ins and results together.'
              : 'Sign in to check in or see your latest results.'}
          </p>

          <div className="login-switch" role="tablist" aria-label="Account">
            <button
              type="button"
              role="tab"
              aria-selected={!isSignUp}
              className={!isSignUp ? 'is-active' : ''}
              onClick={() => switchMode(false)}
            >
              Sign in
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={isSignUp}
              className={isSignUp ? 'is-active' : ''}
              onClick={() => switchMode(true)}
            >
              Create account
            </button>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label className="field-label" htmlFor="login-email">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                required
              />
            </div>

            <div className="field">
              <label className="field-label" htmlFor="login-password">
                Password
              </label>
              <span className="field-control">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  aria-describedby={isSignUp ? 'login-password-hint' : undefined}
                  required
                />
                <button
                  type="button"
                  className="field-reveal"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                </button>
              </span>
              {isSignUp && (
                <span className="field-hint" id="login-password-hint">
                  At least 8 characters.
                </span>
              )}
            </div>

            {isSignUp && (
              <div className="field">
                <label className="field-label" htmlFor="login-confirm">
                  Confirm password
                </label>
                <input
                  id="login-confirm"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError('');
                  }}
                  required
                />
              </div>
            )}

            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="btn btn-primary login-submit" disabled={isSubmitting}>
              {isSubmitting ? (isSignUp ? 'Creating account…' : 'Signing in…') : submitLabel}
            </button>
          </form>

          <p className="login-privacy support-note">
            Your check-in answers are scored and then discarded. They aren’t stored on our servers.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;

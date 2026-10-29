// Small helpers around the auth token and the latest check-in result.

export const getToken = () => localStorage.getItem('token');
export const getEmail = () => localStorage.getItem('email') || '';

export const saveSession = (token, email) => {
  localStorage.setItem('token', token);
  localStorage.setItem('email', email);
};

export const clearSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('email');
  sessionStorage.removeItem('equilix:lastResult');
};

export const saveResult = (result) => {
  try {
    sessionStorage.setItem('equilix:lastResult', JSON.stringify(result));
  } catch (e) {
    // Storage can be unavailable (private mode); the report still works from router state.
  }
};

export const loadResult = () => {
  try {
    return JSON.parse(sessionStorage.getItem('equilix:lastResult'));
  } catch (e) {
    return null;
  }
};

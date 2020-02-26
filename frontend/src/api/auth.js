import api from './api';

const localStorageKey = '__token__';

function handleDataResponse({ user, token }) {
  window.localStorage.setItem(localStorageKey, token);
  return user;
}

async function getUser() {
  const token = getToken();
  if (!token) {
    return Promise.resolve(null);
  }

  return api('users/me').catch(err => {
    logout();
    return Promise.reject(err);
  });
}

async function login({ email, password }) {
  const res = await api('users/login', 'POST', { body: { email, password } });
  return handleDataResponse(res);
}

async function register({ name, email, username, password }) {
  const res = await api('users', 'POST', {
    body: {
      name,
      email,
      username,
      password
    }
  });
  return handleDataResponse(res);
}

async function logout() {
  await api('users/me/logout', 'POST');
  window.localStorage.removeItem(localStorageKey);
}

function getToken() {
  return window.localStorage.getItem(localStorageKey);
}

export { login, register, logout, getToken, getUser };

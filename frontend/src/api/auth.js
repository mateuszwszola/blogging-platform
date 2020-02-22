import api from './api';

const localStorageKey = '__token__';

function handleDataResponse({ data: { token, ...user } }) {
  window.localStorage.setItem(localStorageKey, token);
  return user;
}

function getToken() {
  return window.localStorage.getItem(localStorageKey);
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
  try {
    const res = await api('users/login', 'POST', { email, password });
    return handleDataResponse(res);
  } catch (error) {
    console.log(error);
  }
}

async function register({ name, email, username, password }) {
  try {
    const res = await api('users/register', 'POST', {
      name,
      email,
      username,
      password
    });
    return handleDataResponse(res);
  } catch (error) {
    console.log(error);
  }
}

function logout({ username, password }) {
  window.localStorage.removeItem(localStorageKey);
  return Promise.resolve();
}

export { login, register, logout, getToken, getUser };

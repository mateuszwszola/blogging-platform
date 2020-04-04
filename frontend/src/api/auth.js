import client from './client';

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

  return client('users/me').catch((err) => {
    logout();
    return Promise.reject(err);
  });
}

async function login({ email, password }) {
  const res = await client('users/login', {
    body: { email, password },
  });
  return handleDataResponse(res);
}

async function register({ name, email, username, password }) {
  const res = await client('users', {
    body: {
      name,
      email,
      username,
      password,
    },
  });
  return handleDataResponse(res);
}

function logout() {
  window.localStorage.removeItem(localStorageKey);
}

function getToken() {
  return window.localStorage.getItem(localStorageKey);
}

export { login, register, logout, getToken, getUser };

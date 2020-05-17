import client, { localStorageKey } from './client';

function handleDataResponse({ user, token }) {
  window.localStorage.setItem(localStorageKey, token);

  return user;
}

async function getUser() {
  const token = getToken();
  if (!token) {
    return Promise.resolve(null);
  }

  return client('users/me')
    .then((res) => res.user)
    .catch((err) => {
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

function sendResetPasswordEmail({ email }) {
  return client('users/user/email', {
    body: { email },
  });
}

function logout() {
  window.localStorage.removeItem(localStorageKey);
}

function getToken() {
  return window.localStorage.getItem(localStorageKey);
}

export { login, register, logout, getToken, getUser, sendResetPasswordEmail };

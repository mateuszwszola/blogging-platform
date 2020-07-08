import { queryCache } from 'react-query';
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
  const res = await client('auth/signin', {
    body: { email, password },
  });
  return handleDataResponse(res);
}

async function register({ name, email, username, password }) {
  const res = await client('auth/signup', {
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
  return client('auth/user/email', {
    body: { email },
  });
}

function receiveNewPassword({ userId, token, password }) {
  return client(`auth/user/receive_new_password/${userId}/${token}`, {
    body: { password },
  });
}

function updatePassword({ currentPassword, newPassword }) {
  return client('auth/user/password', {
    body: { currentPassword, newPassword },
  });
}

function logout() {
  queryCache.clear();
  window.localStorage.removeItem(localStorageKey);
}

function getToken() {
  return window.localStorage.getItem(localStorageKey);
}

function isLoggedIn() {
  return Boolean(getToken());
}

export {
  login,
  register,
  logout,
  getToken,
  getUser,
  sendResetPasswordEmail,
  receiveNewPassword,
  updatePassword,
  isLoggedIn,
};

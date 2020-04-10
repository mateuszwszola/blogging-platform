const API_BASE_URL =
  window.location.hostname === 'localhost'
    ? process.env.REACT_APP_API_URL_DEV
    : process.env.REACT_APP_API_URL_PROD;

const localStorageKey = '__token__';

async function client(endpoint, { body, ...customConfig } = {}) {
  const token = window.localStorage.getItem(localStorageKey);
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['x-auth-token'] = token;
  }
  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const res = await window.fetch(`${API_BASE_URL}/${endpoint}`, config);
  const data = await res.json();

  if (!res.ok) {
    return Promise.reject(data);
  }
  return Promise.resolve(data);
}

export default client;
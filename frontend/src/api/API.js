const API_BASE_URL = 'http://localhost:3001/api';

async function api(endpoint, method = 'GET', { body, ...customConfig } = {}) {
  const token = window.localStorage.getItem('__token__');
  const headers = { 'content-type': 'application/json' };
  if (token) {
    headers['x-auth-token'] = token;
  }
  const config = {
    method,
    headers,
    ...customConfig
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

export default api;

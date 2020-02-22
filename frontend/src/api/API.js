async function api(endpoint, method = 'GET', body = {}) {
  const token = window.localStorage.getItem('__token__');
  const headers = { 'content-type': 'application/json' };
  if (token) {
    headers['x-auth-token'] = token;
  }
  const config = {
    method,
    headers
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const res = await window.fetch(
    `${process.env.API_BASE_URL}/${endpoint}`,
    config
  );
  return await res.json();
}

export default api;

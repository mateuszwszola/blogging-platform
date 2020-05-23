import { logout } from './auth';

export const API_BASE_URL =
  window.location.hostname === 'localhost'
    ? process.env.REACT_APP_API_URL_DEV
    : process.env.REACT_APP_API_URL_PROD;

export const localStorageKey = '__token__';

async function client(endpoint, { body, formData, ...customConfig } = {}) {
  const token = window.localStorage.getItem(localStorageKey);
  const headers = {};
  if (token) {
    headers['x-auth-token'] = token;
  }
  const config = {
    method: body || formData ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.headers['Content-Type'] = 'application/json';
    config.body = JSON.stringify(body);
  }

  if (formData) {
    /*
    In the case of sending formData, omit setting content-type,
    the browser will do it better, automatically
    
    https://stackoverflow.com/questions/35192841/fetch-post-with-multipart-form-data

    */
    config.body = formData;
  }

  return window
    .fetch(`${API_BASE_URL}/${endpoint}`, config)
    .then(async (res) => {
      if (res.status === 401) {
        logout();
        window.location.assign('/login');
        return Promise.reject({ message: 'Please re-authenticate' });
      }

      const data = await res.json();

      if (res.ok) {
        return data;
      } else {
        return Promise.reject(data);
      }
    });
}

export default client;

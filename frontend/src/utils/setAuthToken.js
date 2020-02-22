import axios from 'axios';

const setAuthToken = () => {
  const token = localStorage.getItem('token');
  if (token) {
    // Apply the token to every request
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

export default setAuthToken;

const API_BASE_URL = 'http://localhost:3001/api';

export async function postData(url = '', data = {}) {
  try {
    const response = await fetch(API_BASE_URL + url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    return await response.json();
  } catch (error) {
    console.log('err catched');
    return error;
  }
}

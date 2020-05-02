import client from 'api/client';

async function updateUser(newUserData) {
  return await client('users', { body: newUserData, method: 'PUT' });
}

export { updateUser };

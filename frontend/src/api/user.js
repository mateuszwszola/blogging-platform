import client from 'api/client';

async function updateUser(newUserData) {
  return await client('users', { body: newUserData, method: 'PUT' });
}

async function uploadUserAvatar(photoFile) {
  const formData = new FormData();
  formData.append('photo', photoFile);

  return await client('users/photo', { formData });
}

async function deleteAccount() {
  return await client('users', { method: 'DELETE' });
}

export { updateUser, uploadUserAvatar, deleteAccount };

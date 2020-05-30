import client from 'api/client';

function getUserProfileById(userId) {
  return client(`users/profile/${userId}`);
}

function followUserProfile(userId) {
  return client(`users/${userId}/follow`, { method: 'POST' });
}

function unfollowUserProfile(userId) {
  return client(`users/${userId}/follow`, { method: 'DELETE' });
}

export { getUserProfileById, followUserProfile, unfollowUserProfile };

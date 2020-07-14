import client from 'api/client';

function getProfiles() {
  return client('users/profile');
}

function getUserProfileById(userId) {
  return client(`users/profile/${userId}`);
}

function followProfile(userId) {
  return client(`users/profile/${userId}/follow`, { method: 'POST' });
}

function unfollowProfile(userId) {
  return client(`users/profile/${userId}/follow`, { method: 'DELETE' });
}

export { getProfiles, getUserProfileById, followProfile, unfollowProfile };

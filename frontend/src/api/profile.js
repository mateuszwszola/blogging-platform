import client from 'api/client';

function getProfiles() {
  return client('users/profile');
}

function getProfileById(userId) {
  return client(`users/profile/${userId}`);
}

function getProfileFollowings(userId) {
  return client(`users/profile/${userId}/following`);
}

function followProfile(userId) {
  return client(`users/profile/${userId}/follow`, { method: 'POST' });
}

function unfollowProfile(userId) {
  return client(`users/profile/${userId}/follow`, { method: 'DELETE' });
}

export {
  getProfiles,
  getProfileById,
  getProfileFollowings,
  followProfile,
  unfollowProfile,
};

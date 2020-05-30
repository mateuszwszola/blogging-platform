import { useQuery } from 'react-query';
import { getUserProfileById } from 'api/profile';

function useUserProfile(userId) {
  return useQuery(userId && ['profile', userId], () =>
    getUserProfileById(userId).then((res) => res.profile)
  );
}

export { useUserProfile };

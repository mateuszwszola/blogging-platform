import { useQuery } from 'react-query';
import { getUserProfileById } from 'api/profile';

function useUserProfile(userId) {
  return useQuery(
    ['profile', userId],
    () => getUserProfileById(userId).then((res) => res.profile),
    {
      enabled: userId,
    }
  );
}

export { useUserProfile };

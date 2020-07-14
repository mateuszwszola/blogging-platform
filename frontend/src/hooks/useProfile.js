import { useQuery, useMutation, queryCache } from 'react-query';
import {
  getProfileById,
  getProfileFollowings,
  followProfile,
  unfollowProfile,
} from 'api/profile';

function useUserProfile(userId) {
  return useQuery(
    ['profile', userId],
    () => getProfileById(userId).then((res) => res.profile),
    {
      enabled: userId,
    }
  );
}

function useProfileFollowing(userId) {
  return useQuery(
    ['profile', userId, { type: 'following' }],
    () => getProfileFollowings(userId).then((res) => res.profiles),
    {
      enabled: userId,
    }
  );
}

function useFollowProfile() {
  return useMutation((userId) => followProfile(userId), {
    onMutate: (userId) => {
      queryCache.cancelQueries(['profile', userId]);
      const previousProfile = queryCache.getQueryData(['profile', userId]);
      queryCache.setQueryData(['profile', userId], (profile) => ({
        ...profile,
        isFollowing: true,
      }));
      return () =>
        queryCache.setQueryData(['profile', userId], previousProfile);
    },
    onSettled: (userId, error, variables, rollback) => {
      if (error) {
        rollback();
      }
    },
  });
}

function useUnfollowProfile() {
  return useMutation((userId) => unfollowProfile(userId), {
    onMutate: (userId) => {
      queryCache.cancelQueries(['profile', userId]);
      const previousProfile = queryCache.getQueryData(['profile', userId]);
      queryCache.setQueryData(['profile', userId], (profile) => ({
        ...profile,
        isFollowing: false,
      }));
      return () =>
        queryCache.setQueryData(['profile', userId], previousProfile);
    },
    onSettled: (userId, error, variables, rollback) => {
      if (error) {
        rollback();
      }
    },
  });
}

export {
  useUserProfile,
  useProfileFollowing,
  useFollowProfile,
  useUnfollowProfile,
};

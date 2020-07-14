import { useQuery, useMutation, queryCache } from 'react-query';
import {
  getUserProfileById,
  followProfile,
  unfollowProfile,
} from 'api/profile';

function useUserProfile(userId) {
  return useQuery(
    ['profile', userId],
    () => getUserProfileById(userId).then((res) => res.profile),
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

export { useUserProfile, useFollowProfile, useUnfollowProfile };

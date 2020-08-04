import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useProfileFollowing } from 'hooks/useProfile';
import Loading from 'components/Loading';
import DisplayError from 'components/DisplayError';
import ProfileCard from 'components/ProfileCard';

function ProfileFollowing({ profileId }) {
  const { status, data: profiles, error } = useProfileFollowing(profileId);
  return (
    <div>
      {status === 'loading' ? (
        <Loading />
      ) : status === 'error' ? (
        <DisplayError msg={error.message} />
      ) : (
        <>
          {profiles.length > 0 ? (
            <div
              className={clsx(
                'grid grid-cols-1 row-gap-20 col-gap-12',
                profiles.length > 1
                  ? 'md:grid-cols-2'
                  : profiles.length > 2
                  ? 'md:grid-cols-3'
                  : ''
              )}
            >
              {profiles.map((profile) => (
                <ProfileCard key={profile._id} profile={profile} />
              ))}
            </div>
          ) : (
            <h2 className="text-center text-2xl">
              You don't follow any users yet
            </h2>
          )}
        </>
      )}
    </div>
  );
}

ProfileFollowing.propTypes = {
  profileId: PropTypes.string.isRequired,
};

export default ProfileFollowing;

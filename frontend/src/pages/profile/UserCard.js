import React from 'react';
import PropTypes from 'prop-types';
import { useUser } from 'context/UserContext';
import { useFollowProfile, useUnfollowProfile } from 'hooks/useProfile';
import { UserAvatar } from 'components/UserAvatar';
import { Button } from 'components/layout/Button';
import AuthMenu from 'pages/profile/userCard/AuthMenu';

function UserCard({ profile }) {
  const { user } = useUser();
  const [followProfile] = useFollowProfile();
  const [unfollowProfile] = useUnfollowProfile();

  const handleFollow = () => {
    if (!user || !profile) return;

    if (profile.isFollowing) {
      unfollowProfile(profile._id);
    } else {
      followProfile(profile._id);
    }
  };

  return (
    <div className="mt-8 w-full max-w-xs mx-auto bg-white rounded-t-md shadow-md">
      <div className="w-full flex justify-center items-center py-2">
        <UserAvatar avatarURL={profile.avatar?.image_url} />
      </div>

      <div className="border-t sm:py-4 px-2">
        <h3 className="text-2xl text-center font-semibold text-gray-800">
          {profile.name}
        </h3>
        {profile.bio && (
          <p className="text-lg text-gray-700 text-center">{profile.bio}</p>
        )}
      </div>

      {profile.isOwner ? (
        <AuthMenu />
      ) : user ? (
        <div className="pt-2 pb-4 px-4 flex justify-center">
          <Button onClick={handleFollow} fullWidth version="secondary">
            {profile.isFollowing ? 'Unfollow' : 'Follow'}
          </Button>
        </div>
      ) : (
        ''
      )}
    </div>
  );
}

UserCard.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default UserCard;

import React from 'react';
import PropTypes from 'prop-types';

function PostControllers({ isEditting, setIsEditting, handleDeletePost }) {
  return (
    <div className="w-full flex justify-center md:justify-end">
      {isEditting ? (
        <>
          <button
            onClick={() => setIsEditting(false)}
            className="bg-green-500 rounded py-1 px-2 text-sm md:text-base font-semibold text-green-100 m-2 hover:bg-green-600"
          >
            Save Changes
          </button>
          <button
            onClick={() => setIsEditting(false)}
            className="bg-red-500 rounded py-1 px-2 text-sm md:text-base font-semibold text-red-100 m-2 hover:bg-red-600"
          >
            Cancel Editting
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => setIsEditting(true)}
            className="bg-orange-500 rounded py-1 px-2 text-sm md:text-base font-semibold text-orange-100 m-2 hover:bg-orange-600"
          >
            Edit Post
          </button>
          <button
            onClick={handleDeletePost}
            className="bg-red-500 rounded py-1 px-2 text-sm md:text-base font-semibold text-red-100 m-2 hover:bg-red-600"
          >
            Delete Post
          </button>
        </>
      )}
    </div>
  );
}

PostControllers.propTypes = {
  isEditting: PropTypes.bool.isRequired,
  setIsEditting: PropTypes.func.isRequired,
  handleDeletePost: PropTypes.func.isRequired,
};

export default PostControllers;

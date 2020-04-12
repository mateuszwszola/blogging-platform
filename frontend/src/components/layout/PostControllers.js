import React from 'react';
import PropTypes from 'prop-types';
import { EditIcon, CloseIcon, BinIcon } from 'icons';

function PostControllers({ isEditting, setIsEditting, handleDeletePost }) {
  return (
    <div className="w-full flex justify-center md:justify-end">
      {isEditting ? (
        <>
          {/* <button
            onClick={() => setIsEditting(false)}
            className="bg-green-500 rounded py-1 px-2 text-sm md:text-base font-semibold text-green-100 m-2 hover:bg-green-600"
          >
            <SaveIcon className="w-6 h-6 fill-current" />
          </button> */}
          <button
            onClick={() => setIsEditting(false)}
            className="bg-gray-500 rounded py-1 px-2 text-sm md:text-base font-semibold text-gray-100 m-2 hover:bg-gray-600"
          >
            <CloseIcon className="w-6 h-6 fill-current" />
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => setIsEditting(true)}
            className="bg-gray-500 rounded py-1 px-2 text-sm md:text-base font-semibold text-gray-100 m-2 hover:bg-gray-600"
          >
            <EditIcon className="w-6 h-6 fill-current" />
          </button>
          <button
            onClick={handleDeletePost}
            className="bg-red-500 rounded py-1 px-2 text-sm md:text-base font-semibold text-red-100 m-2 hover:bg-red-600"
          >
            <BinIcon className="w-6 h-6 fill-current" />
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

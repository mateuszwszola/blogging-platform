import React from 'react';
import PropTypes from 'prop-types';
import { EditIcon, CloseIcon, BinIcon } from 'icons';
import { Button } from './Button';

function PostControllers({ isEditting, setIsEditting, handleDeletePost }) {
  return (
    <div className="w-full flex justify-center md:justify-end space-x-4">
      {isEditting ? (
        <Button onClick={() => setIsEditting(false)} version="edit" size="sm">
          <CloseIcon className="w-6 h-6 fill-current" />
        </Button>
      ) : (
        <>
          <Button onClick={() => setIsEditting(true)} version="edit" size="sm">
            <EditIcon className="w-6 h-6 fill-current" />
          </Button>
          <Button onClick={handleDeletePost} version="delete" size="sm">
            <BinIcon className="w-6 h-6 fill-current" />
          </Button>
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

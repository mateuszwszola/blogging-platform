import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import { EditIcon, CloseIcon, BinIcon } from 'icons';

function Controllers({ isEditting, setIsEditting, handlePostDelete }) {
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
          <Button onClick={handlePostDelete} version="delete" size="sm">
            <BinIcon className="w-6 h-6 fill-current" />
          </Button>
        </>
      )}
    </div>
  );
}

Controllers.propTypes = {
  isEditting: PropTypes.bool.isRequired,
  setIsEditting: PropTypes.func.isRequired,
  handlePostDelete: PropTypes.func.isRequired,
};

export default Controllers;

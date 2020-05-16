import React from 'react';
import PropTypes from 'prop-types';
import { UploadIcon } from 'icons/UploadIcon';

const ImgUploadInput = ({ handleChange, label, photoFile }) => {
  return (
    <div className="w-full">
      {label && (
        <p className="text-sm uppercase text-gray-800 font-semibold">{label}</p>
      )}
      <label
        type="button"
        className="flex flex-col items-center px-2 py-4 bg-gray-100 text-blue-500 rounded tracking-wide uppercase border border-gray-400 cursor-pointer hover:bg-blue-500 hover:text-blue-100 transition duration-75 focus:outline-none"
      >
        <UploadIcon className="w-8 h-8 fill-current" />
        <span className="mt-2 text-base leading-normal">
          {!photoFile ? 'Select Image (jpg, jpeg, png)' : 'Image Selected'}
        </span>
        <input
          className="sr-only"
          type="file"
          accept="image/jpeg, image/jpg, image/png"
          name="photo"
          id="photo"
          onChange={handleChange}
        />
      </label>
    </div>
  );
};

ImgUploadInput.propTypes = {
  handleChange: PropTypes.func.isRequired,
  label: PropTypes.string,
};

export default ImgUploadInput;

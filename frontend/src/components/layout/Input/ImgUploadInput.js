import React from 'react';
import PropTypes from 'prop-types';
// import { UploadIcon } from 'icons/UploadIcon';

const ImgUploadInput = ({ handleChange }) => (
  <div className="w-full">
    <p className="mb-2 text-sm uppercase text-gray-800 font-semibold">
      Upload Img
    </p>
    <input
      className="sr-only"
      type="file"
      name="photo"
      id="photo"
      onChange={handleChange}
    />
    <label
      htmlFor="photo"
      className="py-1 px-2 text-sm uppercase bg-gray-500 rounded text-gray-100 cursor-pointer"
    >
      Browse
    </label>
  </div>
);

ImgUploadInput.propTypes = {
  handleChange: PropTypes.func.isRequired,
};

export default ImgUploadInput;

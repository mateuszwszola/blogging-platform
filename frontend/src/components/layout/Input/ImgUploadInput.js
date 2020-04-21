import React from 'react';
import PropTypes from 'prop-types';
import { UploadIcon } from 'icons/UploadIcon';

const ImgUploadInput = ({ handleChange }) => (
  <div className="w-full">
    <p className="text-sm uppercase text-gray-800 font-semibold">
      Background Image
    </p>
    <label className="flex flex-col items-center px-2 py-4 bg-gray-100 text-blue-500 rounded tracking-wide uppercase border border-gray-400 cursor-pointer hover:bg-blue-500 hover:text-white transition duration-75">
      <UploadIcon className="w-8 h-8" />
      <span className="mt-2 text-base leading-normal">
        Select Image (jpg, jpeg, png)
      </span>
      <input
        className="sr-only"
        type="file"
        name="photo"
        id="photo"
        onChange={handleChange}
      />
    </label>
  </div>
);

ImgUploadInput.propTypes = {
  handleChange: PropTypes.func.isRequired,
};

export default ImgUploadInput;

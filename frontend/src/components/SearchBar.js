import React from 'react';
import PropTypes from 'prop-types';
import { SearchIcon } from 'icons';

function SearchBar({ inputValue, handleInputValueChange }) {
  return (
    <>
      <SearchIcon className="w-5 h-5 fill-current mr-2 text-gray-500" />
      <label htmlFor="search-term" className="sr-only">
        Search
      </label>
      <input
        type="text"
        name="search-term"
        value={inputValue}
        onChange={handleInputValueChange}
        className="border border-gray-300 rounded py-1 px-2"
        placeholder="Search"
      />
    </>
  );
}

SearchBar.propTypes = {
  inputValue: PropTypes.string.isRequired,
  handleInputValueChange: PropTypes.func.isRequired,
};

export default SearchBar;

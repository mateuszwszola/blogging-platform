import React from 'react';
import PropTypes from 'prop-types';

function DisplayError({ msg }) {
  return <div className="mt-16 text-center text-xl">{msg}</div>;
}

DisplayError.propTypes = {
  msg: PropTypes.string.isRequired,
};

DisplayError.defaultProps = {
  msg: 'There was a problem with the server. Try reload the page',
};

export default DisplayError;

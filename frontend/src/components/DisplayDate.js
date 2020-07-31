import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

function DisplayDate({ date }) {
  return <Moment format="LL">{date}</Moment>;
}

DisplayDate.propTypes = {
  date: PropTypes.string.isRequired,
};

export default DisplayDate;

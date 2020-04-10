import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

function DisplayDate({ date }) {
  return <Moment format="YYYY/MM/DD">{date}</Moment>;
}

DisplayDate.propTypes = {
  date: PropTypes.string.isRequired,
};

export default DisplayDate;

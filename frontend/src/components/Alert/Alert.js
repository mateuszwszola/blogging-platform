import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './Alert.module.css';
import { InfoIcon, LikeIcon } from '../../icons';

function Alert({ type, message, onClose, timeout = 1500 }) {
  const [showAlert, setShowAlert] = useState(true);

  const close = () => {
    if (onClose) {
      onClose();
    } else {
      setShowAlert(false);
    }
  };

  useEffect(() => {
    const timeoutID = setTimeout(close, timeout);
    return () => clearTimeout(timeoutID);
  }, []);

  if (showAlert) {
    return (
      <div className={styles.container}>
        <div className={styles.alert}>
          <div className={styles.content}>
            {type === 'success' ? (
              <LikeIcon className="block mx-auto w-24 h-24 fill-current text-green-400" />
            ) : (
              <InfoIcon className="block mx-auto w-24 h-24 fill-current text-red-400" />
            )}
            <span className={styles.message}>{message}</span>
            <button className={styles.button} onClick={close} />
          </div>
        </div>
      </div>
    );
  }

  return null;
}

Alert.propTypes = {
  type: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired
};

export default Alert;

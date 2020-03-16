import React from 'react';
import styles from './Alert.module.css';

function Alert() {
  const [show, setShow] = React.useState(true);

  const close = () => {
    setShow(false);
  };

  if (show) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.alert}>
          Alert!
          <button className={styles.button} onClick={close}>
            Close
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default Alert;

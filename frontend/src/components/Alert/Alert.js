import React from 'react';
import styles from './Alert.module.css';
import { InfoIcon, LikeIcon } from '../../icons';
import { useAlert } from '../../context/AlertContext';

function Alert(props) {
  const { alerts, removeAlert } = useAlert();

  const handleClose = alertId => {
    removeAlert(alertId);
  };

  if (!alerts || alerts.length === 0) {
    return null;
  }

  return (
    <>
      {alerts.map(alert => (
        <div key={alert.id} className={styles.container}>
          <div className={styles.alert}>
            <div className={styles.content}>
              {alert.alertType === 'success' ? (
                <LikeIcon className="block mx-auto w-24 h-24 fill-current text-green-400" />
              ) : (
                <InfoIcon className="block mx-auto w-24 h-24 fill-current text-red-400" />
              )}
              <span className={styles.message}>{alert.msg}</span>
              <button className={styles.button} onClick={handleClose} />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default Alert;

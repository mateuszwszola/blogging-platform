import React from 'react';
import styles from './Loading.module.css';

function Loading() {
  return (
    <div className={styles.container}>
      <div className={styles.loading}>
        <div />
        <div />
        <div />
      </div>
    </div>
  );
}

export default Loading;

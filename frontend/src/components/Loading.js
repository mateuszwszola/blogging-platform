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

export function LoadingWithOverlay() {
  return (
    <div className="z-30 absolute top-0 bottom-0 left-0 right-0">
      <Loading />
    </div>
  );
}

export default Loading;

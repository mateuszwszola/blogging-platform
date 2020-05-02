import React from 'react';
import Loading from './Loading';

export function LoadingWithOverlay() {
  return (
    <div className="z-30 absolute top-0 bottom-0 left-0 right-0">
      <Loading />
    </div>
  );
}

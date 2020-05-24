import { useState, useCallback } from 'react';

function usePhotoFile(initialState = null) {
  const [photoFile, setPhotoFile] = useState(initialState);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhotoFile(file);
  };

  const handlePhotoReset = useCallback(() => {
    setPhotoFile(initialState);
  }, [setPhotoFile, initialState]);

  return {
    photoFile,
    handlePhotoChange,
    handlePhotoReset,
  };
}

export default usePhotoFile;

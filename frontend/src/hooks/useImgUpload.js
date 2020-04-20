import { useState } from 'react';

function useImgUpload() {
  const [photo, setPhoto] = useState(null);

  const handleChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
  };

  return [photo, handleChange];
}

export default useImgUpload;

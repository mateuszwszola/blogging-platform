import React, { useState } from 'react';
import useImgUpload from 'hooks/useImgUpload';
import ImgUploadInput from 'components/layout/Input/ImgUploadInput';
import Loading from 'components/Loading';
import axios from 'axios';

function ImgUpload() {
  const [photo, handlePhotoChange] = useImgUpload();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const upload = (e) => {
    e.preventDefault();
    if (photo) {
      setError('');
      setUploading(true);
      const formData = new FormData();
      formData.append('photo', photo);
      axios
        .post(`http://localhost:3001/api/photos`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-auth-token': window.localStorage.getItem('__token__') || '',
          },
        })
        .then((res) => {
          console.log(res);
          setUploading(false);
        })
        .catch((err) => {
          console.error(err);
          setUploading(false);
        });
    }
  };

  return (
    <>
      {uploading ? (
        <Loading />
      ) : (
        <>
          <form onSubmit={upload} method="post" encType="multipart/form-data">
            <ImgUploadInput handleChange={handlePhotoChange} />
            <button
              className="rounded bg-green-400 text-green-100 py-2 px-4"
              type="submit"
            >
              Upload
            </button>
          </form>
        </>
      )}
    </>
  );
}

export default ImgUpload;

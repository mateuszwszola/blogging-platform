import { useReducer } from 'react';
import client from 'api/client';

import { LOADING, RESPONSE_COMPLETE, ERROR } from 'actions/types';
const SET_PHOTO_FILE = 'SET_PHOTO_FILE';

const initialState = {
  photoFile: null,
  photoURL: null,
  error: null,
  loading: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case LOADING:
      return {
        ...initialState,
        loading: true,
      };
    case RESPONSE_COMPLETE:
      return {
        ...initialState,
        photoURL: action.payload.photoURL,
      };
    case ERROR:
      return {
        ...initialState,
        error: action.payload.error,
      };
    case SET_PHOTO_FILE:
      return {
        ...initialState,
        photoFile: action.payload.photoFile,
      };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

function useImgUpload(url) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { photoFile, photoURL, error, loading } = state;

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    dispatch({ type: 'SET_PHOTO_FILE', payload: { photoFile: file } });
  };

  const handlePhotoReset = () => {
    dispatch({ type: 'SET_PHOTO_FILE', payload: { photoFile: null } });
  };

  const uploadPhoto = () => {
    const formData = new FormData();
    formData.append('photo', photoFile);

    dispatch({ type: LOADING });

    client(url, { formData })
      .then((response) => {
        dispatch({
          type: RESPONSE_COMPLETE,
          payload: { photoURL: response.photoURL },
        });
      })
      .catch((error) => {
        dispatch({ type: ERROR, payload: { error } });
      });
  };

  return {
    photoFile,
    photoURL,
    handlePhotoChange,
    uploadPhoto,
    loading,
    error,
    handlePhotoReset,
  };
}

export default useImgUpload;

import { useState, useEffect } from 'react';
import { debounce } from 'lodash';

function useDebouncedSearchKey(inputValue) {
  const [searchKey, setSearchKey] = useState('');
  const debouncedSearchKeyUpdate = debounce(() => {
    setSearchKey(inputValue);
  }, 500);

  useEffect(() => {
    debouncedSearchKeyUpdate();
    return () => {
      debouncedSearchKeyUpdate.cancel();
    };
  }, [inputValue, debouncedSearchKeyUpdate]);

  return searchKey;
}

export default useDebouncedSearchKey;

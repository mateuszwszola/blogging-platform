import { useState } from 'react';

function useInput(initialValue = '') {
  const [value, setValue] = useState(initialValue);
  function handleValueChange(e) {
    setValue(e.target.value);
  }

  function handleReset() {
    setValue(initialValue);
  }

  return [value, handleValueChange, handleReset];
}

export default useInput;

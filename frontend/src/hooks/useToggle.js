import { useState } from 'react';

function useToggle(initialValue = false) {
  const [isToggle, setIsToggle] = useState(initialValue);
  function toggle() {
    setIsToggle(!isToggle);
  }

  return [isToggle, setIsToggle, toggle];
}

export default useToggle;

import { useState } from 'react';

function useToggle(initialValue = false) {
  const [isToggle, setIsToggle] = useState(initialValue);
  function toggle() {
    setIsToggle((on) => !on);
  }

  return [isToggle, toggle, setIsToggle];
}

export default useToggle;

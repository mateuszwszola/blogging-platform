import { useEffect, useState } from 'react';

export function useOnClickOutside(ref, callback) {
  useEffect(() => {
    function handleMouseDown(event) {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      callback(event);
    }

    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [ref, callback]);
}

export function useUserScrolledAfterEl(ref) {
  const [scrolledAfterEl, setScrolledAfterEl] = useState(false);

  useEffect(() => {
    function handleScroll(event) {
      const scrollTop =
        window.pageYOffset ||
        (document.documentElement || document.body.parentNode || document.body)
          .scrollTop;
      if (ref.current) {
        const refHeight = ref.current.clientHeight;
        if (scrollTop > refHeight - 56) {
          setScrolledAfterEl(true);
        } else {
          setScrolledAfterEl(false);
        }
      }
    }

    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  });

  return scrolledAfterEl;
}

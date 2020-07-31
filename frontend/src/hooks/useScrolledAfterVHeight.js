import { useEffect, useState, useCallback } from 'react';
import { throttle } from 'lodash';

function useScrolledAfterVHeight(offset) {
  const [scrolledAfterVHeight, setScrolledAfterVHeight] = useState(false);

  const handleScroll = useCallback(
    throttle((event) => {
      const scrollTop =
        window.pageYOffset ||
        (document.documentElement || document.body.parentNode || document.body)
          .scrollTop;
      if (scrollTop >= window.innerHeight - offset) {
        setScrolledAfterVHeight(true);
      } else {
        setScrolledAfterVHeight(false);
      }
    }, 16),
    [setScrolledAfterVHeight]
  );

  useEffect(() => {
    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return scrolledAfterVHeight;
}

export default useScrolledAfterVHeight;

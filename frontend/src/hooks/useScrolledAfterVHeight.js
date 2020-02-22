import { useEffect, useState } from 'react';

export function useScrolledAfterVHeight(offset) {
  const [scrolledAfterVHeight, setScrolledAfterVHeight] = useState(false);

  useEffect(() => {
    function handleScroll(event) {
      const scrollTop =
        window.pageYOffset ||
        (document.documentElement || document.body.parentNode || document.body)
          .scrollTop;
      if (scrollTop >= window.innerHeight - offset) {
        setScrolledAfterVHeight(true);
      } else {
        setScrolledAfterVHeight(false);
      }
    }

    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [offset]);

  return scrolledAfterVHeight;
}

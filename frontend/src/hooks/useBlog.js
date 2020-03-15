import { useState, useEffect } from 'react';
import * as blogAPI from '../api/blog';

function useBlogBySlugName(slug) {
  const [status, setStatus] = useState('loading');
  const [blog, setBlog] = useState(null);

  function reloadBlog() {
    setStatus('loading');
  }
  
  useEffect(() => {
    let canceled = false;

    function getBlog() {
      blogAPI.getBlogBySlugName(slug)
        .then(res => {
          setBlog(res.blog);
          setStatus('loaded');
        })
        .catch(err => {
          console.error(err);
          setStatus('error');
        })
    }

    if (!canceled && status === 'loading') {
      getBlog();
    }

    return () => canceled = true;
  }, [status, slug]);

  return [blog, status, reloadBlog];
}

export { useBlogBySlugName };
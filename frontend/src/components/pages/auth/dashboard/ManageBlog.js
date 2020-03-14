import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useParams , useHistory } from 'react-router-dom';
import AddBlogPost from './AddBlogPost';
import api from '../../../../api/api';

function ManageBlog({blog, status, deleteBlog, ...props }) {
  return (
    <>
      <div className="w-full flex justify-end">
        <button onClick={deleteBlog} className="bg-red-500 rounded py-2 px-4 font-semibold text-red-100 m-2 hover:bg-red-600">Delete Blog</button>
      </div>
      <AddBlogPost 
        blog={blog}
        status={status}
      />
    </>
  )
}

ManageBlog.propTypes = {
  blog: PropTypes.object,
  status: PropTypes.string.isRequired,
  deleteBlog: PropTypes.func.isRequired,
}

function ManageBlogContainer({ reloadBlogs }) {
  const { blogSlug } = useParams();
  const [blog, setBlog] = useState(null);
  const [status, setStatus] = useState('loading');
  let history = useHistory();

  useEffect(() => {
    function getBlog() {
      api(`blogs/slug/${blogSlug}`)
        .then(res => {
          setBlog(res.blog);
          setStatus('loaded');
        })
        .catch(err => {
          console.error(err);
          setStatus('error');
        });
    }

    let canceled = false;

    if (!canceled) {
      getBlog();
    }

    return () => (canceled = true);
  }, [blogSlug]);

  function deleteBlog() {
    if (blog) {
      api(`blogs/${blog._id}`, 'DELETE')
        .then(res => {
          reloadBlogs();
          history.push('/dashboard');
        })
        .catch(err => {
          console.error(err);
        })
    }
  }
  
  return <ManageBlog 
    deleteBlog={deleteBlog}
    blog={blog}
    status={status}
   />
}

ManageBlogContainer.propTypes = {
  reloadBlogs: PropTypes.func.isRequired,
}

export default ManageBlogContainer


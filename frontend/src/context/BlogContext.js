import React, { useReducer } from 'react';

const BlogContext = React.createContext();

function reducer(state, action) {
  switch (action.type) {
  }
}

function BlogProvider(props) {
  const [state, dispatch] = useReducer(reducer, {
    blogs: null
  });
}

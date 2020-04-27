const isUserPostOwner = (user, post) => {
  let isOwner = false;
  if (post && user) {
    if (post.user && typeof post.user === 'string') {
      if (post.user === user._id) {
        isOwner = true;
      }
    } else if (post.user && post.user._id === user._id) {
      isOwner = true;
    }
  }

  return isOwner;
};

export default isUserPostOwner;

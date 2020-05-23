// import { queryCache } from 'react-query';
import * as auth from 'api/auth';

async function bootstrapAppData() {
  const appData = {
    user: null,
    // userBlogs: [],
    // blogs: [],
    // userPosts: [],
    // posts: [],
  };

  if (auth.isLoggedIn()) {
    const user = await auth.getUser();
    appData.user = user;
  }

  // for (const [key, value] of Object.entries(appData)) {
  //   if (key === 'user') continue;
  //   queryCache.setQueryData(key, value);
  // }

  return appData;
}

export { bootstrapAppData };

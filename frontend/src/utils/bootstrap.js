import * as auth from 'api/auth';

async function bootstrapAppData() {
  const appData = {
    user: null,
  };

  if (auth.isLoggedIn()) {
    const user = await auth.getUser();
    appData.user = user;
  }

  return appData;
}

export { bootstrapAppData };

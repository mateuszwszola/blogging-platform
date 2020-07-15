# Blogging Platform

A full stack application to start and manage a blog.

https://blogging-platform.netlify.app/

## Tech Stack

- Frontend
  - React.js / React Query / React Router
  - Tailwind.css
  - Draft.js
- Backend
  - Node.js / Express.js / Mongoose
- Database
  - MongoDB

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [cloudinary](https://cloudinary.com/) account where user images will be stored
- [mailgun](https://www.mailgun.com/) account for password recovery emails
- Running MongoDB instance on the local machine

### Configuration / Setup

- Copy the [server/.env.example](server/.env.example) file to `server/.env` and update the values
  - You can obtain `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` from the [cloudinary](https://cloudinary.com/) dashboard page
  - You can obtain `MAILGUN_API_KEY` and `MAILGUN_DOMAIN` from the [mailgun](https://www.mailgun.com/) under the Settings - API Keys page
  - If your client is running on a different port, you will need to update `CORS_ORIGIN` port value
- Copy the [frontend/.env.example](frontend/.env.example) file to `frontend/.env` and update `REACT_APP_API_URL_DEV` only if you run the server on different port than `3001`

### Installing

Install server dependencies

```
cd server
npm install
```

Install client dependencies

```
cd frontend
npm install
```

### Running the server in development mode

```
cd server
npm run dev
```

### Running the frontend

```
cd frontend
npm start
```

## Running the tests

To run server endpoint tests along with some unit tests, run `npm test` from the server directory

## Author

**Mateusz Wszola**

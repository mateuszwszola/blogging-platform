# Blogging Platform

A full stack application to start and manage a blog.

https://blogging-platform.netlify.app/

![project-preview](https://res.cloudinary.com/dtti654qn/image/upload/c_scale,w_1280/v1626618854/github-projects/blogging-platform_myu7xh.png)

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

```bash
$ cd server
$ npm install
```

Install client dependencies

```bash
$ cd frontend
$ npm install
```

### Running the server in development mode

```bash
$ cd server
$ npm run dev
```

### Running the frontend

```bash
$ cd frontend
$ npm start
```

## Running the tests

### Server

Unit tests:

```bash
$ npm run test:unit
```

Integration tests:

```bash
$ npm run test:integration
```

## Author

**Mateusz Wszola**

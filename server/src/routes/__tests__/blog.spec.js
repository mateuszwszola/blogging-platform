const supertest = require('supertest');
const app = require('../../app');
const User = require('../../models/User');
const Blog = require('../../models/Blog');
const { setupDB, newId } = require('../../../test-setup.js');
const { generateNewToken } = require('../../middleware/auth');
const request = supertest(app);

const dummyUser = require('../../seeds/user.seed.json')[0];

setupDB();

describe('Blog API tests', () => {});

// tests/rbac.test.js

import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { app, server } from '../server.js';

dotenv.config();
const { expect } = chai;
chai.use(chaiHttp);

let adminToken;
let userToken;

before(async () => {
 await mongoose.connect(process.env.MONGO_URI || '');  // Register and login admin user
  await chai.request(app)
    .post('/api/auth/register')
    .send({ username: 'admin', password: 'admin123', role: 'Admin' });
  
  const adminLogin = await chai.request(app)
    .post('/api/auth/login')
    .send({ username: 'admin', password: 'admin123' });
  
  adminToken = adminLogin.body.accessToken;

  // Register and login regular user
  await chai.request(app)
    .post('/api/auth/register')
    .send({ username: 'user', password: 'user123', role: 'User' });
  
  const userLogin = await chai.request(app)
    .post('/api/auth/login')
    .send({ username: 'user', password: 'user123' });
  
  userToken = userLogin.body.accessToken;
});

after(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  server.close();
});

describe('RBAC Tests', () => {
  it('should allow admin to access all routes', async () => {
    const res = await chai.request(app)
      .get('/api/posts')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res).to.have.status(200);
  });

  it('should deny user from accessing admin routes', async () => {
    const res = await chai.request(app)
      .get('/api/posts')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res).to.have.status(403); // Assuming 403 Forbidden for unauthorized access
  });
});

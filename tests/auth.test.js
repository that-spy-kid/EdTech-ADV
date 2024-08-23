// tests/auth.test.js

import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { app, server } from '../server.js'; // Import app and server instances

dotenv.config();
const { expect } = chai;
chai.use(chaiHttp);

before(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

after(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  server.close(); // Close the server after tests
});

describe('Authentication Tests', () => {
  it('should register a new user', async () => {
    const res = await chai.request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        password: 'password123',
        role: 'User'
      });

    expect(res).to.have.status(201);
    expect(res.text).to.equal('User registered successfully');
  });

  it('should login the user and return access and refresh tokens', async () => {
    const res = await chai.request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'password123'
      });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('accessToken');
    expect(res.body).to.have.property('refreshToken');
  });

  it('should refresh the access token', async () => {
    const loginRes = await chai.request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'password123'
      });

    const res = await chai.request(app)
      .post('/api/auth/token')
      .set('Cookie', `refreshToken=${loginRes.body.refreshToken}`)
      .send();

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('accessToken');
  });
});

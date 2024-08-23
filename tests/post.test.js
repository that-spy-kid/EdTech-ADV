// tests/post.test.js

import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { app, server } from '../server.js';

dotenv.config();
const { expect } = chai;
chai.use(chaiHttp);

let token;

before(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await chai.request(app)
    .post('/api/auth/register')
    .send({ username: 'postuser', password: 'postpassword', role: 'User' });

  const loginRes = await chai.request(app)
    .post('/api/auth/login')
    .send({ username: 'postuser', password: 'postpassword' });

  token = loginRes.body.accessToken;
});

after(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  server.close();
});

describe('Post CRUD Tests', () => {
  let postId;

  it('should create a new post', async () => {
    const res = await chai.request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test Post', content: 'This is a test post' });

    postId = res.body._id;
    expect(res).to.have.status(201);
    expect(res.body).to.have.property('_id');
  });

  it('should read the created post', async () => {
    const res = await chai.request(app)
      .get(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('title', 'Test Post');
  });

  it('should update the post', async () => {
    const res = await chai.request(app)
      .put(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Post' });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('title', 'Updated Post');
  });

  it('should delete the post', async () => {
    const res = await chai.request(app)
      .delete(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res).to.have.status(200);
    expect(res.text).to.equal('Post deleted successfully');
  });
});

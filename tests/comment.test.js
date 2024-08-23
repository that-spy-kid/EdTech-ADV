// tests/comment.test.js

import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { app, server } from '../server.js';

dotenv.config();
const { expect } = chai;
chai.use(chaiHttp);

let userToken;
let postId;

before(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await chai.request(app)
    .post('/api/auth/register')
    .send({ username: 'commentuser', password: 'commentpassword', role: 'User' });

  const loginRes = await chai.request(app)
    .post('/api/auth/login')
    .send({ username: 'commentuser', password: 'commentpassword' });

  userToken = loginRes.body.accessToken;

  // Create a post for commenting
  const postRes = await chai.request(app)
    .post('/api/posts')
    .set('Authorization', `Bearer ${userToken}`)
    .send({ title: 'Post for Comment', content: 'This post will receive comments' });

  postId = postRes.body._id;
});

after(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  server.close();
});

describe('Comment CRUD Tests', () => {
  let commentId;

  it('should create a new comment on a post', async () => {
    const res = await chai.request(app)
      .post(`/api/comments`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ postId, content: 'This is a comment' });

    commentId = res.body._id;
    expect(res).to.have.status(201);
    expect(res.body).to.have.property('_id');
  });

  it('should read the created comment', async () => {
    const res = await chai.request(app)
      .get(`/api/comments/${commentId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('content', 'This is a comment');
  });

  it('should update the comment', async () => {
    const res = await chai.request(app)
      .put(`/api/comments/${commentId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ content: 'Updated comment content' });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('content', 'Updated comment content');
  });

  it('should delete the comment', async () => {
    const res = await chai.request(app)
      .delete(`/api/comments/${commentId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res).to.have.status(200);
    expect(res.text).to.equal('Comment deleted successfully');
  });
});

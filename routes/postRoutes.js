// routes/postRoutes.js

import express from 'express';
import Post from '../models/postModel.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { authorizeRoles, roles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Create a post
router.post('/', authenticateToken, authorizeRoles(roles.ADMIN, roles.MODERATOR, roles.USER), async (req, res) => {
  const { title, content } = req.body;
  const post = new Post({ title, content, author: req.user._id });
  await post.save();
  res.status(201).json(post);
});

// Get posts with pagination and search
router.get('/', authenticateToken, async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const posts = await Post.find({
    title: { $regex: search, $options: 'i' }
  })
  .skip((page - 1) * limit)
  .limit(Number(limit))
  .exec();
  res.json(posts);
});

// Get a single post
router.get('/:id', authenticateToken, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).send('Post not found');
  res.json(post);
});

// Update a post
router.put('/:id', authenticateToken, authorizeRoles(roles.ADMIN, roles.MODERATOR, roles.USER), async (req, res) => {
  const { title, content } = req.body;
  const post = await Post.findById(req.params.id);

  if (!post) return res.status(404).send('Post not found');
  if (post.author.toString() !== req.user._id && req.user.role !== roles.ADMIN) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  post.title = title || post.title;
  post.content = content || post.content;
  post.updatedAt = Date.now();

  await post.save();
  res.json(post);
});

// Delete a post
router.delete('/:id', authenticateToken, authorizeRoles(roles.ADMIN, roles.MODERATOR, roles.USER), async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).send('Post not found');

  if (post.author.toString() !== req.user._id && req.user.role !== roles.ADMIN) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  await Post.deleteOne({ _id: req.params.id });
  res.send('Post deleted successfully');
});

export default router;

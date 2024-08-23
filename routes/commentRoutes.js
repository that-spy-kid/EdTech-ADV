// routes/commentRoutes.js

import express from 'express';
import Comment from '../models/commentModel.js';
import Post from '../models/postModel.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { authorizeRoles, roles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Create a comment on a post
router.post('/:postId', authenticateToken, authorizeRoles(roles.ADMIN, roles.MODERATOR, roles.USER), async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;

  const post = await Post.findById(postId);
  if (!post) return res.status(404).send('Post not found');

  const comment = new Comment({ content, author: req.user._id, post: postId });
  await comment.save();

  const io = req.app.get('io');
  io.to(post.author.toString()).emit('newComment', {
    author: req.user.username,
    content: comment.content,
    timestamp: comment.createdAt
  });

  res.status(201).json(comment);
});

export default router;

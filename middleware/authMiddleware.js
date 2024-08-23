// middleware/authMiddleware.js

import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = await User.findById(user.id);
    next();
  });
};

export { authenticateToken };

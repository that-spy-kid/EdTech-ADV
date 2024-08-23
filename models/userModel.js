// models/userModel.js

import mongoose from 'mongoose';
import { roles } from '../middleware/roleMiddleware.js';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: [roles.ADMIN, roles.MODERATOR, roles.USER] }
});

const User = mongoose.model('User', userSchema);

export default User;

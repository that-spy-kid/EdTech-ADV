// middleware/roleMiddleware.js

const roles = {
  ADMIN: 'Admin',
  MODERATOR: 'Moderator',
  USER: 'User'
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};

export { authorizeRoles, roles };

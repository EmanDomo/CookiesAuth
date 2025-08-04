export function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  return res.status(401).json({ message: 'Unauthorized' });
}

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.session.user?.role;
    if (allowedRoles.includes(userRole)) {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden: Access Denied' });
    }
  };
};

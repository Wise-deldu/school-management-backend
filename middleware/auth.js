const jwt = require('jsonwebtoken');

// Middleware to authenticate the token
exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('Auth Header:', authHeader); // Debug log

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    console.log('Authenticated User:', user); // Debug log
    req.user = user; // Attach decoded token data to the request
    next();
  });
};

// Middleware to authorize admin-only access
exports.adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }
  next();
};

// Middleware to allow both staff and admin access (for viewing purposes)
exports.staffOrAdmin = (req, res, next) => {
  if (req.user.role !== 'staff' && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Staff or Admin only.' });
  }
  next();
};

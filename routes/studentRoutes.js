const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.post('/', authenticateToken, (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

router.get('/:id', authenticateToken, (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' })
});

module.exports = router;

import express from 'express';
import { getProfile, updateProfile, getAllUsers, getUserById } from '../controllers/userController.js';
import { getMatches } from '../controllers/matchController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Optional auth for getAllUsers so unauthenticated or authenticated calls both work
const optionalAuth = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  return next();
};

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/matches', protect, getMatches);
router.get('/', optionalAuth, getAllUsers);
router.get('/:id', getUserById);

export default router;

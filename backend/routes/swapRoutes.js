import express from 'express';
import {
  sendRequest,
  getSwaps,
  getIncomingSwaps,
  getSentSwaps,
  getActiveSwaps,
  getSwapById,
  acceptSwap,
  rejectSwap,
  completeSwap,
  cancelSwap,
} from '../controllers/swapController.js';
import { createReview } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', sendRequest);
router.post('/request', sendRequest);
router.get('/', getSwaps);
router.get('/incoming', getIncomingSwaps);
router.get('/sent', getSentSwaps);
router.get('/active', getActiveSwaps);
router.post('/review', createReview);

router.get('/:id', getSwapById);
router.put('/:id/accept', acceptSwap);
router.put('/:id/reject', rejectSwap);
router.put('/:id/complete', completeSwap);
router.put('/:id/cancel', cancelSwap);

export default router;

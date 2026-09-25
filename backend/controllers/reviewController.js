import Review from '../models/Review.js';
import SwapRequest from '../models/SwapRequest.js';
import User from '../models/User.js';

// @desc    Submit a review for a completed swap
// @route   POST /api/reviews or POST /api/swaps/review
export const createReview = async (req, res) => {
  try {
    const { swapId, swapRequestId, swap, rating, comment } = req.body;
    const targetSwapId = swapId || swapRequestId || swap;

    if (!targetSwapId || !rating) {
      return res.status(400).json({ success: false, message: 'Swap ID and rating are required' });
    }

    const swapObj = await SwapRequest.findById(targetSwapId);
    if (!swapObj) {
      return res.status(404).json({ success: false, message: 'Swap request not found' });
    }

    const currentUserIdStr = String(req.user._id);
    if (String(swapObj.sender) !== currentUserIdStr && String(swapObj.receiver) !== currentUserIdStr) {
      return res.status(403).json({ success: false, message: 'You are not a participant in this swap' });
    }

    // Automatically ensure swap status is completed
    if (swapObj.status !== 'completed') {
      swapObj.status = 'completed';
      await swapObj.save();
      await User.findByIdAndUpdate(swapObj.sender, { $inc: { completedSwaps: 1 } });
      await User.findByIdAndUpdate(swapObj.receiver, { $inc: { completedSwaps: 1 } });
    }

    // Determine reviewed user (the other participant)
    const reviewedUserId = String(swapObj.sender) === currentUserIdStr ? swapObj.receiver : swapObj.sender;

    // Check for existing duplicate review
    const existingReview = await Review.findOne({
      reviewer: req.user._id,
      swapRequest: targetSwapId,
    });

    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already submitted a review for this swap' });
    }

    const review = await Review.create({
      reviewer: req.user._id,
      reviewedUser: reviewedUserId,
      swapRequest: targetSwapId,
      rating: Number(rating),
      comment: comment || '',
    });

    // Recalculate average rating & review count for reviewed user
    const userReviews = await Review.find({ reviewedUser: reviewedUserId });
    const totalRating = userReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = Number((totalRating / userReviews.length).toFixed(1));

    await User.findByIdAndUpdate(reviewedUserId, {
      rating: avgRating,
      reviewCount: userReviews.length,
      reviewsCount: userReviews.length, // frontend field compatibility
    });

    const populatedReview = await Review.findById(review._id).populate(
      'reviewer',
      'name avatar college'
    );

    return res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review: populatedReview,
      data: populatedReview,
    });
  } catch (error) {
    console.error('Create review error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Get reviews for a user
// @route   GET /api/reviews/user/:userId
export const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewedUser: req.params.userId })
      .populate('reviewer', 'name avatar college')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      reviews,
      data: reviews,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

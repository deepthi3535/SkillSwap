import SwapRequest from '../models/SwapRequest.js';
import User from '../models/User.js';
import { calculateMatch } from '../utils/matchingAlgorithm.js';

// Helper to format swap request object for frontend compatibility
const formatSwap = (swap, currentUserId) => {
  const obj = swap.toObject ? swap.toObject() : { ...swap };
  const isSender = String(obj.sender._id || obj.sender) === String(currentUserId);
  const partner = isSender ? obj.receiver : obj.sender;

  const mySkill = isSender ? obj.offeredSkill : obj.requestedSkill;
  const theirSkill = isSender ? obj.requestedSkill : obj.offeredSkill;

  let frontendStatus = obj.status;
  if (obj.status === 'accepted') {
    frontendStatus = 'in-progress';
  }

  return {
    ...obj,
    _id: obj._id,
    fromUser: obj.sender,
    toUser: obj.receiver,
    partner,
    mySkill,
    theirSkill,
    matchPercentage: obj.matchScore || 85,
    status: frontendStatus,
    rawStatus: obj.status,
    startDate: obj.startDate || (obj.createdAt ? new Date(obj.createdAt).toISOString().split('T')[0] : '2026-09-20'),
  };
};

// @desc    Send a swap request
// @route   POST /api/swaps
export const sendRequest = async (req, res) => {
  try {
    const { receiverId, toUserId, receiver, offeredSkill, requestedSkill, message } = req.body;
    const targetUserId = receiverId || toUserId || receiver;

    if (!targetUserId || !offeredSkill || !requestedSkill) {
      return res.status(400).json({ success: false, message: 'Missing target user or skill details' });
    }

    if (String(targetUserId) === String(req.user._id)) {
      return res.status(400).json({ success: false, message: 'Cannot send a swap request to yourself' });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'Recipient user not found' });
    }

    const matchResult = calculateMatch(req.user, targetUser);

    const swapRequest = await SwapRequest.create({
      sender: req.user._id,
      receiver: targetUserId,
      offeredSkill,
      requestedSkill,
      matchScore: matchResult.matchScore,
      message: message || '',
      status: 'pending',
    });

    const populated = await SwapRequest.findById(swapRequest._id)
      .populate('sender', 'name email college avatar rating reviewsCount')
      .populate('receiver', 'name email college avatar rating reviewsCount');

    const formatted = formatSwap(populated, req.user._id);

    return res.status(201).json({
      success: true,
      message: 'Swap request sent successfully',
      swapRequest: formatted,
      data: formatted,
    });
  } catch (error) {
    console.error('Send swap request error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Get all swaps for current user (incoming, sent, active)
// @route   GET /api/swaps
export const getSwaps = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const allRequests = await SwapRequest.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }],
    })
      .populate('sender', 'name email college avatar rating reviewsCount location')
      .populate('receiver', 'name email college avatar rating reviewsCount location')
      .sort({ createdAt: -1 });

    const formatted = allRequests.map((s) => formatSwap(s, currentUserId));

    const incoming = formatted.filter((s) => String(s.receiver._id) === String(currentUserId));
    const sent = formatted.filter((s) => String(s.sender._id) === String(currentUserId));
    const active = formatted.filter(
      (s) => s.rawStatus === 'accepted' || s.rawStatus === 'completed'
    );

    return res.json({
      success: true,
      incoming,
      sent,
      active,
      data: { incoming, sent, active },
      swaps: formatted,
    });
  } catch (error) {
    console.error('Get swaps error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Get incoming swap requests
// @route   GET /api/swaps/incoming
export const getIncomingSwaps = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const requests = await SwapRequest.find({ receiver: currentUserId })
      .populate('sender', 'name email college avatar rating reviewsCount location')
      .populate('receiver', 'name email college avatar rating reviewsCount location')
      .sort({ createdAt: -1 });

    const formatted = requests.map((s) => formatSwap(s, currentUserId));
    return res.json({ success: true, requests: formatted, data: formatted });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get sent swap requests
// @route   GET /api/swaps/sent
export const getSentSwaps = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const requests = await SwapRequest.find({ sender: currentUserId })
      .populate('sender', 'name email college avatar rating reviewsCount location')
      .populate('receiver', 'name email college avatar rating reviewsCount location')
      .sort({ createdAt: -1 });

    const formatted = requests.map((s) => formatSwap(s, currentUserId));
    return res.json({ success: true, requests: formatted, data: formatted });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get active swaps
// @route   GET /api/swaps/active
export const getActiveSwaps = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const requests = await SwapRequest.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }],
      status: { $in: ['accepted', 'completed'] },
    })
      .populate('sender', 'name email college avatar rating reviewsCount location')
      .populate('receiver', 'name email college avatar rating reviewsCount location')
      .sort({ updatedAt: -1 });

    const formatted = requests.map((s) => formatSwap(s, currentUserId));
    return res.json({ success: true, swaps: formatted, data: formatted });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single swap request by ID
// @route   GET /api/swaps/:id
export const getSwapById = async (req, res) => {
  try {
    const swap = await SwapRequest.findById(req.params.id)
      .populate('sender', 'name email college avatar rating reviewsCount location')
      .populate('receiver', 'name email college avatar rating reviewsCount location');

    if (!swap) {
      return res.status(404).json({ success: false, message: 'Swap request not found' });
    }

    const formatted = formatSwap(swap, req.user._id);
    return res.json({ success: true, swap: formatted, data: formatted });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Accept a swap request
// @route   PUT /api/swaps/:id/accept
export const acceptSwap = async (req, res) => {
  try {
    const swap = await SwapRequest.findById(req.params.id);
    if (!swap) {
      return res.status(404).json({ success: false, message: 'Swap request not found' });
    }

    if (String(swap.receiver) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Only the receiver can accept this request' });
    }

    swap.status = 'accepted';
    await swap.save();

    const populated = await SwapRequest.findById(swap._id)
      .populate('sender', 'name email college avatar rating reviewsCount')
      .populate('receiver', 'name email college avatar rating reviewsCount');

    const formatted = formatSwap(populated, req.user._id);

    return res.json({
      success: true,
      message: 'Swap request accepted',
      swap: formatted,
      data: formatted,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reject a swap request
// @route   PUT /api/swaps/:id/reject
export const rejectSwap = async (req, res) => {
  try {
    const swap = await SwapRequest.findById(req.params.id);
    if (!swap) {
      return res.status(404).json({ success: false, message: 'Swap request not found' });
    }

    if (String(swap.receiver) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Only the receiver can reject this request' });
    }

    swap.status = 'rejected';
    await swap.save();

    const populated = await SwapRequest.findById(swap._id)
      .populate('sender', 'name email college avatar rating reviewsCount')
      .populate('receiver', 'name email college avatar rating reviewsCount');

    const formatted = formatSwap(populated, req.user._id);

    return res.json({
      success: true,
      message: 'Swap request rejected',
      swap: formatted,
      data: formatted,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Complete a swap
// @route   PUT /api/swaps/:id/complete
export const completeSwap = async (req, res) => {
  try {
    const swap = await SwapRequest.findById(req.params.id);
    if (!swap) {
      return res.status(404).json({ success: false, message: 'Swap request not found' });
    }

    const currentUserIdStr = String(req.user._id);
    if (String(swap.sender) !== currentUserIdStr && String(swap.receiver) !== currentUserIdStr) {
      return res.status(403).json({ success: false, message: 'Unauthorized to complete this swap' });
    }

    if (swap.status !== 'completed') {
      swap.status = 'completed';
      await swap.save();

      // Increment completedSwaps count for both participants
      await User.findByIdAndUpdate(swap.sender, { $inc: { completedSwaps: 1 } });
      await User.findByIdAndUpdate(swap.receiver, { $inc: { completedSwaps: 1 } });
    }

    const populated = await SwapRequest.findById(swap._id)
      .populate('sender', 'name email college avatar rating reviewsCount')
      .populate('receiver', 'name email college avatar rating reviewsCount');

    const formatted = formatSwap(populated, req.user._id);

    return res.json({
      success: true,
      message: 'Swap marked as completed',
      swap: formatted,
      data: formatted,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel a swap request
// @route   PUT /api/swaps/:id/cancel
export const cancelSwap = async (req, res) => {
  try {
    const swap = await SwapRequest.findById(req.params.id);
    if (!swap) {
      return res.status(404).json({ success: false, message: 'Swap request not found' });
    }

    const currentUserIdStr = String(req.user._id);
    if (String(swap.sender) !== currentUserIdStr && String(swap.receiver) !== currentUserIdStr) {
      return res.status(403).json({ success: false, message: 'Unauthorized to cancel this request' });
    }

    swap.status = 'cancelled';
    await swap.save();

    const populated = await SwapRequest.findById(swap._id)
      .populate('sender', 'name email college avatar rating reviewsCount')
      .populate('receiver', 'name email college avatar rating reviewsCount');

    const formatted = formatSwap(populated, req.user._id);

    return res.json({
      success: true,
      message: 'Swap request cancelled',
      swap: formatted,
      data: formatted,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

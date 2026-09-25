import User from '../models/User.js';

// @desc    Get logged in user profile
// @route   GET /api/users/profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.json({ success: true, user, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Update logged in user profile
// @route   PUT /api/users/profile
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const {
      name,
      college,
      location,
      avatar,
      bio,
      skillsTeach,
      skillsLearn,
      experience,
      availability,
      learningMode,
      category,
    } = req.body;

    if (name !== undefined) user.name = name;
    if (college !== undefined) user.college = college;
    if (location !== undefined) user.location = location;
    if (avatar !== undefined) user.avatar = avatar;
    if (bio !== undefined) user.bio = bio;
    if (skillsTeach !== undefined) user.skillsTeach = skillsTeach;
    if (skillsLearn !== undefined) user.skillsLearn = skillsLearn;
    if (experience !== undefined) user.experience = experience;
    if (availability !== undefined) user.availability = availability;
    if (learningMode !== undefined) user.learningMode = learningMode;
    if (category !== undefined) user.category = category;

    const updatedUser = await user.save();
    return res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
      data: updatedUser,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Get all users with filtering
// @route   GET /api/users
export const getAllUsers = async (req, res) => {
  try {
    const { search, category, experience, location, learningMode } = req.query;

    const query = {};

    // Exclude logged in user if authenticated
    if (req.user) {
      query._id = { $ne: req.user._id };
    }

    if (category) {
      query.category = category;
    }

    if (experience) {
      query.experience = experience;
    }

    if (learningMode) {
      query.learningMode = learningMode;
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    let users = await User.find(query);

    if (search) {
      const q = search.toLowerCase();
      users = users.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.skillsTeach.some((s) => s.toLowerCase().includes(q)) ||
          u.skillsLearn.some((s) => s.toLowerCase().includes(q)) ||
          (u.college && u.college.toLowerCase().includes(q))
      );
    }

    return res.json({
      success: true,
      users,
      data: users,
    });
  } catch (error) {
    console.error('Get users error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.json({
      success: true,
      user,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Invalid user ID or user not found' });
  }
};

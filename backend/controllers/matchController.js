import User from '../models/User.js';
import { calculateMatch } from '../utils/matchingAlgorithm.js';

// @desc    Get matched users for logged in user
// @route   GET /api/matches
export const getMatches = async (req, res) => {
  try {
    const currentUser = req.user;
    const { search, category, experience, location, learningMode } = req.query;

    const query = { _id: { $ne: currentUser._id } };

    if (category) query.category = category;
    if (experience) query.experience = experience;
    if (learningMode) query.learningMode = learningMode;
    if (location) query.location = { $regex: location, $options: 'i' };

    let candidateUsers = await User.find(query);

    if (search) {
      const q = search.toLowerCase();
      candidateUsers = candidateUsers.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.skillsTeach.some((s) => s.toLowerCase().includes(q)) ||
          u.skillsLearn.some((s) => s.toLowerCase().includes(q)) ||
          (u.college && u.college.toLowerCase().includes(q))
      );
    }

    const matches = candidateUsers.map((user) => {
      const matchDetails = calculateMatch(currentUser, user);
      return {
        ...user.toJSON(),
        _id: user._id,
        user,
        matchScore: matchDetails.matchScore,
        matchPercentage: matchDetails.matchPercentage,
        matchingSkills: matchDetails.matchingSkills,
        reasons: matchDetails.reasons,
      };
    });

    matches.sort((a, b) => b.matchScore - a.matchScore);

    return res.json({
      success: true,
      count: matches.length,
      matches,
      data: matches,
    });
  } catch (error) {
    console.error('Get matches error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

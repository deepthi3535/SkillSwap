export function calculateMatch(currentUser, targetUser) {
  if (!currentUser || !targetUser) {
    return {
      matchScore: 50,
      matchPercentage: 50,
      matchingSkills: [],
      reasons: [],
    };
  }

  const currentUserTeach = currentUser.skillsTeach || [];
  const currentUserLearn = currentUser.skillsLearn || [];
  const targetTeach = targetUser.skillsTeach || [];
  const targetLearn = targetUser.skillsLearn || [];

  // Skills they can teach current user
  const matchingTeach = targetTeach.filter((s) =>
    currentUserLearn.some((l) => l.toLowerCase() === s.toLowerCase())
  );

  // Skills current user can teach them
  const matchingLearn = targetLearn.filter((s) =>
    currentUserTeach.some((t) => t.toLowerCase() === s.toLowerCase())
  );

  const totalMatchingCount = matchingTeach.length + matchingLearn.length;
  
  // Base skill compatibility score up to 70 points
  let skillPoints = 0;
  if (totalMatchingCount > 0) {
    skillPoints = Math.min(70, Math.round(totalMatchingCount * 25));
  } else {
    skillPoints = 20; // baseline compatibility
  }

  let score = skillPoints;
  const reasons = [];

  if (matchingTeach.length > 0) {
    reasons.push(`They can teach you: ${matchingTeach.join(', ')}`);
  }
  if (matchingLearn.length > 0) {
    reasons.push(`You can teach them: ${matchingLearn.join(', ')}`);
  }

  // Bonus: Same college (+10)
  if (
    currentUser.college &&
    targetUser.college &&
    currentUser.college.toLowerCase().trim() === targetUser.college.toLowerCase().trim()
  ) {
    score += 10;
    reasons.push(`Both study at ${targetUser.college}`);
  }

  // Bonus: Same location (+5)
  if (
    currentUser.location &&
    targetUser.location &&
    currentUser.location.toLowerCase().trim() === targetUser.location.toLowerCase().trim()
  ) {
    score += 5;
    reasons.push(`Located in ${targetUser.location}`);
  }

  // Bonus: Same learning mode (+5)
  if (
    currentUser.learningMode &&
    targetUser.learningMode &&
    currentUser.learningMode.toLowerCase() === targetUser.learningMode.toLowerCase()
  ) {
    score += 5;
    reasons.push(`Prefers ${targetUser.learningMode} learning`);
  }

  // Bonus: Shared availability (+5)
  const currentAvailability = currentUser.availability || [];
  const targetAvailability = targetUser.availability || [];
  const sharedAvailability = currentAvailability.filter((slot) =>
    targetAvailability.includes(slot)
  );
  if (sharedAvailability.length > 0) {
    score += 5;
    reasons.push(`Available on ${sharedAvailability.join(', ')}`);
  }

  // Bonus: Similar experience (+5)
  if (
    currentUser.experience &&
    targetUser.experience &&
    currentUser.experience.toLowerCase() === targetUser.experience.toLowerCase()
  ) {
    score += 5;
  }

  const finalScore = Math.min(98, Math.max(45, Math.round(score)));

  return {
    matchScore: finalScore,
    matchPercentage: finalScore, // For frontend field compatibility
    matchingSkills: [...matchingTeach, ...matchingLearn],
    reasons: reasons.length > 0 ? reasons : ['Complementary learning interests'],
  };
}

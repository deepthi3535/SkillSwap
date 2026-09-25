import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = 'http://localhost:5000';

const runTests = async () => {
  console.log('====================================================');
  console.log('       SKILLSWAP BACKEND INTEGRATION TEST SUITE     ');
  console.log('====================================================\n');

  const testResults = [];
  const record = (name, passed, details = '', error = null) => {
    testResults.push({ name, passed, details, error: error ? (error.message || error) : null });
    const status = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} - ${name}`);
    if (details) console.log(`   Info: ${details}`);
    if (error) console.log(`   Error: ${error.message || error}`);
  };

  // 1. Direct Root and Health endpoint checks
  try {
    const resRoot = await fetch(`${BASE_URL}/`);
    const dataRoot = await resRoot.json();
    if (resRoot.status === 200 && dataRoot.success === true && dataRoot.message === 'SkillSwap API is running') {
      record('GET / (Root API endpoint)', true, JSON.stringify(dataRoot));
    } else {
      record('GET / (Root API endpoint)', false, `Status: ${resRoot.status}, Response: ${JSON.stringify(dataRoot)}`);
    }
  } catch (err) {
    record('GET / (Root API endpoint)', false, null, err);
  }

  try {
    const resHealth = await fetch(`${BASE_URL}/api/health`);
    const dataHealth = await resHealth.json();
    if (resHealth.status === 200 && dataHealth.success === true && dataHealth.message === 'SkillSwap API is running') {
      record('GET /api/health (Health check endpoint)', true, JSON.stringify(dataHealth));
    } else {
      record('GET /api/health (Health check endpoint)', false, `Status: ${resHealth.status}, Response: ${JSON.stringify(dataHealth)}`);
    }
  } catch (err) {
    record('GET /api/health (Health check endpoint)', false, null, err);
  }

  // 2. Direct MongoDB Atlas Connection Verification
  try {
    const uri = process.env.MONGO_URI;
    console.log('\n--- Checking MongoDB Atlas Database Connection ---');
    console.log(`URI target: ${uri ? uri.replace(/:([^@]+)@/, ':****@') : 'UNDEFINED'}`);
    
    // Connect to check Atlas directly
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    const isAtlas = mongoose.connection.host.includes('mongodb.net');
    record(
      'MongoDB Atlas Connection & Mongoose ReadyState',
      mongoose.connection.readyState === 1,
      `Connected to host: ${mongoose.connection.host} (isAtlas: ${isAtlas}), ReadyState: ${mongoose.connection.readyState}`
    );
    await mongoose.disconnect();
  } catch (err) {
    record('MongoDB Atlas Connection & Mongoose ReadyState', false, 'Direct connection error', err);
  }

  console.log('\n--- Running API Integration Tests against http://localhost:5000 ---');

  const timestamp = Date.now();
  const userAData = {
    name: `User Alpha ${timestamp}`,
    email: `alpha_${timestamp}@example.com`,
    password: 'password123',
    college: 'MIT College',
    location: 'Bangalore',
    skillsTeach: ['React', 'JavaScript'],
    skillsLearn: ['Python', 'Data Science'],
  };

  const userBData = {
    name: `User Beta ${timestamp}`,
    email: `beta_${timestamp}@example.com`,
    password: 'password123',
    college: 'Stanford Online',
    location: 'Hyderabad',
    skillsTeach: ['Python', 'Machine Learning'],
    skillsLearn: ['React', 'Web Dev'],
  };

  let tokenA = '';
  let userAId = '';
  let tokenB = '';
  let userBId = '';

  // 3. Register User A
  try {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userAData),
    });
    const data = await res.json();
    if (res.status === 201 && data.success && data.token) {
      tokenA = data.token;
      userAId = data.user._id || data.user.id;
      record('POST /api/auth/register (User A)', true, `Registered ID: ${userAId}, Token received`);
    } else {
      record('POST /api/auth/register (User A)', false, JSON.stringify(data));
    }
  } catch (err) {
    record('POST /api/auth/register (User A)', false, null, err);
  }

  // 4. Register User B
  try {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userBData),
    });
    const data = await res.json();
    if (res.status === 201 && data.success && data.token) {
      tokenB = data.token;
      userBId = data.user._id || data.user.id;
      record('POST /api/auth/register (User B)', true, `Registered ID: ${userBId}, Token received`);
    } else {
      record('POST /api/auth/register (User B)', false, JSON.stringify(data));
    }
  } catch (err) {
    record('POST /api/auth/register (User B)', false, null, err);
  }

  // 5. Login User A
  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userAData.email, password: userAData.password }),
    });
    const data = await res.json();
    if (res.status === 200 && data.success && data.token) {
      tokenA = data.token; // refresh token
      record('POST /api/auth/login', true, `Login successful for ${data.user.email}`);
    } else {
      record('POST /api/auth/login', false, JSON.stringify(data));
    }
  } catch (err) {
    record('POST /api/auth/login', false, null, err);
  }

  // 6. GET /api/auth/me with JWT
  try {
    const res = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const data = await res.json();
    if (res.status === 200 && data.success && data.user) {
      record('GET /api/auth/me (JWT Authentication)', true, `Authenticated as ${data.user.name}`);
    } else {
      record('GET /api/auth/me (JWT Authentication)', false, JSON.stringify(data));
    }
  } catch (err) {
    record('GET /api/auth/me (JWT Authentication)', false, null, err);
  }

  // 7. GET /api/users/profile with JWT
  try {
    const res = await fetch(`${BASE_URL}/api/users/profile`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const data = await res.json();
    if (res.status === 200 && data.success && data.user) {
      record('GET /api/users/profile (User Profile)', true, `Profile loaded: ${data.user.name}, ${data.user.email}`);
    } else {
      record('GET /api/users/profile (User Profile)', false, JSON.stringify(data));
    }
  } catch (err) {
    record('GET /api/users/profile (User Profile)', false, null, err);
  }

  // 8. PUT /api/users/profile with JWT (update bio & skills)
  try {
    const updatePayload = {
      bio: 'Enthusiastic full-stack learner & tutor',
      skillsTeach: ['React', 'JavaScript', 'Node.js'],
      skillsLearn: ['Python', 'Machine Learning'],
    };
    const res = await fetch(`${BASE_URL}/api/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify(updatePayload),
    });
    const data = await res.json();
    if (res.status === 200 && data.success && data.user.skillsTeach.includes('Node.js')) {
      record('PUT /api/users/profile', true, `Profile updated: skillsTeach=[${data.user.skillsTeach.join(', ')}]`);
    } else {
      record('PUT /api/users/profile', false, JSON.stringify(data));
    }
  } catch (err) {
    record('PUT /api/users/profile', false, null, err);
  }

  // Also update User B's skills so they match User A
  try {
    await fetch(`${BASE_URL}/api/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenB}`,
      },
      body: JSON.stringify({
        skillsTeach: ['Python', 'Machine Learning'],
        skillsLearn: ['React', 'JavaScript'],
      }),
    });
  } catch (err) {}

  // 9. GET /api/users
  try {
    const res = await fetch(`${BASE_URL}/api/users`);
    const data = await res.json();
    if (res.status === 200 && data.success && Array.isArray(data.users)) {
      record('GET /api/users (All Users)', true, `Found ${data.users.length} users`);
    } else {
      record('GET /api/users (All Users)', false, JSON.stringify(data));
    }
  } catch (err) {
    record('GET /api/users (All Users)', false, null, err);
  }

  // 10. GET /api/matches with JWT
  try {
    const res = await fetch(`${BASE_URL}/api/matches`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const data = await res.json();
    if (res.status === 200 && data.success && Array.isArray(data.matches)) {
      const matchFound = data.matches.find(m => String(m._id) === String(userBId));
      record('GET /api/matches (Skill Match Algorithm)', true, `Matches found: ${data.matches.length}, Matched with User B score: ${matchFound ? matchFound.matchScore : 'N/A'}`);
    } else {
      record('GET /api/matches (Skill Match Algorithm)', false, JSON.stringify(data));
    }
  } catch (err) {
    record('GET /api/matches (Skill Match Algorithm)', false, null, err);
  }

  // 11. Swap Request Workflow
  let swapId = '';

  // 11a. POST /api/swaps (Create Swap Request)
  try {
    const res = await fetch(`${BASE_URL}/api/swaps`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        receiverId: userBId,
        offeredSkill: 'React',
        requestedSkill: 'Python',
        message: 'Hey User B, let us trade React lessons for Python sessions!',
      }),
    });
    const data = await res.json();
    if (res.status === 201 && data.success && (data.swapRequest?._id || data.data?._id)) {
      swapId = data.swapRequest?._id || data.data?._id;
      record('POST /api/swaps (Create Swap Request)', true, `Created Swap ID: ${swapId}, Status: pending`);
    } else {
      record('POST /api/swaps (Create Swap Request)', false, JSON.stringify(data));
    }
  } catch (err) {
    record('POST /api/swaps (Create Swap Request)', false, null, err);
  }

  // 11b. GET /api/swaps
  try {
    const res = await fetch(`${BASE_URL}/api/swaps`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const data = await res.json();
    if (res.status === 200 && data.success) {
      record('GET /api/swaps (List All Swaps for user)', true, `Incoming: ${data.incoming?.length || 0}, Sent: ${data.sent?.length || 0}`);
    } else {
      record('GET /api/swaps (List All Swaps for user)', false, JSON.stringify(data));
    }
  } catch (err) {
    record('GET /api/swaps (List All Swaps for user)', false, null, err);
  }

  // 11c. GET /api/swaps/incoming (User B)
  try {
    const res = await fetch(`${BASE_URL}/api/swaps/incoming`, {
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    const data = await res.json();
    if (res.status === 200 && data.success && Array.isArray(data.requests)) {
      record('GET /api/swaps/incoming (Receiver User B)', true, `Found ${data.requests.length} incoming requests`);
    } else {
      record('GET /api/swaps/incoming (Receiver User B)', false, JSON.stringify(data));
    }
  } catch (err) {
    record('GET /api/swaps/incoming (Receiver User B)', false, null, err);
  }

  // 11d. GET /api/swaps/sent (User A)
  try {
    const res = await fetch(`${BASE_URL}/api/swaps/sent`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const data = await res.json();
    if (res.status === 200 && data.success && Array.isArray(data.requests)) {
      record('GET /api/swaps/sent (Sender User A)', true, `Found ${data.requests.length} sent requests`);
    } else {
      record('GET /api/swaps/sent (Sender User A)', false, JSON.stringify(data));
    }
  } catch (err) {
    record('GET /api/swaps/sent (Sender User A)', false, null, err);
  }

  // 11e. PUT /api/swaps/:id/accept (User B accepts)
  try {
    const res = await fetch(`${BASE_URL}/api/swaps/${swapId}/accept`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    const data = await res.json();
    if (res.status === 200 && data.success) {
      record('PUT /api/swaps/:id/accept (Accept Swap)', true, `Status changed to accepted/in-progress`);
    } else {
      record('PUT /api/swaps/:id/accept (Accept Swap)', false, JSON.stringify(data));
    }
  } catch (err) {
    record('PUT /api/swaps/:id/accept (Accept Swap)', false, null, err);
  }

  // 11f. GET /api/swaps/active
  try {
    const res = await fetch(`${BASE_URL}/api/swaps/active`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const data = await res.json();
    if (res.status === 200 && data.success && Array.isArray(data.swaps)) {
      record('GET /api/swaps/active (Active Swaps)', true, `Found ${data.swaps.length} active swaps`);
    } else {
      record('GET /api/swaps/active (Active Swaps)', false, JSON.stringify(data));
    }
  } catch (err) {
    record('GET /api/swaps/active (Active Swaps)', false, null, err);
  }

  // 11g. PUT /api/swaps/:id/complete (User A marks completed)
  try {
    const res = await fetch(`${BASE_URL}/api/swaps/${swapId}/complete`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const data = await res.json();
    if (res.status === 200 && data.success) {
      record('PUT /api/swaps/:id/complete (Complete Swap)', true, `Swap marked as completed`);
    } else {
      record('PUT /api/swaps/:id/complete (Complete Swap)', false, JSON.stringify(data));
    }
  } catch (err) {
    record('PUT /api/swaps/:id/complete (Complete Swap)', false, null, err);
  }

  // 12. Review APIs
  // 12a. POST /api/reviews (User A reviews User B)
  try {
    const res = await fetch(`${BASE_URL}/api/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        swapId: swapId,
        rating: 5,
        comment: 'Fantastic teacher! Explained Python concepts very clearly.',
      }),
    });
    const data = await res.json();
    if (res.status === 201 && data.success && data.review) {
      record('POST /api/reviews (Submit Review)', true, `Created review ID: ${data.review._id}, rating: ${data.review.rating}`);
    } else {
      record('POST /api/reviews (Submit Review)', false, JSON.stringify(data));
    }
  } catch (err) {
    record('POST /api/reviews (Submit Review)', false, null, err);
  }

  // 12b. GET /api/reviews/user/:userId
  try {
    const res = await fetch(`${BASE_URL}/api/reviews/user/${userBId}`);
    const data = await res.json();
    if (res.status === 200 && data.success && Array.isArray(data.reviews)) {
      record('GET /api/reviews/user/:userId (Get User Reviews)', true, `User B has ${data.reviews.length} reviews`);
    } else {
      record('GET /api/reviews/user/:userId (Get User Reviews)', false, JSON.stringify(data));
    }
  } catch (err) {
    record('GET /api/reviews/user/:userId (Get User Reviews)', false, null, err);
  }

  console.log('\n====================================================');
  console.log('                   SUMMARY RESULTS                  ');
  console.log('====================================================');
  const total = testResults.length;
  const passed = testResults.filter(t => t.passed).length;
  const failed = testResults.filter(t => !t.passed).length;
  console.log(`TOTAL: ${total} | PASSED: ${passed} | FAILED: ${failed}`);
  
  if (failed === 0) {
    console.log('\n🎉 ALL BACKEND ENDPOINTS AND INTEGRATIONS PASSED!');
  } else {
    console.log('\n⚠️ Some endpoints failed:');
    testResults.filter(t => !t.passed).forEach(t => {
      console.log(`- ${t.name}: ${t.error || t.details}`);
    });
  }

  process.exit(failed === 0 ? 0 : 1);
};

runTests();

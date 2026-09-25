import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const API_BASE = 'http://localhost:5000/api';
const FRONTEND_BASE = 'http://localhost:3000';

async function verifyEndToEnd() {
  console.log('======================================================');
  console.log('      SKILLSWAP FRONTEND-BACKEND E2E VERIFICATION     ');
  console.log('======================================================\n');

  // Step 1: Verify Frontend Dev Server is up
  console.log('[1/7] Testing Frontend Dev Server...');
  const feRes = await fetch(FRONTEND_BASE);
  if (feRes.status === 200) {
    console.log('  ✅ Frontend is serving at http://localhost:3000 (HTTP 200)');
  } else {
    throw new Error(`Frontend failed with status: ${feRes.status}`);
  }

  // Step 2: Register New User via Frontend API payload structure
  const timestamp = Date.now();
  const testUserData = {
    fullName: `Alex Rivera ${timestamp}`,
    name: `Alex Rivera ${timestamp}`,
    email: `alex_${timestamp}@campus.edu`,
    password: 'password123',
    college: 'BITS Pilani',
    location: 'Hyderabad, India',
    skillsTeach: ['React', 'TypeScript', 'Node.js'],
    skillsLearn: ['Python', 'Django'],
    experience: 'Intermediate',
    learningMode: 'Online',
  };

  console.log('\n[2/7] Testing Register Flow (POST /api/auth/register)...');
  const regRes = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testUserData),
  });
  const regData = await regRes.json();
  if (regRes.status !== 201 || !regData.token || !regData.user) {
    throw new Error(`Registration failed: ${JSON.stringify(regData)}`);
  }
  const token = regData.token;
  const createdUserId = regData.user._id || regData.user.id;
  console.log(`  ✅ User registered successfully. ID: ${createdUserId}`);
  console.log(`  ✅ JWT token received: ${token.substring(0, 24)}...`);

  // Step 3: Confirm User Created directly in MongoDB Atlas
  console.log('\n[3/7] Verifying User creation in MongoDB Atlas...');
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
  const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
  const dbUser = await User.findById(createdUserId);
  if (dbUser && dbUser.email === testUserData.email.toLowerCase()) {
    console.log(`  ✅ MongoDB Atlas verified user persistence: ${dbUser.name} (${dbUser.email})`);
  } else {
    throw new Error('User not found in MongoDB Atlas');
  }
  await mongoose.disconnect();

  // Step 4: Login with credentials (POST /api/auth/login)
  console.log('\n[4/7] Testing Login Flow (POST /api/auth/login)...');
  const loginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testUserData.email,
      password: testUserData.password,
    }),
  });
  const loginData = await loginRes.json();
  if (loginRes.status !== 200 || !loginData.token) {
    throw new Error(`Login failed: ${JSON.stringify(loginData)}`);
  }
  console.log(`  ✅ Login successful. Fresh JWT token: ${loginData.token.substring(0, 24)}...`);

  // Step 5: Dashboard profile fetch with JWT (GET /api/auth/me and GET /api/users/profile)
  console.log('\n[5/7] Testing Dashboard User Profile Retrieval with JWT...');
  const meRes = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${loginData.token}` },
  });
  const meData = await meRes.json();
  if (meRes.status !== 200 || !meData.user) {
    throw new Error(`GET /api/auth/me failed: ${JSON.stringify(meData)}`);
  }
  console.log(`  ✅ GET /api/auth/me verified: ${meData.user.name}`);

  const profileRes = await fetch(`${API_BASE}/users/profile`, {
    headers: { Authorization: `Bearer ${loginData.token}` },
  });
  const profileData = await profileRes.json();
  if (profileRes.status !== 200 || !profileData.user) {
    throw new Error(`GET /api/users/profile failed: ${JSON.stringify(profileData)}`);
  }
  console.log(`  ✅ GET /api/users/profile verified: ${profileData.user.college}, ${profileData.user.location}`);

  // Step 6: Explore & Matches for Dashboard (GET /api/matches)
  console.log('\n[6/7] Testing Matches and Explore APIs with JWT...');
  const matchesRes = await fetch(`${API_BASE}/matches`, {
    headers: { Authorization: `Bearer ${loginData.token}` },
  });
  const matchesData = await matchesRes.json();
  if (matchesRes.status !== 200 || !Array.isArray(matchesData.matches)) {
    throw new Error(`GET /api/matches failed: ${JSON.stringify(matchesData)}`);
  }
  console.log(`  ✅ GET /api/matches verified: ${matchesData.matches.length} compatible candidates found`);

  const usersRes = await fetch(`${API_BASE}/users`);
  const usersData = await usersRes.json();
  if (usersRes.status !== 200 || !Array.isArray(usersData.users)) {
    throw new Error(`GET /api/users failed: ${JSON.stringify(usersData)}`);
  }
  console.log(`  ✅ GET /api/users verified: ${usersData.users.length} total users in community`);

  // Step 7: Swaps and Requests for Dashboard Stats
  console.log('\n[7/7] Testing Swaps & Stats Retrieval with JWT...');
  const swapsRes = await fetch(`${API_BASE}/swaps`, {
    headers: { Authorization: `Bearer ${loginData.token}` },
  });
  const swapsData = await swapsRes.json();
  if (swapsRes.status !== 200 || !swapsData.success) {
    throw new Error(`GET /api/swaps failed: ${JSON.stringify(swapsData)}`);
  }
  console.log(`  ✅ GET /api/swaps verified: Incoming=${swapsData.incoming?.length || 0}, Sent=${swapsData.sent?.length || 0}, Active=${swapsData.active?.length || 0}`);

  console.log('\n======================================================');
  console.log(' 🎉 COMPLETE FRONTEND-BACKEND E2E TEST PASSED!        ');
  console.log('======================================================');
}

verifyEndToEnd().catch(err => {
  console.error('\n❌ E2E Verification failed:', err);
  process.exit(1);
});

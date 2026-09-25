# SkillSwap – Peer-to-Peer Skill Exchange Platform

SkillSwap is a full-stack, peer-to-peer collaborative learning and skill exchange platform designed to connect students and learners who want to trade knowledge and abilities without monetary transactions. One student teaches what they excel at, and in return learns a skill from another peer.

---

## 1. Project Overview

In traditional educational models, finding peers with complementary skills is difficult and informal. **SkillSwap** bridges this gap by providing an intelligent matchmaking, request management, and peer review ecosystem. Users define the skills they can teach and the skills they wish to learn; the platform computes bidirectional compatibility, enables direct swap requests, tracks swap statuses, and collects ratings and reviews to maintain trust.

---

## 2. Features

- **Personalized Onboarding & Profile**: Define academic institution, location, experience levels, learning modes, availability, bio, skills you teach, and skills you want to learn.
- **Bi-Directional Skill Matching Algorithm**: Computes match percentage and compatibility scores by calculating overlaps between what one user teaches and what the other wishes to learn.
- **Interactive Explore & Discovery Directory**: Search by name, college, or skill; filter by category, experience level, and learning mode.
- **End-to-End Swap Request Workflow**: Send swap requests with custom messages, specify offered and requested skills, and track statuses: `pending`, `accepted`, `in-progress`, `completed`, `rejected`, and `cancelled`.
- **Active Swaps Dashboard**: Real-time tracker for ongoing skill exchanges with partner profiles and quick action triggers.
- **Trust & Reputation System**: Peer review system where users submit star ratings and detailed feedback upon swap completion, dynamically recalculating the partner's overall score.
- **Secure Authentication**: Password encryption via bcrypt, JSON Web Token (JWT) session authorization, and protected API routes.

---

## 3. Technology Stack

### Frontend
- **React.js 18** (Modern functional components & hooks)
- **Tailwind CSS** (Utility-first styling, glassmorphism, animations)
- **Axios** (Promise-based HTTP client with request/response interceptors)
- **React Router v7** (Declarative client-side routing)
- **Vite** (Next-generation frontend tooling and bundler)

### Backend
- **Node.js** (JavaScript runtime)
- **Express.js** (REST API framework)
- **MongoDB Atlas** (Cloud-hosted NoSQL database)
- **Mongoose** (Object Data Modeling schema library)
- **JSON Web Token (JWT)** (Stateless authorization tokens)
- **bcryptjs** (Cryptographic password hashing)
- **CORS** (Cross-Origin Resource Sharing middleware)

---

## 4. System Architecture

```
┌────────────────────────────────────────────────────────┐
│                  React 18 Frontend                     │
│  (Tailwind CSS • React Router • Axios • Port 3000)     │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP / REST APIs (JSON)
                            │ Bearer <JWT>
┌───────────────────────────▼────────────────────────────┐
│                  Express.js Backend                    │
│   Auth Middleware • Matching Engine • Port 5000        │
└───────────────────────────┬────────────────────────────┘
                            │ Mongoose Driver (TLS/SSL)
┌───────────────────────────▼────────────────────────────┐
│                  MongoDB Atlas Cloud                   │
│   Users • SwapRequests • Reviews Collections           │
└────────────────────────────────────────────────────────┘
```

---

## 5. Frontend

The frontend is structured into modular components, responsive layouts, and isolated page views:
- **Client Routing**: Configured via React Router (`/`, `/login`, `/register`, `/dashboard`, `/profile`, `/explore`, `/users/:id`, `/requests`, `/swaps`, `/active-swaps`).
- **Axios Client**: Centralized in `src/services/api.js` targeting `http://localhost:5000/api`. An interceptor injects the `Authorization: Bearer <JWT>` token stored in `localStorage` into protected requests, while response interceptors handle 401 expiration cleanly.
- **Design & UI**: Tailwind CSS with custom color gradients, glassmorphism card surfaces, and responsive grids for mobile, tablet, and desktop viewports.

---

## 6. Backend

The backend is built as an Express.js modular REST API:
- `server.js`: Express app initialization, CORS origin configuration, error handling, database connection, and route registration.
- `routes/`: Modular route handlers for authentication, users, matches, swaps, and reviews.
- `controllers/`: Business logic for user management, matching calculations, swap state machines, and review aggregates.
- `middleware/`: JWT verification middleware (`protect`) that populates `req.user` for authenticated endpoints.

---

## 7. MongoDB Atlas

SkillSwap connects to a cloud-hosted MongoDB Atlas cluster. Data persistence utilizes three core collections:
- **`User`**: Profiles, credentials, skills taught, skills wanted, ratings, review counts, and swap statistics.
- **`SwapRequest`**: Sender and receiver references, offered and requested skills, match score, message, and swap lifecycle state.
- **`Review`**: Reviewer and reviewed user references, swap link, numerical rating (1-5), and qualitative comments.

A resilient fallback mechanism is integrated to support local development if network connectivity to the cloud cluster is interrupted.

---

## 8. Authentication

- **Registration**: User passwords undergo salted hashing using `bcryptjs` (cost factor 10) before storage in MongoDB.
- **Login**: Compares password hash against incoming credentials and issues a signed JWT token containing the user's MongoDB ObjectId with a 30-day validity window.
- **Authorization**: Protected routes require an `Authorization: Bearer <JWT>` header, verified against the application `JWT_SECRET`.

---

## 9. Skill Matching Algorithm

The matching engine calculates compatibility between two users based on complementary skill exchanges:
1. **Overlap Calculation**: Checks if User A's taught skills match User B's desired skills, and vice versa.
2. **Mutual Benefit Scoring**: High scores are awarded when skills align in both directions (a true trade).
3. **Normalized Scoring**: Matches are ranked on a 0-100% scale and sorted descending so learners see their most relevant matches first.

---

## 10. Swap Request Workflow

```
[User A sends Request] ──► Status: "pending"
                                │
               ┌────────────────┴────────────────┐
               ▼                                 ▼
      [User B Accepts]                  [User B Rejects]
               │                                 │
     Status: "accepted"                  Status: "rejected"
     ("in-progress")
               │
      [Either Participant Completes]
               │
      Status: "completed"
               │
    [Submit Peer Review & Rating]
```

---

## 11. Reviews and Ratings

When a swap reaches `completed` status:
1. Either participant can submit a star rating (1 to 5) and feedback comment.
2. The backend records the review and triggers an atomic recalculation of the reviewed user's average rating and total review count.
3. Updated metrics are persisted to the user document and immediately reflected across cards and profile pages.

---

## 12. Project Structure

```
SkillSwap/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB Atlas connection & configuration
│   ├── controllers/
│   │   ├── authController.js     # User registration, login & profile
│   │   ├── userController.js     # User directory, profile updates
│   │   ├── matchController.js    # Matching algorithm execution
│   │   ├── swapController.js     # Swap request lifecycle management
│   │   └── reviewController.js   # Review submissions & rating updates
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT Bearer token authentication
│   ├── models/
│   │   ├── User.js               # Mongoose schema for User
│   │   ├── SwapRequest.js        # Mongoose schema for SwapRequest
│   │   └── Review.js             # Mongoose schema for Review
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── matchRoutes.js
│   │   ├── swapRoutes.js
│   │   └── reviewRoutes.js
│   ├── seed/
│   │   └── seedData.js           # Sample users and mock skill records
│   ├── utils/
│   │   └── matchingAlgorithm.js  # Skill compatibility calculator
│   ├── .env.example
│   ├── package.json
│   └── server.js                 # Main Express server entry point
├── public/                       # Static public assets
├── src/
│   ├── assets/                   # Images and styles
│   ├── components/
│   │   ├── layout/               # Navbar, DashboardNavbar, Footer
│   │   ├── ui/                   # Button, Card, Modal, SkillBadge, StatCard, StarRating
│   │   ├── Layout.jsx
│   │   └── MatchCard.jsx
│   ├── data/
│   │   └── mockData.js           # Development fallback definitions
│   ├── pages/
│   │   ├── LandingPage.jsx       # Public landing page
│   │   ├── LoginPage.jsx         # User login form
│   │   ├── RegisterPage.jsx      # User registration form
│   │   ├── DashboardPage.jsx     # Main student dashboard
│   │   ├── ExplorePage.jsx       # Discover and filter peer learners
│   │   ├── ProfilePage.jsx       # View and edit personal profile
│   │   ├── UserProfilePage.jsx   # Public profile view for other peers
│   │   ├── RequestsPage.jsx      # Manage incoming & sent swap requests
│   │   └── ActiveSwapsPage.jsx   # Manage ongoing swaps and reviews
│   ├── services/
│   │   └── api.js                # Axios instance and API call services
│   ├── App.jsx                   # React Router routing setup
│   ├── index.css                 # Tailwind design tokens and custom styles
│   └── main.jsx                  # React application entry point
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 13. Installation

Clone the repository and install dependencies for both the frontend and backend:

### 1. Root & Frontend Dependencies
```bash
npm install
```

### 2. Backend Dependencies
```bash
cd backend
npm install
cd ..
```

---

## 14. Environment Variables

### Backend (`backend/.env`)
Create a `.env` file inside the `backend/` directory using `backend/.env.example`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/skillswap?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```
In Render production, set `FRONTEND_URL` to your Vercel deployment URL (e.g. `https://skillswap.vercel.app`).

### Frontend (`.env`)
Create a `.env` file in the root directory using `.env.example`:

```env
# Local development
VITE_API_URL=http://localhost:5000/api

# Production (Vercel)
# VITE_API_URL=https://your-backend-name.onrender.com/api
```

*(Note: Sensitive keys and `.env` files are ignored by `.gitignore` and must never be committed.)*

---

## 15. Running the Project

Run both backend and frontend servers:

### Terminal 1: Backend Server (Port 5000)
```bash
cd backend
npm run dev
```
Backend API will be accessible at: `http://localhost:5000`

### Terminal 2: Frontend App (Port 3000)
```bash
npm run dev
```
Frontend Web Application will be accessible at: `http://localhost:3000`

---

## 16. API Overview

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/` | Root API health status | No |
| `GET` | `/api/health` | Service health status | No |
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Login and receive JWT | No |
| `GET` | `/api/auth/me` | Fetch authenticated profile | **Yes** |
| `GET` | `/api/users` | List all users (with search/filters) | Optional |
| `GET` | `/api/users/:id` | Get user details by ID | No |
| `GET` | `/api/users/profile` | Get current user's profile | **Yes** |
| `PUT` | `/api/users/profile` | Update current user's profile | **Yes** |
| `GET` | `/api/matches` | Get algorithmic matches for user | **Yes** |
| `POST` | `/api/swaps` | Create a new swap request | **Yes** |
| `GET` | `/api/swaps` | Get all swaps for user | **Yes** |
| `GET` | `/api/swaps/incoming` | Get incoming swap requests | **Yes** |
| `GET` | `/api/swaps/sent` | Get sent swap requests | **Yes** |
| `GET` | `/api/swaps/active` | Get active swaps | **Yes** |
| `PUT` | `/api/swaps/:id/accept` | Accept an incoming swap request | **Yes** |
| `PUT` | `/api/swaps/:id/reject` | Reject an incoming swap request | **Yes** |
| `PUT` | `/api/swaps/:id/complete`| Mark an active swap as completed | **Yes** |
| `POST` | `/api/reviews` | Submit peer review for completed swap | **Yes** |
| `GET` | `/api/reviews/user/:userId` | Get public reviews for a user | No |

---

## 17. Testing

### Run Backend Integration Test Suite
```bash
cd backend
node test-integration.js
```
Runs a 20-point test suite covering MongoDB Atlas, auth, profiles, algorithm matches, swaps, and reviews.

### Run Production Build Verification
```bash
npm run build
```
Compiles and bundles the production-ready frontend via Vite.

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import ExplorePage from './pages/ExplorePage';
import UserProfilePage from './pages/UserProfilePage';
import RequestsPage from './pages/RequestsPage';
import ActiveSwapsPage from './pages/ActiveSwapsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/users/:id" element={<UserProfilePage />} />
        <Route path="/requests" element={<RequestsPage />} />
        <Route path="/swaps" element={<ActiveSwapsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

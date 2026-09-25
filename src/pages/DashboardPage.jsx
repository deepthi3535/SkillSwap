import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import StatCard from '../components/ui/StatCard';
import MatchCard from '../components/MatchCard';
import Button from '../components/ui/Button';
import { currentUser as defaultUser, mockUsers } from '../data/mockData';
import { userAPI, swapAPI } from '../services/api';

const quickActions = [
  { to: '/explore', icon: '🔍', title: 'Find New Matches', desc: 'Explore users to swap skills with', gradient: 'from-primary-500 to-accent-500' },
  { to: '/requests', icon: '📬', title: 'Review Requests', desc: 'Manage pending swap requests', gradient: 'from-orange-500 to-amber-500' },
  { to: '/profile', icon: '👤', title: 'Edit Your Profile', desc: 'Update skills and availability', gradient: 'from-accent-500 to-cyan-500' },
];

export default function DashboardPage() {
  const [user, setUser] = useState(defaultUser);
  const [matches, setMatches] = useState([]);
  const [stats, setStats] = useState({
    pendingRequests: 3,
    activeSwaps: 2,
    totalMatches: 8,
  });

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      try {
        const profileRes = await userAPI.getProfile();
        if (isMounted && profileRes.data?.user) {
          setUser(profileRes.data.user);
        }
      } catch (err) {
        console.warn('Backend server not connected or offline, using current session');
      }

      try {
        const matchesRes = await userAPI.getMatches();
        if (isMounted && (matchesRes.data?.matches || matchesRes.data?.data)) {
          const list = matchesRes.data.matches || matchesRes.data.data;
          setMatches(list);
          setStats((prev) => ({ ...prev, totalMatches: list.length }));
        } else {
          setMatches(mockUsers.map((u, i) => ({ ...u, matchPercentage: [92, 85, 88, 78][i] || 80 })));
        }
      } catch (err) {
        setMatches(mockUsers.map((u, i) => ({ ...u, matchPercentage: [92, 85, 88, 78][i] || 80 })));
      }

      try {
        const swapsRes = await swapAPI.getSwaps();
        if (isMounted && swapsRes.data) {
          const incoming = swapsRes.data.incoming || [];
          const active = swapsRes.data.active || [];
          setStats((prev) => ({
            ...prev,
            pendingRequests: incoming.filter((r) => r.status === 'pending').length,
            activeSwaps: active.filter((s) => s.status === 'in-progress' || s.rawStatus === 'accepted').length,
          }));
        }
      } catch (err) {
        // Fallback
      }
    }

    loadDashboardData();
    return () => { isMounted = false; };
  }, []);

  const displayMatches = matches.length > 0 ? matches.slice(0, 4) : mockUsers.slice(0, 4).map((u, i) => ({ ...u, matchPercentage: [92, 85, 88, 78][i] }));

  return (
    <Layout dashboard>
      <div className="section-padding py-8">
        {/* Welcome banner with gradient */}
        <div className="mb-8 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-100/60 text-primary-700 rounded-full text-sm font-semibold mb-3">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-glow-pulse"></span>
            Active Now
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
            Welcome back, {user.name ? user.name.split(' ')[0] : 'Student'}! <span className="inline-block animate-wiggle">👋</span>
          </h1>
          <p className="text-gray-600">Here's what's happening with your skill swaps today.</p>
        </div>

        {/* Stats with staggered animation */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          {[
            { icon: '🌱', label: 'Skills I Teach', value: user.skillsTeach ? user.skillsTeach.length : 0, color: 'green', i: 1 },
            { icon: '🎯', label: 'Skills I Want', value: user.skillsLearn ? user.skillsLearn.length : 0, color: 'primary', i: 2 },
            { icon: '🤝', label: 'Potential Matches', value: stats.totalMatches, color: 'accent', i: 3 },
            { icon: '⏳', label: 'Pending Requests', value: stats.pendingRequests, color: 'orange', i: 4 },
            { icon: '🚀', label: 'Active Swaps', value: stats.activeSwaps, color: 'purple', i: 5 },
          ].map((stat) => (
            <div key={stat.label} className={`animate-slide-up stagger-${stat.i}`}>
              <StatCard icon={stat.icon} label={stat.label} value={stat.value} color={stat.color} />
            </div>
          ))}
        </div>

        {/* Recommended matches */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Recommended Matches</h2>
            <p className="text-gray-600 text-sm mt-1">Users with complementary skills to yours</p>
          </div>
          <Button to="/explore" variant="ghost" size="sm" className="group">
            View All <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {displayMatches.map((matchedUser, idx) => (
            <div key={matchedUser._id || idx} className={`animate-slide-up stagger-${idx + 1}`}>
              <MatchCard user={matchedUser} matchPercentage={matchedUser.matchPercentage || matchedUser.matchScore || 85} />
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, idx) => (
            <div key={action.to} className={`animate-slide-up stagger-${idx + 1}`}>
              <Link to={action.to} className="card card-hover group block">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 ease-spring`}>
                    {action.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 group-hover:text-primary-600 transition-colors">{action.title}</h3>
                    <p className="text-sm text-gray-500">{action.desc}</p>
                  </div>
                  <span className="ml-auto text-gray-300 group-hover:text-primary-400 group-hover:translate-x-1 transition-all duration-300">→</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import StatCard from '../components/ui/StatCard';
import MatchCard from '../components/MatchCard';
import Button from '../components/ui/Button';
import { currentUser, mockUsers } from '../data/mockData';

const matchPercentages = [92, 85, 88, 78];

export default function DashboardPage() {
  return (
    <Layout dashboard>
      <div className="section-padding py-8">
        {/* Welcome */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {currentUser.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600">Here's what's happening with your skill swaps today.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          <StatCard icon="🌱" label="Skills I Teach" value={currentUser.skillsTeach.length} color="green" />
          <StatCard icon="🎯" label="Skills I Want" value={currentUser.skillsLearn.length} color="primary" />
          <StatCard icon="🤝" label="Potential Matches" value={mockUsers.length} color="accent" />
          <StatCard icon="⏳" label="Pending Requests" value={3} color="orange" />
          <StatCard icon="🚀" label="Active Swaps" value={2} color="purple" />
        </div>

        {/* Recommended matches */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Recommended Matches</h2>
            <p className="text-gray-600 text-sm mt-1">Users with complementary skills to yours</p>
          </div>
          <Button to="/explore" variant="ghost" size="sm">
            View All →
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {mockUsers.slice(0, 4).map((user, idx) => (
            <MatchCard
              key={user._id}
              user={user}
              matchPercentage={matchPercentages[idx]}
            />
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/explore" className="card card-hover group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-2xl group-hover:bg-primary-100 transition-colors">🔍</div>
              <div>
                <h3 className="font-bold text-gray-800">Find New Matches</h3>
                <p className="text-sm text-gray-500">Explore users to swap skills with</p>
              </div>
            </div>
          </Link>
          <Link to="/requests" className="card card-hover group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-2xl group-hover:bg-orange-100 transition-colors">📬</div>
              <div>
                <h3 className="font-bold text-gray-800">Review Requests</h3>
                <p className="text-sm text-gray-500">3 pending swap requests</p>
              </div>
            </div>
          </Link>
          <Link to="/profile" className="card card-hover group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent-50 flex items-center justify-center text-2xl group-hover:bg-accent-100 transition-colors">👤</div>
              <div>
                <h3 className="font-bold text-gray-800">Edit Your Profile</h3>
                <p className="text-sm text-gray-500">Update skills and availability</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </Layout>
  );
}

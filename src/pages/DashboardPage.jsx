import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import StatCard from '../components/ui/StatCard';
import MatchCard from '../components/MatchCard';
import Button from '../components/ui/Button';
import { currentUser, mockUsers } from '../data/mockData';

const matchPercentages = [92, 85, 88, 78];

const quickActions = [
  { to: '/explore', icon: '🔍', title: 'Find New Matches', desc: 'Explore users to swap skills with', gradient: 'from-primary-500 to-accent-500' },
  { to: '/requests', icon: '📬', title: 'Review Requests', desc: '3 pending swap requests', gradient: 'from-orange-500 to-amber-500' },
  { to: '/profile', icon: '👤', title: 'Edit Your Profile', desc: 'Update skills and availability', gradient: 'from-accent-500 to-cyan-500' },
];

export default function DashboardPage() {
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
            Welcome back, {currentUser.name.split(' ')[0]}! <span className="inline-block animate-wiggle">👋</span>
          </h1>
          <p className="text-gray-600">Here's what's happening with your skill swaps today.</p>
        </div>

        {/* Stats with staggered animation */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          {[
            { icon: '🌱', label: 'Skills I Teach', value: currentUser.skillsTeach.length, color: 'green', i: 1 },
            { icon: '🎯', label: 'Skills I Want', value: currentUser.skillsLearn.length, color: 'primary', i: 2 },
            { icon: '🤝', label: 'Potential Matches', value: mockUsers.length, color: 'accent', i: 3 },
            { icon: '⏳', label: 'Pending Requests', value: 3, color: 'orange', i: 4 },
            { icon: '🚀', label: 'Active Swaps', value: 2, color: 'purple', i: 5 },
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
          {mockUsers.slice(0, 4).map((user, idx) => (
            <div key={user._id} className={`animate-slide-up stagger-${idx + 1}`}>
              <MatchCard user={user} matchPercentage={matchPercentages[idx]} />
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

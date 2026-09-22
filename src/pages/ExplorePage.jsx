import { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import MatchCard from '../components/MatchCard';
import { mockUsers, currentUser, CATEGORIES, EXPERIENCE_LEVELS, LEARNING_MODES } from '../data/mockData';

function calculateMatch(user) {
  const teachOverlap = user.skillsTeach.filter((s) => currentUser.skillsLearn.includes(s)).length;
  const learnOverlap = user.skillsLearn.filter((s) => currentUser.skillsTeach.includes(s)).length;
  const total = teachOverlap + learnOverlap;
  const maxPossible = currentUser.skillsLearn.length + currentUser.skillsTeach.length;
  const base = (total / maxPossible) * 100;
  return Math.min(95, Math.max(40, Math.round(base + 50)));
}

export default function ExplorePage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [experience, setExperience] = useState('');
  const [location, setLocation] = useState('');
  const [learningMode, setLearningMode] = useState('');

  const filteredUsers = useMemo(() => {
    return mockUsers
      .map((u) => ({ ...u, matchPercentage: calculateMatch(u) }))
      .filter((u) => {
        if (search) {
          const q = search.toLowerCase();
          const match =
            u.name.toLowerCase().includes(q) ||
            u.skillsTeach.some((s) => s.toLowerCase().includes(q)) ||
            u.skillsLearn.some((s) => s.toLowerCase().includes(q));
          if (!match) return false;
        }
        if (category && u.category !== category) return false;
        if (experience && u.experience !== experience) return false;
        if (location && !u.location.toLowerCase().includes(location.toLowerCase())) return false;
        if (learningMode && u.learningMode !== learningMode) return false;
        return true;
      })
      .sort((a, b) => b.matchPercentage - a.matchPercentage);
  }, [search, category, experience, location, learningMode]);

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setExperience('');
    setLocation('');
    setLearningMode('');
  };

  const hasFilters = search || category || experience || location || learningMode;

  return (
    <Layout dashboard>
      <div className="section-padding py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Explore & Find Matches</h1>
          <p className="text-gray-600">Discover students with complementary skills to swap with.</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Search</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                <input
                  type="text"
                  placeholder="Name or skill..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-field pl-9"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field">
                <option value="">All Categories</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Experience</label>
              <select value={experience} onChange={(e) => setExperience(e.target.value)} className="input-field">
                <option value="">All Levels</option>
                {EXPERIENCE_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Location</label>
              <input
                type="text"
                placeholder="City..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Mode</label>
              <select value={learningMode} onChange={(e) => setLearningMode(e.target.value)} className="input-field">
                <option value="">All Modes</option>
                {LEARNING_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          {hasFilters && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-500">{filteredUsers.length} result{filteredUsers.length !== 1 ? 's' : ''} found</p>
              <button onClick={clearFilters} className="text-sm text-primary-600 font-medium hover:text-primary-700 transition-colors">
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Results */}
        {filteredUsers.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredUsers.map((user) => (
              <MatchCard key={user._id} user={user} matchPercentage={user.matchPercentage} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No matches found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters to see more results.</p>
            <button onClick={clearFilters} className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}

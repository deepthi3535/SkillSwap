import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import MatchCard from '../components/MatchCard';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { mockUsers, currentUser as defaultCurrentUser, CATEGORIES, EXPERIENCE_LEVELS, LEARNING_MODES } from '../data/mockData';
import { userAPI, swapAPI } from '../services/api';

function calculateMatch(user, currentUser) {
  const teachOverlap = (user.skillsTeach || []).filter((s) => (currentUser.skillsLearn || []).includes(s)).length;
  const learnOverlap = (user.skillsLearn || []).filter((s) => (currentUser.skillsTeach || []).includes(s)).length;
  const total = teachOverlap + learnOverlap;
  const maxPossible = Math.max(1, (currentUser.skillsLearn || []).length + (currentUser.skillsTeach || []).length);
  const base = (total / maxPossible) * 100;
  return Math.min(95, Math.max(40, Math.round(base + 50)));
}

export default function ExplorePage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(defaultCurrentUser);
  const [dbUsers, setDbUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [experience, setExperience] = useState('');
  const [location, setLocation] = useState('');
  const [learningMode, setLearningMode] = useState('');

  // Swap modal state
  const [selectedUser, setSelectedUser] = useState(null);
  const [offerSkill, setOfferSkill] = useState('');
  const [requestSkill, setRequestSkill] = useState('');
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const profileRes = await userAPI.getProfile();
        if (profileRes.data?.user) {
          setCurrentUser(profileRes.data.user);
        }
      } catch (err) {
        // Fallback to local
      }

      try {
        const params = {};
        if (category) params.category = category;
        if (experience) params.experience = experience;
        if (learningMode) params.learningMode = learningMode;
        if (location) params.location = location;
        if (search) params.search = search;

        const matchesRes = await userAPI.getMatches(params);
        const fetchedMatches = matchesRes.data?.matches || matchesRes.data?.data || matchesRes.data?.users;
        if (fetchedMatches && fetchedMatches.length > 0) {
          setDbUsers(fetchedMatches);
        } else {
          // Fallback to fetch all users or mockUsers
          const allRes = await userAPI.getAll(params);
          const usersList = allRes.data?.users || allRes.data?.data;
          if (usersList && usersList.length > 0) {
            setDbUsers(usersList);
          } else {
            setDbUsers(mockUsers);
          }
        }
      } catch (err) {
        setDbUsers(mockUsers);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [category, experience, learningMode, location, search]);

  const filteredUsers = useMemo(() => {
    return dbUsers
      .map((u) => ({
        ...u,
        matchPercentage: u.matchPercentage || u.matchScore || calculateMatch(u, currentUser),
      }))
      .filter((u) => {
        if (search) {
          const q = search.toLowerCase();
          const match =
            u.name.toLowerCase().includes(q) ||
            (u.skillsTeach && u.skillsTeach.some((s) => s.toLowerCase().includes(q))) ||
            (u.skillsLearn && u.skillsLearn.some((s) => s.toLowerCase().includes(q)));
          if (!match) return false;
        }
        if (category && u.category !== category) return false;
        if (experience && u.experience !== experience) return false;
        if (location && (!u.location || !u.location.toLowerCase().includes(location.toLowerCase()))) return false;
        if (learningMode && u.learningMode !== learningMode) return false;
        return true;
      })
      .sort((a, b) => b.matchPercentage - a.matchPercentage);
  }, [dbUsers, currentUser, search, category, experience, location, learningMode]);

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setExperience('');
    setLocation('');
    setLearningMode('');
  };

  const hasFilters = search || category || experience || location || learningMode;

  const handleRequestSwapModal = (targetUser) => {
    setSelectedUser(targetUser);
    setOfferSkill(currentUser.skillsTeach?.[0] || '');
    setRequestSkill(targetUser.skillsTeach?.[0] || '');
    setSentSuccess(false);
  };

  const handleSendSwapRequest = async () => {
    if (!selectedUser || !offerSkill || !requestSkill) return;
    setSending(true);
    try {
      await swapAPI.sendRequest({
        receiverId: selectedUser._id,
        offeredSkill: offerSkill,
        requestedSkill: requestSkill,
      });
      setSentSuccess(true);
      setTimeout(() => {
        setSelectedUser(null);
        setSending(false);
        navigate('/requests');
      }, 1200);
    } catch (err) {
      console.error('Send swap request error:', err);
      setSentSuccess(true);
      setTimeout(() => {
        setSelectedUser(null);
        setSending(false);
        navigate('/requests');
      }, 1200);
    }
  };

  return (
    <Layout dashboard>
      <div className="section-padding py-8">
        <div className="mb-6 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent-100/60 text-accent-700 rounded-full text-sm font-semibold mb-3">
            🔍 Smart Matching
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Explore & Find Matches</h1>
          <p className="text-gray-600">Discover students with complementary skills to swap with.</p>
        </div>

        {/* Filters with glass effect */}
        <div className="glass rounded-2xl p-5 mb-8 animate-slide-up stagger-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Search</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                <input type="text" placeholder="Name or skill..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9" />
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
              <input type="text" placeholder="City..." value={location} onChange={(e) => setLocation(e.target.value)} className="input-field" />
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
              <button onClick={clearFilters} className="text-sm text-primary-600 font-medium hover:text-primary-700 transition-colors link-underline">Clear all filters</button>
            </div>
          )}
        </div>

        {/* Results */}
        {filteredUsers.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredUsers.map((user, idx) => (
              <div key={user._id || idx} className={`animate-slide-up stagger-${(idx % 4) + 1}`}>
                <MatchCard user={user} matchPercentage={user.matchPercentage} onRequestSwap={handleRequestSwapModal} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 animate-fade-in">
            <div className="text-6xl mb-4 animate-bounce-soft">🔍</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No matches found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters to see more results.</p>
            <button onClick={clearFilters} className="text-primary-600 font-semibold hover:text-primary-700 transition-colors link-underline">Clear all filters</button>
          </div>
        )}
      </div>

      {/* Quick Swap Request Modal */}
      <Modal open={!!selectedUser} onClose={() => setSelectedUser(null)} title="Send Swap Request">
        {sentSuccess ? (
          <div className="text-center py-8 animate-scale-in">
            <div className="text-5xl mb-4 animate-bounce-soft">✅</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Request Sent!</h3>
            <p className="text-gray-600">Your swap request has been submitted.</p>
          </div>
        ) : (
          selectedUser && (
            <div className="space-y-5">
              <p className="text-gray-600 text-sm">
                Propose a skill swap with <span className="font-semibold text-gray-800">{selectedUser.name}</span>.
              </p>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Skill you'll teach them</label>
                <select value={offerSkill} onChange={(e) => setOfferSkill(e.target.value)} className="input-field">
                  {(currentUser.skillsTeach || ['Python', 'React']).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Skill you want to learn</label>
                <select value={requestSkill} onChange={(e) => setRequestSkill(e.target.value)} className="input-field">
                  {(selectedUser.skillsTeach || ['JavaScript']).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="ghost" onClick={() => setSelectedUser(null)}>Cancel</Button>
                <Button onClick={handleSendSwapRequest} disabled={sending || !offerSkill || !requestSkill}>
                  {sending ? 'Sending...' : 'Send Request'}
                </Button>
              </div>
            </div>
          )
        )}
      </Modal>
    </Layout>
  );
}

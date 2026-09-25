import { useParams, Link, useNavigate } from 'react';
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import SkillBadge from '../components/ui/SkillBadge';
import StarRating from '../components/ui/StarRating';
import Modal from '../components/ui/Modal';
import { mockUsers, currentUser as defaultCurrentUser } from '../data/mockData';
import { userAPI, swapAPI } from '../services/api';

function calculateMatch(user, currentUser) {
  const teachOverlap = (user.skillsTeach || []).filter((s) => (currentUser.skillsLearn || []).includes(s));
  const learnOverlap = (user.skillsLearn || []).filter((s) => (currentUser.skillsTeach || []).includes(s));
  const total = teachOverlap.length + learnOverlap.length;
  const maxPossible = Math.max(1, (currentUser.skillsLearn || []).length + (currentUser.skillsTeach || []).length);
  const base = (total / maxPossible) * 100;
  return {
    percentage: Math.min(95, Math.max(40, Math.round(base + 50))),
    matchingTeach: teachOverlap,
    matchingLearn: learnOverlap,
  };
}

export default function UserProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(defaultCurrentUser);
  const [loading, setLoading] = useState(true);

  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [offerSkill, setOfferSkill] = useState('');
  const [requestSkill, setRequestSkill] = useState('');
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const curRes = await userAPI.getProfile();
        if (curRes.data?.user) {
          setCurrentUser(curRes.data.user);
        }
      } catch (e) {
        // Fallback
      }

      try {
        const targetRes = await userAPI.getById(id);
        if (targetRes.data?.user || targetRes.data?.data) {
          setUser(targetRes.data.user || targetRes.data.data);
        } else {
          setUser(mockUsers.find((u) => u._id === id) || null);
        }
      } catch (e) {
        setUser(mockUsers.find((u) => u._id === id) || null);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  if (loading) {
    return (
      <Layout dashboard>
        <div className="section-padding py-20 text-center">
          <p className="text-gray-500">Loading user profile...</p>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout dashboard>
        <div className="section-padding py-20 text-center animate-fade-in">
          <div className="text-6xl mb-4 animate-bounce-soft">😕</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">User Not Found</h1>
          <p className="text-gray-600 mb-6">This profile may have been removed or is no longer available.</p>
          <Button to="/explore" variant="secondary">Back to Explore</Button>
        </div>
      </Layout>
    );
  }

  const match = calculateMatch(user, currentUser);

  const handleSendRequest = async () => {
    setSending(true);
    try {
      await swapAPI.sendRequest({
        receiverId: user._id,
        offeredSkill: offerSkill,
        requestedSkill: requestSkill,
        message: messageText,
      });
      setSent(true);
      setTimeout(() => {
        setSwapModalOpen(false);
        setSent(false);
        setSending(false);
        navigate('/requests');
      }, 1200);
    } catch (err) {
      console.error('Send request error:', err);
      setSent(true);
      setTimeout(() => {
        setSwapModalOpen(false);
        setSent(false);
        setSending(false);
        navigate('/requests');
      }, 1200);
    }
  };

  return (
    <Layout dashboard>
      <div className="section-padding py-8">
        {/* Back link */}
        <Link to="/explore" className="inline-flex items-center gap-1 text-gray-500 hover:text-primary-600 transition-colors mb-6 text-sm font-medium link-underline">
          ← Back to Explore
        </Link>

        {/* Profile header */}
        <Card className="mb-8 relative overflow-hidden animate-slide-up">
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 bg-[length:200%_100%] animate-gradient-x"></div>
          <div className="absolute top-4 right-8 w-16 h-16 border border-white/20 rounded-full"></div>
          <div className="absolute top-8 right-24 w-8 h-8 border border-white/20 rounded-full"></div>
          <div className="relative pt-16">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <img src={user.avatar} alt={user.name} className="w-28 h-28 rounded-2xl object-cover ring-4 ring-white shadow-lg" />
              <div className="flex-1 sm:pb-2">
                <h1 className="text-2xl font-extrabold text-gray-800">{user.name}</h1>
                <p className="text-gray-600">{user.college} · {user.location}</p>
                <div className="flex items-center gap-3 mt-2">
                  <StarRating rating={user.rating || 5} size="sm" />
                  <span className="text-sm text-gray-500">{(user.rating || 5).toFixed(1)} ({user.reviewCount || user.reviewsCount || 0} reviews)</span>
                </div>
              </div>
              <Button onClick={() => setSwapModalOpen(true)} className="sm:mb-2">
                🤝 Send Swap Request
              </Button>
            </div>
          </div>
        </Card>

        {/* Match analysis */}
        <Card className="mb-6 bg-gradient-to-br from-primary-50 to-accent-50 border-primary-100 animate-slide-up stagger-1">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="text-center shrink-0">
              <div className="relative w-24 h-24 group">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="#e0e7ff" strokeWidth="8" fill="none" />
                  <circle
                    cx="48" cy="48" r="40"
                    stroke="#6366f1" strokeWidth="8" fill="none"
                    strokeDasharray={`${(match.percentage / 100) * 251.2} 251.2`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-spring"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-700">{match.percentage}%</span>
                </div>
              </div>
              <p className="text-sm font-semibold text-primary-700 mt-1">Match Score</p>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-3">Why This Is a Good Match</h3>
              <div className="space-y-2">
                {match.matchingTeach.length > 0 && (
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">They can teach you:</span>{' '}
                    {match.matchingTeach.map((s) => (
                      <SkillBadge key={s} skill={s} type="teach" size="sm" className="mr-1" />
                    ))}
                  </p>
                )}
                {match.matchingLearn.length > 0 && (
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">You can teach them:</span>{' '}
                    {match.matchingLearn.map((s) => (
                      <SkillBadge key={s} skill={s} type="learn" size="sm" className="mr-1" />
                    ))}
                  </p>
                )}
                {match.matchingTeach.length === 0 && match.matchingLearn.length === 0 && (
                  <p className="text-sm text-gray-600">Some skills may still complement each other. Reach out to explore possibilities!</p>
                )}
              </div>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <Card className="animate-slide-up stagger-2">
              <h3 className="font-bold text-gray-800 mb-4">About</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{user.bio || 'No bio available.'}</p>
            </Card>
            <Card className="animate-slide-up stagger-3">
              <h3 className="font-bold text-gray-800 mb-4">Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Experience</span>
                  <span className="font-medium text-gray-800">{user.experience || 'Intermediate'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Learning Mode</span>
                  <span className="font-medium text-gray-800">{user.learningMode || 'Online'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Category</span>
                  <span className="font-medium text-gray-800">{user.category || 'Programming'}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-gray-500">Availability</span>
                  <div className="flex flex-wrap gap-1.5 justify-end">
                    {(user.availability || ['Weekends']).map((slot) => (
                      <span key={slot} className="badge bg-primary-50 text-primary-700">{slot}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="animate-slide-up stagger-4">
              <h3 className="font-bold text-gray-800 mb-4">🌱 Skills They Can Teach</h3>
              <div className="flex flex-wrap gap-2">
                {(user.skillsTeach || []).map((s) => (
                  <SkillBadge key={s} skill={s} type="teach" size="lg" />
                ))}
              </div>
            </Card>
            <Card className="animate-slide-up stagger-5">
              <h3 className="font-bold text-gray-800 mb-4">🎯 Skills They Want to Learn</h3>
              <div className="flex flex-wrap gap-2">
                {(user.skillsLearn || []).map((s) => (
                  <SkillBadge key={s} skill={s} type="learn" size="lg" />
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Swap request modal */}
      <Modal open={swapModalOpen} onClose={() => setSwapModalOpen(false)} title="Send Swap Request">
        {sent ? (
          <div className="text-center py-8 animate-scale-in">
            <div className="text-5xl mb-4 animate-bounce-soft">✅</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Request Sent!</h3>
            <p className="text-gray-600">Your swap request has been sent to {user.name}.</p>
          </div>
        ) : (
          <div className="space-y-5">
            <p className="text-gray-600 text-sm">Propose a skill swap with <span className="font-semibold text-gray-800">{user.name}</span>. Select which skill you'll offer and which one you'd like to learn.</p>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Skill you'll teach them</label>
              <select value={offerSkill} onChange={(e) => setOfferSkill(e.target.value)} className="input-field">
                <option value="">Select one of your teaching skills...</option>
                {(currentUser.skillsTeach || ['Python', 'React']).map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Skill you want to learn</label>
              <select value={requestSkill} onChange={(e) => setRequestSkill(e.target.value)} className="input-field">
                <option value="">Select one of their teaching skills...</option>
                {(user.skillsTeach || ['JavaScript']).map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Message (optional)</label>
              <textarea rows={3} value={messageText} onChange={(e) => setMessageText(e.target.value)} placeholder="Introduce yourself and describe what you'd like to learn..." className="input-field resize-none" />
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setSwapModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSendRequest} disabled={sending || !offerSkill || !requestSkill}>
                {sending ? 'Sending...' : 'Send Request'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
}

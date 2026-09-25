import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import SkillBadge from '../components/ui/SkillBadge';
import StarRating from '../components/ui/StarRating';
import Modal from '../components/ui/Modal';
import { currentUser as defaultUser, mockReviews, EXPERIENCE_LEVELS, LEARNING_MODES } from '../data/mockData';
import { userAPI, reviewAPI } from '../services/api';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(defaultUser);
  const [reviews, setReviews] = useState(mockReviews);
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState(defaultUser);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('skillswap_token');
    if (!token || token === 'null' || token === 'undefined') {
      navigate('/login');
      return;
    }

    async function loadProfile() {
      try {
        const res = await userAPI.getProfile();
        if (res.data?.user) {
          const u = res.data.user;
          setUser(u);
          setEditData(u);

          // Fetch reviews for this user
          try {
            const revRes = await reviewAPI.getUserReviews(u._id);
            if (revRes.data?.reviews && revRes.data.reviews.length > 0) {
              setReviews(revRes.data.reviews);
            }
          } catch (e) {
            // keep fallback
          }
        }
      } catch (err) {
        console.warn('Backend profile fetch error, using local state');
        if (err.response?.status === 401) {
          localStorage.removeItem('skillswap_token');
          localStorage.removeItem('skillswap_user');
          navigate('/login');
        }
      }
    }

    loadProfile();
  }, [navigate]);

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSkillToggle = (type, skill) => {
    const list = editData[type] || [];
    const updated = list.includes(skill) ? list.filter((s) => s !== skill) : [...list, skill];
    setEditData({ ...editData, [type]: updated });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await userAPI.updateProfile(editData);
      if (res.data?.user) {
        setUser(res.data.user);
        localStorage.setItem('skillswap_user', JSON.stringify(res.data.user));
      } else {
        setUser(editData);
      }
    } catch (err) {
      console.error('Update profile error:', err);
      setUser(editData);
    } finally {
      setSaving(false);
      setEditOpen(false);
    }
  };

  return (
    <Layout dashboard>
      <div className="section-padding py-8">
        {/* Profile header */}
        <Card className="mb-8 relative overflow-hidden animate-slide-up">
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 bg-[length:200%_100%] animate-gradient-x"></div>
          {/* Decorative circles */}
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
              <Button variant="secondary" onClick={() => { setEditData(user); setEditOpen(true); }}>
                ✏️ Edit Profile
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            <Card className="animate-slide-up stagger-1">
              <h3 className="font-bold text-gray-800 mb-4">About Me</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{user.bio || 'No bio provided yet.'}</p>
            </Card>

            <Card className="animate-slide-up stagger-2">
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

          {/* Right column */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="animate-slide-up stagger-3">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">🌱 Skills I Can Teach</h3>
              <div className="flex flex-wrap gap-2">
                {(user.skillsTeach || []).map((s) => (
                  <SkillBadge key={s} skill={s} type="teach" size="lg" />
                ))}
              </div>
            </Card>

            <Card className="animate-slide-up stagger-4">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">🎯 Skills I Want to Learn</h3>
              <div className="flex flex-wrap gap-2">
                {(user.skillsLearn || []).map((s) => (
                  <SkillBadge key={s} skill={s} type="learn" size="lg" />
                ))}
              </div>
            </Card>

            <Card className="animate-slide-up stagger-5">
              <h3 className="font-bold text-gray-800 mb-4">Reviews</h3>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review._id} className="border-b border-gray-50 last:border-0 pb-4 last:pb-0">
                    <div className="flex items-center gap-3 mb-2">
                      <img src={review.reviewer?.avatar || 'https://i.pravatar.cc/150?img=11'} alt={review.reviewer?.name || 'User'} className="w-10 h-10 rounded-full ring-2 ring-primary-100" />
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{review.reviewer?.name || 'Student'}</p>
                        <StarRating rating={review.rating} size="sm" />
                      </div>
                      <span className="ml-auto text-xs text-gray-400">{review.date || (review.createdAt ? new Date(review.createdAt).toISOString().split('T')[0] : '2026-09-20')}</span>
                    </div>
                    <p className="text-gray-600 text-sm">{review.comment}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Profile" size="lg">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
            <textarea name="bio" rows={3} value={editData.bio || ''} onChange={handleEditChange} className="input-field resize-none" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">College</label>
              <input name="college" value={editData.college || ''} onChange={handleEditChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
              <input name="location" value={editData.location || ''} onChange={handleEditChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Experience</label>
              <select name="experience" value={editData.experience || 'Intermediate'} onChange={handleEditChange} className="input-field">
                {EXPERIENCE_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Learning Mode</label>
              <select name="learningMode" value={editData.learningMode || 'Online'} onChange={handleEditChange} className="input-field">
                {LEARNING_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Skills I Can Teach (type and press Enter)</label>
            <input
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const val = e.target.value.trim();
                  const currentTeach = editData.skillsTeach || [];
                  if (val && !currentTeach.includes(val)) {
                    setEditData({ ...editData, skillsTeach: [...currentTeach, val] });
                  }
                  e.target.value = '';
                }
              }}
              placeholder="Add a skill..."
              className="input-field"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {(editData.skillsTeach || []).map((s) => (
                <button key={s} onClick={() => handleSkillToggle('skillsTeach', s)} className="badge bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-600 transition-all duration-200 hover:scale-105">
                  {s} ✕
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Skills I Want to Learn (type and press Enter)</label>
            <input
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const val = e.target.value.trim();
                  const currentLearn = editData.skillsLearn || [];
                  if (val && !currentLearn.includes(val)) {
                    setEditData({ ...editData, skillsLearn: [...currentLearn, val] });
                  }
                  e.target.value = '';
                }
              }}
              placeholder="Add a skill..."
              className="input-field"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {(editData.skillsLearn || []).map((s) => (
                <button key={s} onClick={() => handleSkillToggle('skillsLearn', s)} className="badge bg-purple-100 text-purple-700 hover:bg-red-100 hover:text-red-600 transition-all duration-200 hover:scale-105">
                  {s} ✕
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}

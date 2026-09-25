import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Card from '../components/ui/Card';
import SkillBadge from '../components/ui/SkillBadge';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import StarRating from '../components/ui/StarRating';
import { mockActiveSwaps } from '../data/mockData';
import { swapAPI, reviewAPI } from '../services/api';

export default function ActiveSwapsPage() {
  const navigate = useNavigate();
  const [swaps, setSwaps] = useState(mockActiveSwaps);
  const [loading, setLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('skillswap_token');
    if (!token || token === 'null' || token === 'undefined') {
      navigate('/login');
      return;
    }

    async function loadActiveSwaps() {
      setLoading(true);
      try {
        const res = await swapAPI.getActive();
        if (res.data?.swaps && res.data.swaps.length > 0) {
          setSwaps(res.data.swaps);
        } else {
          // Fallback to fetch all swaps & filter
          const allRes = await swapAPI.getSwaps();
          if (allRes.data?.active && allRes.data.active.length > 0) {
            setSwaps(allRes.data.active);
          }
        }
      } catch (err) {
        console.warn('Backend active swaps fetch error, using local state');
        if (err.response?.status === 401) {
          localStorage.removeItem('skillswap_token');
          localStorage.removeItem('skillswap_user');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    }

    loadActiveSwaps();
  }, [navigate]);

  const handleMarkCompleted = (swap) => {
    setReviewModal(swap);
    setRating(0);
    setComment('');
    setSubmitted(false);
  };

  const handleSubmitReview = async () => {
    if (!reviewModal) return;
    setSubmitting(true);
    try {
      // Mark swap as completed
      await swapAPI.complete(reviewModal._id);

      // Submit review
      await reviewAPI.create({
        swapId: reviewModal._id,
        rating,
        comment,
      });

      setSwaps(swaps.map((s) => (s._id === reviewModal._id ? { ...s, status: 'completed' } : s)));
      setSubmitted(true);
      setTimeout(() => {
        setReviewModal(null);
        setSubmitting(false);
      }, 1500);
    } catch (err) {
      console.error('Submit review error:', err);
      setSwaps(swaps.map((s) => (s._id === reviewModal._id ? { ...s, status: 'completed' } : s)));
      setSubmitted(true);
      setTimeout(() => {
        setReviewModal(null);
        setSubmitting(false);
      }, 1500);
    }
  };

  const statusBadge = (status) => {
    const styles = {
      'in-progress': 'bg-blue-100/80 text-blue-700',
      'accepted': 'bg-blue-100/80 text-blue-700',
      'completed': 'bg-green-100/80 text-green-700',
    };
    const displayStatus = status === 'accepted' ? 'in-progress' : status;
    return <span className={`badge ${styles[displayStatus] || styles['in-progress']} capitalize`}>{displayStatus.replace('-', ' ')}</span>;
  };

  return (
    <Layout dashboard>
      <div className="section-padding py-8">
        <div className="mb-6 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-100/60 text-green-700 rounded-full text-sm font-semibold mb-3">
            🔄 Active Swaps
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Active Swaps</h1>
          <p className="text-gray-600">Track your ongoing and completed skill exchanges.</p>
        </div>

        {swaps.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-6">
            {swaps.map((swap, idx) => (
              <div key={swap._id} className={`animate-slide-up stagger-${(idx % 2) + 1}`}>
                <Card hover>
                  <div className="flex items-center gap-4 mb-5">
                    <img src={swap.partner?.avatar || 'https://i.pravatar.cc/150?img=13'} alt={swap.partner?.name || 'Partner'} className="w-14 h-14 rounded-2xl ring-2 ring-primary-100" />
                    <div className="flex-1">
                      <Link to={`/users/${swap.partner?._id}`} className="font-bold text-gray-800 hover:text-primary-600 transition-colors">{swap.partner?.name || 'Swap Partner'}</Link>
                      <p className="text-sm text-gray-500">{swap.partner?.college}</p>
                    </div>
                    {statusBadge(swap.status)}
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-primary-50/30 rounded-2xl p-4 mb-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase mb-2">You Teach</p>
                        <SkillBadge skill={swap.mySkill || swap.offeredSkill} type="teach" size="lg" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase mb-2">You Learn</p>
                        <SkillBadge skill={swap.theirSkill || swap.requestedSkill} type="learn" size="lg" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="text-gray-400">Started:</span>{' '}
                        <span className="font-medium text-gray-700">{swap.startDate || '2026-09-10'}</span>
                      </div>
                      <div className="bg-gradient-to-br from-primary-500 to-accent-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm">
                        {swap.matchPercentage || swap.matchScore || 85}% Match
                      </div>
                    </div>
                  </div>

                  {swap.status === 'in-progress' || swap.status === 'accepted' ? (
                    <Button variant="accent" size="sm" className="w-full" onClick={() => handleMarkCompleted(swap)}>
                      ✓ Mark Completed
                    </Button>
                  ) : (
                    <div className="text-center py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                      <span className="text-green-600 font-semibold text-sm">✓ Swap Completed</span>
                    </div>
                  )}
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 animate-fade-in">
            <div className="text-6xl mb-4 animate-bounce-soft">🔄</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No active swaps yet</h3>
            <p className="text-gray-600 mb-4">Accept a swap request to start exchanging skills!</p>
            <Button to="/requests" variant="secondary">View Requests</Button>
          </div>
        )}
      </div>

      {/* Review modal */}
      <Modal open={!!reviewModal} onClose={() => setReviewModal(null)} title="Complete & Review">
        {submitted ? (
          <div className="text-center py-8 animate-scale-in">
            <div className="text-5xl mb-4 animate-bounce-soft">✅</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Swap Completed!</h3>
            <p className="text-gray-600">Thank you for your review.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {reviewModal && (
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-primary-50/30 rounded-2xl">
                <img src={reviewModal.partner?.avatar || 'https://i.pravatar.cc/150?img=13'} alt={reviewModal.partner?.name || 'Partner'} className="w-12 h-12 rounded-xl" />
                <div>
                  <p className="font-bold text-gray-800">{reviewModal.partner?.name || 'Partner'}</p>
                  <p className="text-sm text-gray-500">{reviewModal.mySkill || reviewModal.offeredSkill} ↔ {reviewModal.theirSkill || reviewModal.requestedSkill}</p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">How was your experience?</label>
              <div className="flex items-center gap-2">
                <StarRating rating={rating} size="lg" interactive onChange={setRating} />
                {rating > 0 && <span className="text-gray-600 font-medium ml-2">{rating}.0</span>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Leave a comment</label>
              <textarea rows={4} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your experience working with this partner..." className="input-field resize-none" />
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setReviewModal(null)}>Cancel</Button>
              <Button onClick={handleSubmitReview} disabled={submitting || rating === 0}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
}

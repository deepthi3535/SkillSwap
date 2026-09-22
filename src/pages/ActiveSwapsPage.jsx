import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Card from '../components/ui/Card';
import SkillBadge from '../components/ui/SkillBadge';
import StarRating from '../components/ui/StarRating';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { mockActiveSwaps } from '../data/mockData';

export default function ActiveSwapsPage() {
  const [swaps, setSwaps] = useState(mockActiveSwaps);
  const [reviewModal, setReviewModal] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleMarkCompleted = (swap) => {
    setReviewModal(swap);
    setRating(0);
    setComment('');
    setSubmitted(false);
  };

  const handleSubmitReview = () => {
    // Placeholder — API: swapAPI.submitReview({ swapId: reviewModal._id, rating, comment })
    setSwaps(swaps.map((s) => (s._id === reviewModal._id ? { ...s, status: 'completed' } : s)));
    setSubmitted(true);
    setTimeout(() => {
      setReviewModal(null);
    }, 1500);
  };

  const statusBadge = (status) => {
    const styles = {
      'in-progress': 'bg-blue-100 text-blue-700',
      'completed': 'bg-green-100 text-green-700',
    };
    return <span className={`badge ${styles[status] || styles['in-progress']} capitalize`}>{status.replace('-', ' ')}</span>;
  };

  return (
    <Layout dashboard>
      <div className="section-padding py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Active Swaps</h1>
          <p className="text-gray-600">Track your ongoing and completed skill exchanges.</p>
        </div>

        {swaps.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-6">
            {swaps.map((swap) => (
              <Card key={swap._id} hover>
                {/* Partner */}
                <div className="flex items-center gap-4 mb-5">
                  <img src={swap.partner.avatar} alt={swap.partner.name} className="w-14 h-14 rounded-full ring-2 ring-primary-100" />
                  <div className="flex-1">
                    <Link to={`/users/${swap.partner._id}`} className="font-bold text-gray-800 hover:text-primary-600 transition-colors">
                      {swap.partner.name}
                    </Link>
                    <p className="text-sm text-gray-500">{swap.partner.college}</p>
                  </div>
                  {statusBadge(swap.status)}
                </div>

                {/* Exchange */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase mb-2">You Teach</p>
                      <SkillBadge skill={swap.mySkill} type="teach" size="lg" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase mb-2">You Learn</p>
                      <SkillBadge skill={swap.theirSkill} type="learn" size="lg" />
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="flex items-center justify-between text-sm mb-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-gray-400">Started:</span>{' '}
                      <span className="font-medium text-gray-700">{swap.startDate}</span>
                    </div>
                    <div className="bg-gradient-to-br from-primary-500 to-accent-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold">
                      {swap.matchPercentage}% Match
                    </div>
                  </div>
                </div>

                {/* Action */}
                {swap.status === 'in-progress' ? (
                  <Button variant="accent" size="sm" className="w-full" onClick={() => handleMarkCompleted(swap)}>
                    ✓ Mark Completed
                  </Button>
                ) : (
                  <div className="text-center py-2 bg-green-50 rounded-lg">
                    <span className="text-green-600 font-semibold text-sm">✓ Swap Completed</span>
                  </div>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔄</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No active swaps yet</h3>
            <p className="text-gray-600 mb-4">Accept a swap request to start exchanging skills!</p>
            <Button to="/requests" variant="secondary">View Requests</Button>
          </div>
        )}
      </div>

      {/* Review modal */}
      <Modal open={!!reviewModal} onClose={() => setReviewModal(null)} title="Complete & Review">
        {submitted ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Swap Completed!</h3>
            <p className="text-gray-600">Thank you for your review.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {reviewModal && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <img src={reviewModal.partner.avatar} alt={reviewModal.partner.name} className="w-12 h-12 rounded-full" />
                <div>
                  <p className="font-bold text-gray-800">{reviewModal.partner.name}</p>
                  <p className="text-sm text-gray-500">{reviewModal.mySkill} ↔ {reviewModal.theirSkill}</p>
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
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience working with this partner..."
                className="input-field resize-none"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setReviewModal(null)}>Cancel</Button>
              <Button onClick={handleSubmitReview} disabled={rating === 0}>
                Submit Review
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
}

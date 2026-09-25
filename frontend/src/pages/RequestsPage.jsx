import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Card from '../components/ui/Card';
import SkillBadge from '../components/ui/SkillBadge';
import StarRating from '../components/ui/StarRating';
import { mockIncomingRequests, mockSentRequests } from '../data/mockData';
import { swapAPI } from '../services/api';

export default function RequestsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('incoming');
  const [incoming, setIncoming] = useState(mockIncomingRequests);
  const [sent, setSent] = useState(mockSentRequests);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('skillswap_token');
    if (!token || token === 'null' || token === 'undefined') {
      navigate('/login');
      return;
    }

    async function loadRequests() {
      setLoading(true);
      try {
        const res = await swapAPI.getSwaps();
        if (res.data) {
          if (res.data.incoming && res.data.incoming.length > 0) {
            setIncoming(res.data.incoming);
          }
          if (res.data.sent && res.data.sent.length > 0) {
            setSent(res.data.sent);
          }
        }
      } catch (err) {
        console.warn('Backend requests fetch error, using local state');
        if (err.response?.status === 401) {
          localStorage.removeItem('skillswap_token');
          localStorage.removeItem('skillswap_user');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    }

    loadRequests();
  }, [navigate]);

  const handleAccept = async (id) => {
    try {
      await swapAPI.accept(id);
      setIncoming(incoming.map((r) => (r._id === id ? { ...r, status: 'accepted' } : r)));
    } catch (err) {
      setIncoming(incoming.map((r) => (r._id === id ? { ...r, status: 'accepted' } : r)));
    }
  };

  const handleReject = async (id) => {
    try {
      await swapAPI.reject(id);
      setIncoming(incoming.map((r) => (r._id === id ? { ...r, status: 'rejected' } : r)));
    } catch (err) {
      setIncoming(incoming.map((r) => (r._id === id ? { ...r, status: 'rejected' } : r)));
    }
  };

  const statusBadge = (status) => {
    const styles = {
      pending: 'bg-amber-100/80 text-amber-700',
      accepted: 'bg-green-100/80 text-green-700',
      rejected: 'bg-red-100/80 text-red-700',
    };
    return <span className={`badge ${styles[status] || styles.pending} capitalize`}>{status}</span>;
  };

  return (
    <Layout dashboard>
      <div className="section-padding py-8">
        <div className="mb-6 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-100/60 text-orange-700 rounded-full text-sm font-semibold mb-3">
            📬 Swap Requests
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Swap Requests</h1>
          <p className="text-gray-600">Manage your incoming and sent skill swap requests.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-gray-200 animate-slide-up stagger-1">
          <button
            onClick={() => setActiveTab('incoming')}
            className={`px-6 py-3 font-semibold text-sm border-b-2 transition-all duration-300 ${
              activeTab === 'incoming' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Incoming Requests ({incoming.filter((r) => r.status === 'pending').length})
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`px-6 py-3 font-semibold text-sm border-b-2 transition-all duration-300 ${
              activeTab === 'sent' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Sent Requests ({sent.length})
          </button>
        </div>

        {/* Incoming */}
        {activeTab === 'incoming' && (
          <div className="space-y-4">
            {incoming.length > 0 ? (
              incoming.map((req, idx) => (
                <div key={req._id} className={`animate-slide-up stagger-${(idx % 4) + 1}`}>
                  <Card className="hover:shadow-xl transition-all duration-300">
                    <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
                      <div className="flex items-center gap-4 lg:w-64 shrink-0">
                        <img src={req.fromUser?.avatar || 'https://i.pravatar.cc/150?img=11'} alt={req.fromUser?.name || 'User'} className="w-14 h-14 rounded-2xl ring-2 ring-primary-100" />
                        <div>
                          <Link to={`/users/${req.fromUser?._id}`} className="font-bold text-gray-800 hover:text-primary-600 transition-colors">{req.fromUser?.name || 'Student'}</Link>
                          <p className="text-sm text-gray-500">{req.fromUser?.college}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <StarRating rating={req.fromUser?.rating || 5} size="sm" />
                            <span className="text-xs text-gray-400">{(req.fromUser?.rating || 5).toFixed(1)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 grid sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-gray-400 uppercase mb-1.5">Offering</p>
                          <SkillBadge skill={req.offeredSkill} type="teach" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-400 uppercase mb-1.5">Wants to Learn</p>
                          <SkillBadge skill={req.requestedSkill} type="learn" />
                        </div>
                      </div>

                      <div className="flex items-center gap-4 lg:w-48 shrink-0">
                        <div className="bg-gradient-to-br from-primary-500 to-accent-500 text-white px-3 py-1.5 rounded-xl font-bold text-sm shadow-md">
                          {req.matchPercentage || req.matchScore || 85}% Match
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {req.status === 'pending' ? (
                          <>
                            <button onClick={() => handleAccept(req._id)} className="px-5 py-2.5 bg-gradient-to-br from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-sm shadow-sm">
                              Accept
                            </button>
                            <button onClick={() => handleReject(req._id)} className="px-5 py-2.5 bg-red-100 text-red-600 font-semibold rounded-xl hover:bg-red-200 transition-all duration-200 text-sm">
                              Reject
                            </button>
                          </>
                        ) : (
                          statusBadge(req.status)
                        )}
                      </div>
                    </div>

                    {req.message && (
                      <div className="mt-4 pt-4 border-t border-gray-50">
                        <p className="text-sm text-gray-600 italic">"{req.message}"</p>
                        <p className="text-xs text-gray-400 mt-1">Received on {req.createdAt ? new Date(req.createdAt).toISOString().split('T')[0] : '2026-09-20'}</p>
                      </div>
                    )}
                  </Card>
                </div>
              ))
            ) : (
              <div className="text-center py-20 animate-fade-in">
                <div className="text-6xl mb-4 animate-bounce-soft">📭</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No incoming requests</h3>
                <p className="text-gray-600">When someone sends you a swap request, it'll appear here.</p>
              </div>
            )}
          </div>
        )}

        {/* Sent */}
        {activeTab === 'sent' && (
          <div className="space-y-4">
            {sent.length > 0 ? (
              sent.map((req, idx) => (
                <div key={req._id} className={`animate-slide-up stagger-${(idx % 4) + 1}`}>
                  <Card className="hover:shadow-xl transition-all duration-300">
                    <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
                      <div className="flex items-center gap-4 lg:w-64 shrink-0">
                        <img src={req.toUser?.avatar || 'https://i.pravatar.cc/150?img=5'} alt={req.toUser?.name || 'User'} className="w-14 h-14 rounded-2xl ring-2 ring-primary-100" />
                        <div>
                          <Link to={`/users/${req.toUser?._id}`} className="font-bold text-gray-800 hover:text-primary-600 transition-colors">{req.toUser?.name || 'Student'}</Link>
                          <p className="text-sm text-gray-500">{req.toUser?.college}</p>
                        </div>
                      </div>

                      <div className="flex-1 grid sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-gray-400 uppercase mb-1.5">You Offer</p>
                          <SkillBadge skill={req.offeredSkill} type="teach" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-400 uppercase mb-1.5">You Want</p>
                          <SkillBadge skill={req.requestedSkill} type="learn" />
                        </div>
                      </div>

                      <div className="flex items-center gap-4 lg:w-48 shrink-0">
                        <div className="bg-gradient-to-br from-primary-500 to-accent-500 text-white px-3 py-1.5 rounded-xl font-bold text-sm shadow-md">
                          {req.matchPercentage || req.matchScore || 85}% Match
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {statusBadge(req.status)}
                      </div>
                    </div>

                    {req.message && (
                      <div className="mt-4 pt-4 border-t border-gray-50">
                        <p className="text-sm text-gray-600 italic">"{req.message}"</p>
                        <p className="text-xs text-gray-400 mt-1">Sent on {req.createdAt ? new Date(req.createdAt).toISOString().split('T')[0] : '2026-09-21'}</p>
                      </div>
                    )}
                  </Card>
                </div>
              ))
            ) : (
              <div className="text-center py-20 animate-fade-in">
                <div className="text-6xl mb-4 animate-bounce-soft">📤</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No sent requests</h3>
                <p className="text-gray-600 mb-4">Explore users and send your first swap request!</p>
                <Link to="/explore" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors link-underline">Explore Users →</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

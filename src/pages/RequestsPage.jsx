import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Card from '../components/ui/Card';
import SkillBadge from '../components/ui/SkillBadge';
import StarRating from '../components/ui/StarRating';
import { mockIncomingRequests, mockSentRequests } from '../data/mockData';

export default function RequestsPage() {
  const [activeTab, setActiveTab] = useState('incoming');
  const [incoming, setIncoming] = useState(mockIncomingRequests);
  const [sent, setSent] = useState(mockSentRequests);

  const handleAccept = (id) => {
    setIncoming(incoming.map((r) => (r._id === id ? { ...r, status: 'accepted' } : r)));
  };

  const handleReject = (id) => {
    setIncoming(incoming.map((r) => (r._id === id ? { ...r, status: 'rejected' } : r)));
  };

  const statusBadge = (status) => {
    const styles = {
      pending: 'bg-amber-100 text-amber-700',
      accepted: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
    };
    return <span className={`badge ${styles[status] || styles.pending} capitalize`}>{status}</span>;
  };

  return (
    <Layout dashboard>
      <div className="section-padding py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Swap Requests</h1>
          <p className="text-gray-600">Manage your incoming and sent skill swap requests.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('incoming')}
            className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${
              activeTab === 'incoming'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Incoming Requests ({incoming.filter((r) => r.status === 'pending').length})
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${
              activeTab === 'sent'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Sent Requests ({sent.length})
          </button>
        </div>

        {/* Incoming */}
        {activeTab === 'incoming' && (
          <div className="space-y-4">
            {incoming.length > 0 ? (
              incoming.map((req) => (
                <Card key={req._id} className="hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
                    {/* User info */}
                    <div className="flex items-center gap-4 lg:w-64 shrink-0">
                      <img src={req.fromUser.avatar} alt={req.fromUser.name} className="w-14 h-14 rounded-full ring-2 ring-primary-100" />
                      <div>
                        <Link to={`/users/${req.fromUser._id}`} className="font-bold text-gray-800 hover:text-primary-600 transition-colors">
                          {req.fromUser.name}
                        </Link>
                        <p className="text-sm text-gray-500">{req.fromUser.college}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <StarRating rating={req.fromUser.rating} size="sm" />
                          <span className="text-xs text-gray-400">{req.fromUser.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Skills */}
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

                    {/* Match */}
                    <div className="flex items-center gap-4 lg:w-48 shrink-0">
                      <div className="text-center">
                        <div className="bg-gradient-to-br from-primary-500 to-accent-500 text-white px-3 py-1.5 rounded-lg font-bold text-sm">
                          {req.matchPercentage}% Match
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {req.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleAccept(req._id)}
                            className="px-5 py-2.5 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors text-sm shadow-sm"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleReject(req._id)}
                            className="px-5 py-2.5 bg-red-100 text-red-600 font-semibold rounded-lg hover:bg-red-200 transition-colors text-sm"
                          >
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
                      <p className="text-xs text-gray-400 mt-1">Received on {req.createdAt}</p>
                    </div>
                  )}
                </Card>
              ))
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📭</div>
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
              sent.map((req) => (
                <Card key={req._id} className="hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
                    <div className="flex items-center gap-4 lg:w-64 shrink-0">
                      <img src={req.toUser.avatar} alt={req.toUser.name} className="w-14 h-14 rounded-full ring-2 ring-primary-100" />
                      <div>
                        <Link to={`/users/${req.toUser._id}`} className="font-bold text-gray-800 hover:text-primary-600 transition-colors">
                          {req.toUser.name}
                        </Link>
                        <p className="text-sm text-gray-500">{req.toUser.college}</p>
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
                      <div className="text-center">
                        <div className="bg-gradient-to-br from-primary-500 to-accent-500 text-white px-3 py-1.5 rounded-lg font-bold text-sm">
                          {req.matchPercentage}% Match
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {statusBadge(req.status)}
                    </div>
                  </div>

                  {req.message && (
                    <div className="mt-4 pt-4 border-t border-gray-50">
                      <p className="text-sm text-gray-600 italic">"{req.message}"</p>
                      <p className="text-xs text-gray-400 mt-1">Sent on {req.createdAt}</p>
                    </div>
                  )}
                </Card>
              ))
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📤</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No sent requests</h3>
                <p className="text-gray-600 mb-4">Explore users and send your first swap request!</p>
                <Link to="/explore" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">
                  Explore Users →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

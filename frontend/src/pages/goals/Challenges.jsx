import React, { useState, useEffect } from 'react';
import { challengeService } from '../../services/services';
import { Swords, Trophy, Users, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';
import { PageLoader, EmptyState } from '../../components/common/UIComponents';
import toast from 'react-hot-toast';

export default function Challenges() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const res = await challengeService.getChallenges();
      setChallenges(res.data || []);
    } catch (err) {
      console.error('Failed to load challenges:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (id) => {
    try {
      await challengeService.joinChallenge(id);
      toast.success('Joined challenge! Let’s crush this together!');
      fetchChallenges();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to join challenge');
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="border-b border-gray-100 dark:border-dark-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black">Community Challenges</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Push your boundaries alongside thousands of athletes worldwide
        </p>
      </div>

      {challenges.length === 0 ? (
        <EmptyState
          title="No Active Challenges Right Now"
          description="Check back soon for new community endurance, strength, and hydration challenges!"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((ch) => (
            <div key={ch._id} className="card p-6 space-y-4 card-hover flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="badge badge-info uppercase">{ch.type}</span>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Users size={14} />
                    <span>{ch.participants?.length || 1} joined</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold mb-2">{ch.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                  {ch.description}
                </p>

                <div className="p-3 rounded-xl bg-gray-50 dark:bg-dark-900/50 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Target:</span>
                    <strong className="text-gray-900 dark:text-gray-100">{ch.target}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Ends:</span>
                    <span>{new Date(ch.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleJoin(ch._id)}
                className="w-full btn-primary py-2.5 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Swords size={16} />
                <span>Join Challenge</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

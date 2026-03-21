import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../AuthContext';
import { api } from '../api';

type Campaign = { id: number; title: string; description: string; impactGoal: string; status: string };

export default function MyCampaigns() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }
    if (!user) return;

    api.dashboard()
      .then((d) => setCampaigns(d.myCampaigns))
      .catch(() => setCampaigns([]))
      .finally(() => setLoading(false));
  }, [user, authLoading, navigate]);

  const statusColor = (status: string) => {
    if (status === 'Approved') return 'bg-green-100 text-green-800';
    if (status === 'Rejected') return 'bg-red-100 text-red-800';
    return 'bg-amber-100 text-amber-800';
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[60vh] flex flex-col">
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 text-white py-20 px-4">
          <div className="container mx-auto max-w-3xl text-center">
            <div className="h-4 w-24 bg-slate-600 rounded mx-auto mb-4 animate-pulse" />
            <div className="h-10 w-48 bg-slate-600 rounded mx-auto animate-pulse" />
          </div>
        </section>
        <div className="container mx-auto px-4 py-12 flex justify-center">
          <div className="w-10 h-10 border-2 border-acs-teal border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 text-white py-24 px-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23fff\' fill-opacity=\'0.04\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-80" />
        <div className="container mx-auto relative max-w-4xl flex flex-wrap justify-between items-center gap-6">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-acs-teal font-semibold text-sm uppercase tracking-wider mb-2"
            >
              My Campaigns
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-4xl md:text-5xl font-bold tracking-tight mb-2"
            >
              Your Campaigns
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-300"
            >
              View the status of your submitted campaigns.
            </motion.p>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
            <Link
              to="/campaigns/create"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-colors shadow-lg"
            >
              New Campaign
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 max-w-3xl">
        {campaigns.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-teal-100 text-teal-600 text-4xl flex items-center justify-center mx-auto mb-6">
              📋
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">No campaigns yet</h2>
            <p className="text-slate-600 mb-8">You have not created any campaigns. Create your first one to get started.</p>
            <Link
              to="/campaigns/create"
              className="inline-flex px-6 py-3 rounded-xl bg-acs-teal text-white font-semibold hover:bg-acs-teal-dark transition-colors"
            >
              Create your first campaign
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {campaigns.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-wrap justify-between gap-4 items-start hover:shadow-md hover:border-teal-100 transition-all"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-slate-800">{c.title}</h3>
                  <p className="text-slate-500 text-sm mt-1 line-clamp-2">{c.description || '—'}</p>
                  <p className="text-slate-400 text-xs mt-2">Goal: {c.impactGoal || '—'}</p>
                </div>
                <span
                  className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium ${statusColor(c.status)}`}
                >
                  {c.status}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

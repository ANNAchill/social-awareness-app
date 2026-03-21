import { useEffect, useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../AuthContext';
import { api } from '../api';

type DashboardData = {
  user: { id: number; fullName: string; email: string };
  myCampaigns: Array<{ id: number; title: string; description: string; impactGoal: string; status: string }>;
  myBusinesses: Array<{ id: number; name: string; industry: string; website?: string; city?: string }>;
};

export default function Dashboard() {
  const { user, loading: authLoading, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  if (!authLoading && user && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }
    if (!user || isAdmin) return;
    api.dashboard()
      .then(setData)
      .catch(() => setError('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, [user, authLoading, isAdmin, navigate]);

  if (authLoading || loading) {
    return (
      <div className="min-h-[60vh] flex flex-col">
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 text-white py-20 px-4">
          <div className="container mx-auto max-w-3xl text-center">
            <div className="h-4 w-24 bg-slate-600 rounded mx-auto mb-4 animate-pulse" />
            <div className="h-10 w-56 bg-slate-600 rounded mx-auto animate-pulse" />
          </div>
        </section>
        <div className="container mx-auto px-4 py-12 flex justify-center">
          <div className="w-10 h-10 border-2 border-acs-teal border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center max-w-md">
          <p className="text-red-600 font-medium">{error || 'Not found'}</p>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200"
          >
            Go home
          </button>
        </div>
      </div>
    );
  }

  const initial = data.user.fullName.charAt(0).toUpperCase();

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 text-white py-24 px-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23fff\' fill-opacity=\'0.04\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-80" />
        <div className="container mx-auto relative max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-2xl font-bold shrink-0">
                {initial}
              </div>
              <div>
                <p className="text-acs-teal font-semibold text-sm uppercase tracking-wider mb-1">Dashboard</p>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Hi, {data.user.fullName}</h1>
                <p className="text-slate-300 mt-1">Manage your impact and visibility today.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={async () => {
                await logout();
                navigate('/');
              }}
              className="px-5 py-2.5 rounded-xl border-2 border-white/40 text-white font-semibold hover:bg-white/10 transition-colors"
            >
              Logout
            </button>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Link to="/campaigns/create">
              <div className="h-full rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-white p-6 shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 hover:-translate-y-1 transition-all flex items-center gap-4 border border-teal-600/20">
                <span className="text-4xl">📢</span>
                <div className="flex-1">
                  <h3 className="text-lg font-bold">Create Social Campaign</h3>
                  <p className="text-teal-100 text-sm mt-1">Start a new awareness movement.</p>
                </div>
                <span className="text-2xl">→</span>
              </div>
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Link to="/businesses/create">
              <div className="h-full rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 text-white p-6 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:-translate-y-1 transition-all flex items-center gap-4 border border-orange-600/20">
                <span className="text-4xl">🏪</span>
                <div className="flex-1">
                  <h3 className="text-lg font-bold">Create Business Ad</h3>
                  <p className="text-orange-100 text-sm mt-1">Promote your business to the community.</p>
                </div>
                <span className="text-2xl">→</span>
              </div>
            </Link>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <p className="text-acs-teal font-semibold text-sm uppercase tracking-wider mb-3">My Campaigns</p>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-800">Campaigns</h2>
              <Link to="/campaigns" className="text-sm text-acs-teal font-semibold hover:underline">
                View all
              </Link>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden">
              {data.myCampaigns.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <p className="text-sm">No campaigns yet.</p>
                  <Link to="/campaigns/create" className="inline-block mt-3 text-acs-teal font-semibold text-sm hover:underline">
                    Create one
                  </Link>
                </div>
              ) : (
                data.myCampaigns.map((c) => (
                  <div key={c.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex justify-between items-start gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800">{c.title}</p>
                        <p className="text-slate-500 text-sm mt-0.5">{c.impactGoal}</p>
                      </div>
                      <span
                        className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${
                          c.status === 'Active' ? 'bg-teal-100 text-teal-700' : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
            <p className="text-acs-teal font-semibold text-sm uppercase tracking-wider mb-3">My Business Ads</p>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-800">Business Ads</h2>
              <Link to="/businesses" className="text-sm text-acs-teal font-semibold hover:underline">
                View directory
              </Link>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden">
              {data.myBusinesses.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <p className="text-sm">No business ads yet.</p>
                  <Link to="/businesses/create" className="inline-block mt-3 text-acs-teal font-semibold text-sm hover:underline">
                    Add one
                  </Link>
                </div>
              ) : (
                data.myBusinesses.map((b) => (
                  <div key={b.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                    <p className="font-semibold text-slate-800">{b.name}</p>
                    <p className="text-slate-500 text-sm mt-0.5">{b.industry}</p>
                  </div>
                ))
              )}
            </div>
          </motion.section>
        </div>
      </section>
    </div>
  );
}

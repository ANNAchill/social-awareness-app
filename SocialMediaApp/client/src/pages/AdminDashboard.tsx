import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../AuthContext';
import { api } from '../api';

type PendingCampaign = {
  id: number;
  title: string;
  description: string;
  impactGoal: string;
  status: string;
  ownerName: string;
  ownerEmail: string;
  ownerId: number;
};

type UserRow = { id: number; fullName: string; email: string; roles: string[] };
type DemotionRequest = {
  id: number;
  targetId: number;
  targetName: string;
  targetEmail: string;
  createdById: number;
  createdByName: string;
  approvalsCount: number;
  status: string;
  createdAt: string;
};

export default function AdminDashboard() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'campaigns' | 'users' | 'demotions'>('campaigns');
  const [pending, setPending] = useState<PendingCampaign[]>([]);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [demotions, setDemotions] = useState<DemotionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actingId, setActingId] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }
    if (!authLoading && user && !isAdmin) {
      setError('Access denied. Admin only.');
      setLoading(false);
      return;
    }
    if (!isAdmin) return;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [p, u, d] = await Promise.all([
          api.admin.pendingCampaigns(),
          api.admin.users(),
          api.admin.demotionRequests(),
        ]);
        setPending(p);
        setUsers(u);
        setDemotions(d);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, authLoading, isAdmin, navigate]);

  const handleApprove = async (id: number) => {
    setActingId(id);
    try {
      await api.admin.approveCampaign(id);
      setPending((prev) => prev.filter((c) => c.id !== id));
    } finally {
      setActingId(null);
    }
  };

  const handleReject = async (id: number) => {
    setActingId(id);
    try {
      await api.admin.rejectCampaign(id);
      setPending((prev) => prev.filter((c) => c.id !== id));
    } finally {
      setActingId(null);
    }
  };

  const handleAssignAdmin = async (userId: number) => {
    setActingId(userId);
    try {
      await api.admin.assignRole(userId, 'Admin');
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, roles: [...u.roles, 'Admin'] } : u))
      );
    } finally {
      setActingId(null);
    }
  };

  const handleRequestDemotion = async (targetUserId: number) => {
    setActingId(targetUserId);
    try {
      const res = await api.admin.createDemotionRequest(targetUserId);
      if (!demotions.some((r) => r.id === res.requestId)) {
        const updated = await api.admin.demotionRequests();
        setDemotions(updated);
      }
    } finally {
      setActingId(null);
    }
  };

  const handleApproveDemotion = async (requestId: number) => {
    setActingId(requestId);
    try {
      const res = await api.admin.approveDemotionRequest(requestId);
      if (res.status === 'Approved') {
        const updatedUsers = await api.admin.users();
        setUsers(updatedUsers);
      }
      const updated = await api.admin.demotionRequests();
      setDemotions(updated);
    } finally {
      setActingId(null);
    }
  };

  if (authLoading || (user && !isAdmin && !error)) {
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

  if (error && !isAdmin) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center max-w-md">
          <p className="text-red-600 font-medium">{error}</p>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 text-white py-24 px-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23fff\' fill-opacity=\'0.04\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-80" />
        <div className="container mx-auto relative max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-acs-teal font-semibold text-sm uppercase tracking-wider mb-2"
          >
            Admin
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-2"
          >
            Admin Dashboard
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-300"
          >
            Manage campaigns, users, and roles.
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="flex gap-2 mb-6 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setTab('campaigns')}
          className={`px-4 py-2 rounded-t-lg font-medium ${
            tab === 'campaigns' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'
          }`}
        >
          Approval requests
        </button>
        <button
          type="button"
          onClick={() => setTab('users')}
          className={`px-4 py-2 rounded-t-lg font-medium ${
            tab === 'users' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'
          }`}
        >
          Users & roles
        </button>
        <button
          type="button"
          onClick={() => setTab('demotions')}
          className={`px-4 py-2 rounded-t-lg font-medium ${
            tab === 'demotions' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'
          }`}
        >
          Admin role requests
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-2 border-acs-teal border-t-transparent rounded-full animate-spin" />
        </div>
      ) : tab === 'campaigns' ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-xl font-bold text-slate-800 mb-4">Pending campaigns</h2>
          {pending.length === 0 ? (
            <p className="text-slate-500">No pending approval requests.</p>
          ) : (
            <div className="space-y-4">
              {pending.map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-2xl shadow border border-slate-100 p-5 flex flex-wrap justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800">{c.title}</h3>
                    <p className="text-slate-500 text-sm mt-1">{c.description}</p>
                    <p className="text-slate-400 text-xs mt-1">Goal: {c.impactGoal}</p>
                    <p className="text-slate-500 text-xs mt-2">
                      Submitted by: {c.ownerName} ({c.ownerEmail})
                    </p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <button
                      type="button"
                      onClick={() => handleApprove(c.id)}
                      disabled={actingId === c.id}
                      className="px-4 py-2 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-50"
                    >
                      {actingId === c.id ? '…' : 'Approve'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReject(c.id)}
                      disabled={actingId === c.id}
                      className="px-4 py-2 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      ) : tab === 'users' ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-xl font-bold text-slate-800 mb-4">All users</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-2 font-semibold text-slate-700">Name</th>
                  <th className="py-2 font-semibold text-slate-700">Email</th>
                  <th className="py-2 font-semibold text-slate-700">Roles</th>
                  <th className="py-2 font-semibold text-slate-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-slate-100">
                    <td className="py-3">{u.fullName}</td>
                    <td className="py-3 text-slate-600">{u.email}</td>
                    <td className="py-3">
                      <span className="text-sm">{u.roles.join(', ') || '—'}</span>
                    </td>
                    <td className="py-3">
                      {u.roles.includes('Admin') ? (
                        <div className="flex gap-2 items-center">
                          <span className="text-green-600 text-sm font-medium">Admin</span>
                          {user && user.id !== u.id && (
                            <button
                              type="button"
                              onClick={() => handleRequestDemotion(u.id)}
                              disabled={actingId === u.id}
                              className="px-3 py-1 rounded-lg bg-red-100 text-red-700 text-xs hover:bg-red-200 disabled:opacity-50"
                            >
                              {actingId === u.id ? '…' : 'Request remove admin'}
                            </button>
                          )}
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAssignAdmin(u.id)}
                          disabled={actingId === u.id}
                          className="px-3 py-1 rounded-lg bg-slate-700 text-white text-sm hover:bg-slate-800 disabled:opacity-50"
                        >
                          {actingId === u.id ? '…' : 'Make Admin'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-xl font-bold text-slate-800 mb-4">Admin demotion requests</h2>
          {demotions.length === 0 ? (
            <p className="text-slate-500">No pending admin role change requests.</p>
          ) : (
            <div className="space-y-4">
              {demotions.map((r) => (
                <div
                  key={r.id}
                  className="bg-white rounded-2xl shadow border border-slate-100 p-5 flex flex-wrap justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700">
                      Remove admin role from <span className="font-semibold">{r.targetName}</span> (
                      {r.targetEmail})
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Requested by {r.createdByName} • Approvals: {r.approvalsCount}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleApproveDemotion(r.id)}
                      disabled={actingId === r.id}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-white text-sm font-medium hover:bg-slate-900 disabled:opacity-50"
                    >
                      {actingId === r.id ? '…' : 'Approve'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
      </div>
    </div>
  );
}

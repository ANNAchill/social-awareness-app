import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../api';
import { useAuth } from '../AuthContext';

export default function CampaignCreate() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [impactGoal, setImpactGoal] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [showMore, setShowMore] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading } = useAuth();

  if (authLoading) return null;
  if (isAdmin) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) {
      setError('Campaign title is required.');
      return;
    }
    setLoading(true);
    try {
      await api.campaigns.create({
        title: title.trim(),
        description: description.trim() || undefined,
        impactGoal: impactGoal.trim() || undefined,
        images,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create campaign. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 text-white py-24 px-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23fff\' fill-opacity=\'0.04\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-80" />
        <div className="container mx-auto relative max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-acs-teal font-semibold text-sm uppercase tracking-wider mb-4"
          >
            Create Campaign
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
          >
            Create Social Campaign
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-300"
          >
            Fill in the details to start your awareness movement.
          </motion.p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8"
        >
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-700 text-sm border border-red-100">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Campaign Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-acs-teal focus:ring-2 focus:ring-teal-500/20 outline-none transition"
                placeholder="e.g. Clean Water for All"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-acs-teal focus:ring-2 focus:ring-teal-500/20 outline-none resize-none transition"
                placeholder="Describe the purpose and impact..."
              />
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <button
                type="button"
                onClick={() => setShowMore((v) => !v)}
                className="w-full flex items-center justify-between text-left"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-800">More options (optional)</p>
                  <p className="text-xs text-slate-500 mt-0.5">Add goal and photos to make your post stand out.</p>
                </div>
                <span className="text-slate-500 text-sm">{showMore ? '−' : '+'}</span>
              </button>

              {showMore && (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Impact Goal</label>
                    <input
                      value={impactGoal}
                      onChange={(e) => setImpactGoal(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-acs-teal focus:ring-2 focus:ring-teal-500/20 outline-none bg-white transition"
                      placeholder="e.g. 5,000 signatures or $10k raised"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Photos</label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => setImages(Array.from(e.target.files ?? []))}
                      className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-slate-800 file:text-white file:font-semibold hover:file:bg-slate-900"
                    />
                    {images.length > 0 && (
                      <p className="mt-2 text-xs text-slate-500">
                        Selected {images.length} photo{images.length === 1 ? '' : 's'}.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-acs-teal text-white font-semibold hover:bg-acs-teal-dark disabled:opacity-60 transition-colors"
              >
                {loading ? 'Submitting…' : 'Submit for Approval'}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </section>
    </div>
  );
}

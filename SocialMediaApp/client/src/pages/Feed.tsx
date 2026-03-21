import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api';

type Post = { id: number; authorName: string; content: string; createdAt: string; likes: number };

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [authorName, setAuthorName] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [likingId, setLikingId] = useState<number | null>(null);

  const load = () => api.feed.list().then(setPosts).finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      await api.feed.create({ authorName: authorName || undefined, content: content.trim() });
      setContent('');
      load();
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (id: number) => {
    setLikingId(id);
    try {
      const updated = await api.feed.like(id);
      setPosts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    } finally {
      setLikingId(null);
    }
  };

  const formatDate = (s: string) => {
    const d = new Date(s);
    const now = new Date();
    const diff = (now.getTime() - d.getTime()) / 60000;
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${Math.floor(diff)}m ago`;
    return d.toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col">
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 text-white py-20 px-4">
          <div className="container mx-auto max-w-3xl text-center">
            <div className="h-4 w-24 bg-slate-600 rounded mx-auto mb-4 animate-pulse" />
            <div className="h-10 w-40 bg-slate-600 rounded mx-auto animate-pulse" />
          </div>
        </section>
        <div className="container mx-auto px-4 py-12 flex justify-center max-w-2xl">
          <div className="w-10 h-10 border-2 border-acs-teal border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

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
            Community
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
          >
            Community Feed
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-300"
          >
            Share updates and connect with the community.
          </motion.p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-8"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Your name (optional)"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-acs-teal focus:ring-2 focus:ring-teal-500/20 outline-none transition"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share something with the community..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-acs-teal focus:ring-2 focus:ring-teal-500/20 outline-none resize-none transition"
              required
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-acs-teal text-white font-semibold hover:bg-acs-teal-dark disabled:opacity-60 transition-colors"
              >
                {submitting ? 'Posting…' : 'Post'}
              </button>
            </div>
          </form>
        </motion.div>

        {posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-teal-100 text-teal-600 text-4xl flex items-center justify-center mx-auto mb-6">
              💬
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">No posts yet</h2>
            <p className="text-slate-600">Be the first to share something!</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {posts.map((post, i) => (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md hover:border-teal-100 transition-all"
                >
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 text-white font-bold flex items-center justify-center shrink-0">
                      {(post.authorName || '?').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-slate-800">{post.authorName || 'Anonymous'}</span>
                        <span className="text-slate-400 text-sm">{formatDate(post.createdAt)}</span>
                      </div>
                      <p className="mt-2 text-slate-700 whitespace-pre-wrap">{post.content}</p>
                      <button
                        type="button"
                        onClick={() => handleLike(post.id)}
                        disabled={likingId === post.id}
                        className="mt-3 inline-flex items-center gap-1 text-slate-500 hover:text-acs-teal text-sm font-medium disabled:opacity-50 transition-colors"
                      >
                        ♥ Like {post.likes > 0 && `(${post.likes})`}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
    </div>
  );
}

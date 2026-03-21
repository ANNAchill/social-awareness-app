import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../api';
import { useAuth } from '../AuthContext';

type Campaign = { id: number; title: string; description: string; impactGoal: string; status: string; images: string[] };

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 260, damping: 24 },
  },
};

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden animate-pulse">
      <div className="h-48 bg-slate-200" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-slate-200 rounded w-3/4" />
        <div className="h-4 bg-slate-100 rounded w-full" />
        <div className="h-4 bg-slate-100 rounded w-5/6" />
        <div className="h-4 bg-slate-100 rounded w-4/6" />
        <div className="flex gap-2 pt-2">
          <div className="h-9 flex-1 bg-slate-100 rounded-lg" />
          <div className="h-9 flex-1 bg-slate-100 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default function Campaigns() {
  const { isAdmin } = useAuth();
  const [list, setList] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    api.campaigns.list().then(setList).finally(() => setLoading(false));
  }, []);

  const DESCRIPTION_PREVIEW_LENGTH = 180;

  if (loading) {
    return (
      <div className="min-h-screen">
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 text-white py-20 px-4">
          <div className="container mx-auto max-w-3xl text-center">
            <div className="h-4 w-24 bg-slate-600 rounded mx-auto mb-4 animate-pulse" />
            <div className="h-10 w-56 bg-slate-600 rounded mx-auto mb-4 animate-pulse" />
            <div className="h-5 w-72 bg-slate-700 rounded mx-auto animate-pulse" />
          </div>
        </section>
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="space-y-6">
            {[1, 2, 3].map((k) => (
              <SkeletonCard key={k} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 text-white py-24 px-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23fff\' fill-opacity=\'0.04\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-80" />
        <div className="container mx-auto relative max-w-4xl flex flex-wrap justify-between items-center gap-6">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-acs-teal font-semibold text-sm uppercase tracking-wider mb-2"
            >
              Campaigns
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-4xl md:text-5xl font-bold tracking-tight mb-2"
            >
              Social Campaigns
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-300"
            >
              Awareness movements from the community
            </motion.p>
          </div>
          {!isAdmin && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
              <Link
                to="/campaigns/create"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-colors shadow-lg"
              >
                <span className="text-lg">+</span>
                New Campaign
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 max-w-2xl">

        {list.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-teal-100 text-teal-600 text-4xl flex items-center justify-center mx-auto mb-6">
              📢
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">No campaigns yet</h2>
            <p className="text-slate-600 mb-8 max-w-sm mx-auto">
              Be the first to create a social awareness campaign and inspire others.
            </p>
            {!isAdmin && (
              <Link
                to="/campaigns/create"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-acs-teal text-white font-semibold hover:bg-acs-teal-dark transition-colors"
              >
                Create Campaign
              </Link>
            )}
          </motion.div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-5"
          >
            {list.map((c) => {
              const isLong = (c.description?.length ?? 0) > DESCRIPTION_PREVIEW_LENGTH;
              const isExpanded = expandedId === c.id;
              const showPreview = isLong && !isExpanded;

              return (
                <motion.article
                  key={c.id}
                  variants={item}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg hover:border-teal-100 transition-all duration-300"
                  whileHover={{ y: -2 }}
                >
                  {/* Post header - Facebook style */}
                  <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white text-lg shadow-md">
                        📢
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-[15px]">Social Campaign</p>
                        <p className="text-xs text-slate-500">Community awareness</p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm ${
                        c.status === 'Approved'
                          ? 'bg-green-100 text-green-700'
                          : c.status === 'Rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>

                  {/* Title - prominent */}
                  <div className="px-4 pt-4 pb-1">
                    <h2 className="text-lg font-bold text-slate-800 leading-snug">
                      {c.title}
                    </h2>
                  </div>

                  {/* Image with hover zoom */}
                  {c.images?.[0] ? (
                    <motion.div
                      className="aspect-[16/9] bg-slate-100 overflow-hidden cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      <img
                        src={c.images[0]}
                        alt={c.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="h-16 bg-gradient-to-t from-black/20 to-transparent pointer-events-none -mt-16" />
                    </motion.div>
                  ) : (
                    <div className="aspect-[16/9] bg-gradient-to-br from-teal-50 to-slate-100 flex items-center justify-center">
                      <motion.span
                        className="text-5xl"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        📢
                      </motion.span>
                    </div>
                  )}

                  {/* Body */}
                  <div className="px-4 py-4">
                    <div className="text-slate-600 text-[15px] leading-relaxed">
                      {showPreview ? (
                        <>
                          {c.description.slice(0, DESCRIPTION_PREVIEW_LENGTH)}...
                          <button
                            type="button"
                            onClick={() => setExpandedId(c.id)}
                            className="text-acs-teal font-semibold ml-1 hover:underline"
                          >
                            See more
                          </button>
                        </>
                      ) : (
                        <>
                          {c.description || 'No description.'}
                          {isLong && isExpanded && (
                            <button
                              type="button"
                              onClick={() => setExpandedId(null)}
                              className="text-acs-teal font-semibold ml-1 hover:underline block mt-1"
                            >
                              See less
                            </button>
                          )}
                        </>
                      )}
                    </div>

                    {/* Goal callout */}
                    {c.impactGoal && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 p-3 rounded-xl bg-teal-50 border border-teal-100"
                      >
                        <p className="text-sm text-teal-800">
                          <span className="font-semibold">Goal:</span> {c.impactGoal}
                        </p>
                      </motion.div>
                    )}

                    {/* Photo strip when multiple images */}
                    {c.images && c.images.length > 1 && (
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                          Photos
                        </p>
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                          {c.images.slice(0, 6).map((src, j) => (
                            <motion.div
                              key={j}
                              whileHover={{ scale: 1.05 }}
                              className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-slate-100 ring-2 ring-slate-200/80 shadow-sm"
                            >
                              <img
                                src={src}
                                alt=""
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </motion.div>
                          ))}
                          {c.images.length > 6 && (
                            <div className="w-20 h-20 shrink-0 rounded-xl bg-slate-200 flex items-center justify-center text-sm font-semibold text-slate-600">
                              +{c.images.length - 6}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer - engagement style */}
                  <div className="px-4 py-2 border-t border-slate-100 flex items-center justify-between text-slate-500 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs">
                        ✓
                      </span>
                      <span className="text-slate-500">Support</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="hover:text-slate-700 cursor-default transition-colors">
                        Share
                      </span>
                      <span className="hover:text-slate-700 cursor-default transition-colors">
                        Follow
                      </span>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}

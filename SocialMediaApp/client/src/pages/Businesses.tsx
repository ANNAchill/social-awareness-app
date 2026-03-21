import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../api';

type Business = { id: number; name: string; industry: string; website?: string; city?: string };

export default function Businesses() {
  const [list, setList] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.businesses.list().then(setList).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col">
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 text-white py-20 px-4">
          <div className="container mx-auto max-w-3xl text-center">
            <div className="h-4 w-24 bg-slate-600 rounded mx-auto mb-4 animate-pulse" />
            <div className="h-10 w-72 bg-slate-600 rounded mx-auto mb-4 animate-pulse" />
            <div className="h-5 w-96 bg-slate-700 rounded mx-auto animate-pulse" />
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
        <div className="container mx-auto relative max-w-4xl">
          <div className="flex flex-wrap justify-between items-center gap-6">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-acs-teal font-semibold text-sm uppercase tracking-wider mb-2"
              >
                Directory
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="text-4xl md:text-5xl font-bold tracking-tight mb-2"
              >
                Small Business Directory
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg text-slate-300"
              >
                Discover local businesses and community-focused services.
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              <Link
                to="/businesses/create"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-colors shadow-lg"
              >
                Add Business Ad
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        {list.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center max-w-lg mx-auto"
          >
            <div className="w-20 h-20 rounded-2xl bg-orange-100 text-orange-600 text-4xl flex items-center justify-center mx-auto mb-6">
              🏪
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">No businesses yet</h2>
            <p className="text-slate-600 mb-8">Add your business to the directory and reach the community.</p>
            <Link
              to="/businesses/create"
              className="inline-flex px-6 py-3 rounded-xl bg-acs-teal text-white font-semibold hover:bg-acs-teal-dark transition-colors"
            >
              Add Business
            </Link>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {list.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-lg hover:border-teal-100 transition-all"
              >
                <h3 className="text-xl font-bold text-slate-800 mb-1">{b.name}</h3>
                <p className="text-slate-500 text-sm mb-2">{b.industry}</p>
                {b.city && <p className="text-slate-400 text-sm mb-3">{b.city}</p>}
                {b.website && (
                  <a
                    href={b.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-acs-teal font-semibold text-sm hover:underline"
                  >
                    Visit website →
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NewsMedia() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 text-white py-24 px-4">
        <div className="container mx-auto max-w-3xl text-center relative">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-acs-teal font-semibold text-sm uppercase tracking-wider mb-4"
          >
            News & Media
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
          >
            Stories and Updates
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-300"
          >
            Latest campaigns, community wins, and platform updates — all in one place.
          </motion.p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="text-slate-600 mb-8">
            Our live campaigns and community feed are the best place to see what’s happening right now.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/campaigns"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-acs-teal text-white font-semibold hover:bg-acs-teal-dark transition-colors"
            >
              View Campaigns
            </Link>
            <Link
              to="/feed"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
            >
              Community Feed
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="bg-slate-50 py-16 border-t border-slate-100">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-600 mb-2">Have a story or press inquiry?</p>
          <Link to="/contact" className="text-acs-teal font-semibold hover:underline">
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}

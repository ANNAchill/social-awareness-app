import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const features = [
  {
    title: 'Campaigns',
    description: 'Create, discover, and support social awareness campaigns. Every campaign is reviewed for authenticity.',
    to: '/campaigns',
    icon: '📢',
  },
  {
    title: 'Business Directory',
    description: 'Promote local businesses and community-focused services. Connect with your neighborhood.',
    to: '/businesses',
    icon: '🏪',
  },
  {
    title: 'Member Dashboard',
    description: 'Track your campaigns, manage your profile, and see your impact in one place.',
    to: '/dashboard',
    icon: '📊',
  },
  {
    title: 'Community Feed',
    description: 'Stay updated with the latest from campaigns and the community in a single feed.',
    to: '/feed',
    icon: '💬',
  },
];

export default function WhatWeDo() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-20 px-4 border-b border-slate-100">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-acs-teal font-semibold text-sm uppercase tracking-wider mb-4"
          >
            What We Do
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight mb-6"
          >
            We Connect People and Causes
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600"
          >
            From campaigns and local businesses to dashboards and feeds — one platform for community impact.
          </motion.p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.to}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6 }}
            >
              <Link to={f.to}>
                <div className="h-full bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-lg hover:border-teal-100 transition-all">
                  <div className="text-3xl mb-4">{f.icon}</div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">{f.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{f.description}</p>
                  <span className="inline-flex items-center gap-1 mt-4 text-acs-teal font-semibold text-sm">
                    Learn more <span>→</span>
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-300 mb-6">Ready to make an impact?</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}

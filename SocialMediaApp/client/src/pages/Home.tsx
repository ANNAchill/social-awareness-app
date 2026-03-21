import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const features = [
  {
    title: 'Social Campaigns',
    description: 'Explore and support social awareness campaigns that matter to you. Create your own or back others.',
    to: '/campaigns',
    icon: '📢',
    color: 'from-teal-500 to-teal-700',
    delay: 0,
  },
  {
    title: 'Business Directory',
    description: 'Discover local businesses and community-focused services. Connect with your neighborhood.',
    to: '/businesses',
    icon: '🏪',
    color: 'from-orange-500 to-orange-700',
    delay: 0.1,
  },
  {
    title: 'Member Dashboard',
    description: 'Manage your campaigns, track impact, and keep everything in one place.',
    to: '/dashboard',
    icon: '📊',
    color: 'from-teal-500 to-teal-700',
    delay: 0.2,
  },
];

const stats = [
  { value: 'Community-first', label: 'Approach' },
  { value: 'Transparent', label: 'Campaigns' },
  { value: 'Real impact', label: 'Focus' },
];

export default function Home() {
  return (
    <div>
      {/* Hero — Fizens-style: bold headline, subtext, dual CTA */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white py-24 md:py-32 px-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23fff\' fill-opacity=\'0.04\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-80" />
        <div className="container mx-auto relative text-center max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-acs-teal font-semibold text-sm uppercase tracking-wider mb-6"
          >
            Social Awareness Platform
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-[1.1]"
          >
            Start Managing Your Community Impact With Our Tool
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto"
          >
            Create campaigns, promote local businesses, and connect with your community — all in one place.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-slate-900 font-semibold shadow-lg hover:bg-slate-100 transition-all"
            >
              Get Started Free
            </Link>
            <Link
              to="/campaigns"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border-2 border-slate-500 text-white font-semibold hover:bg-white/10 transition-colors"
            >
              Browse Campaigns
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-16 flex flex-wrap justify-center gap-10 text-slate-400 text-sm"
          >
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="font-bold text-white text-lg">{s.value}</div>
                <div>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Key features — Fizens-style “Explore Our Standout Features” */}
      <section className="container mx-auto px-4 py-20 md:py-28">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-acs-teal font-semibold text-sm uppercase tracking-wider mb-4"
          >
            Key Features
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight"
          >
            Explore Our Standout Features
          </motion.h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f) => (
            <motion.div
              key={f.to}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + f.delay }}
              whileHover={{ y: -6 }}
              className="group"
            >
              <Link to={f.to}>
                <div className="h-full bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 p-6 hover:shadow-xl hover:border-teal-100 transition-all">
                  <div
                    className={`inline-flex w-14 h-14 rounded-xl bg-gradient-to-br ${f.color} text-white text-2xl items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{f.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{f.description}</p>
                  <span className="inline-flex items-center gap-1 mt-4 text-acs-teal font-semibold text-sm">
                    Explore <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefit strip — “Experience the future” style */}
      <section className="bg-slate-50 border-y border-slate-100 py-20">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-slate-800 mb-4"
          >
            One Platform for Community Impact
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-slate-600 mb-10"
          >
            Create campaigns, support causes, and connect with local businesses — with transparency and trust at the core.
          </motion.p>
          <Link
            to="/what-we-do"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-acs-teal text-white font-semibold hover:bg-acs-teal-dark transition-colors"
          >
            What We Do
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-slate-900 text-white py-20 px-4">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Your First Step to Community Impact Begins Here
          </h2>
          <p className="text-slate-300 mb-8">
            Join the platform and start creating or supporting campaigns today.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
}

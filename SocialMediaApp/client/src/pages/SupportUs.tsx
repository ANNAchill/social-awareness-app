import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ways = [
  {
    title: 'Start or support a campaign',
    description: 'Create a campaign or back existing ones. Every action counts.',
    to: '/campaigns',
    cta: 'Go to Campaigns',
  },
  {
    title: 'Spread the word',
    description: 'Share campaigns and the platform with your network to grow impact.',
    to: '/campaigns',
    cta: 'Share Campaigns',
  },
  {
    title: 'Join as a member',
    description: 'Register to launch campaigns, use the dashboard, and connect with the community.',
    to: '/register',
    cta: 'Register',
  },
];

export default function SupportUs() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-600 to-teal-700 text-white py-24 px-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23fff\' fill-opacity=\'0.06\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-90" />
        <div className="container mx-auto max-w-3xl text-center relative">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-teal-200 font-semibold text-sm uppercase tracking-wider mb-4"
          >
            Support Us
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
          >
            Help Us Grow Our Impact
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-teal-100"
          >
            Your support — whether by campaigning, sharing, or joining — helps the whole community.
          </motion.p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {ways.map((w, i) => (
            <motion.div
              key={w.to}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-lg hover:border-teal-100 transition-all"
            >
              <h3 className="text-xl font-bold text-slate-800 mb-3">{w.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">{w.description}</p>
              <Link
                to={w.to}
                className="inline-flex items-center gap-1 text-acs-teal font-semibold hover:underline"
              >
                {w.cta} →
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-600 mb-4">Questions about how you can support?</p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-acs-teal text-white font-semibold hover:bg-acs-teal-dark transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}

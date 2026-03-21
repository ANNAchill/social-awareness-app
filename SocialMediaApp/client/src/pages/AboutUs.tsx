import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AboutUs() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 text-white py-24 px-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23fff\' fill-opacity=\'0.04\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-80" />
        <div className="container mx-auto relative max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-acs-teal font-semibold text-sm uppercase tracking-wider mb-4"
          >
            About Us
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
          >
            We Believe in Community Impact
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-300 max-w-2xl mx-auto"
          >
            Our platform connects people, campaigns, and local businesses to drive social awareness and positive change.
          </motion.p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="prose prose-slate max-w-none"
          >
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Our Mission</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We empower individuals and organizations to launch and support social campaigns, promote local businesses, and build a more connected community.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Transparency, trust, and impact are at the heart of everything we do. Every campaign on our platform is reviewed to ensure authenticity and real-world impact.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-teal-500/10 to-slate-100 rounded-2xl p-8 border border-slate-100"
          >
            <h3 className="font-bold text-slate-800 mb-4">Our Values</h3>
            <ul className="space-y-3 text-slate-600">
              {['Community first', 'Transparency & trust', 'Inclusive participation', 'Measurable impact'].map((v, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-acs-teal" />
                  {v}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link
              to="/campaigns"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-acs-teal text-white font-semibold hover:bg-acs-teal-dark transition-colors"
            >
              Explore Campaigns
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

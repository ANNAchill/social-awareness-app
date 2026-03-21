import { motion } from 'framer-motion';

export default function ContactUs() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-20 px-4 border-b border-slate-100">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-acs-teal font-semibold text-sm uppercase tracking-wider mb-4"
          >
            Contact Us
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight mb-6"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600"
          >
            Have a question, partnership idea, or press inquiry? We’d love to hear from you.
          </motion.p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto"
        >
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-acs-teal focus:border-acs-teal outline-none transition"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-acs-teal focus:border-acs-teal outline-none transition"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-acs-teal focus:border-acs-teal outline-none transition resize-none"
                  placeholder="Your message..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-acs-teal text-white font-semibold hover:bg-acs-teal-dark transition-colors"
              >
                Send Message
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-slate-500">
              We’ll get back to you as soon as we can. For urgent matters, please mention it in your message.
            </p>
          </div>
        </motion.div>
      </section>

      <section className="bg-slate-900 text-slate-300 py-12">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>ACS Social Awareness Platform — Building community impact together.</p>
        </div>
      </section>
    </div>
  );
}

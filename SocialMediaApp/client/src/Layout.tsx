import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from './AuthContext';

const mainNav = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/what-we-do', label: 'What We Do' },
  { to: '/news', label: 'News & Media' },
  { to: '/support', label: 'Support Us' },
  { to: '/contact', label: 'Contact Us' },
];

const memberExtraNav = [
  { to: '/campaigns', label: 'Campaigns' },
  { to: '/businesses', label: 'Directory' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/my-campaigns', label: 'My Campaigns' },
  { to: '/feed', label: 'Feed' },
];

const adminExtraNav = [
  { to: '/campaigns', label: 'Campaigns' },
  { to: '/admin', label: 'Admin' },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();
  const extraNav = isAdmin ? adminExtraNav : user ? memberExtraNav : [{ to: '/campaigns', label: 'Campaigns' }];
  const [portalOpen, setPortalOpen] = useState(false);

  useEffect(() => {
    // Close dropdown when route changes
    setPortalOpen(false);
  }, [location.pathname]);

  const isActive = (to: string) =>
    location.pathname === to || (to !== '/' && location.pathname.startsWith(to));

  const memberDropdownNav = memberExtraNav.filter((item) => item.to !== '/campaigns');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-between h-16 lg:h-18">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="font-bold text-slate-800 text-xl tracking-tight">ACS</span>
            <span className="text-slate-500 text-sm hidden sm:inline">Social Awareness</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {mainNav.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(to) ? 'bg-teal-50 text-acs-teal' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                {label}
              </Link>
            ))}

            {/* Extra navigation: keep clean by grouping member links into a dropdown */}
            {user && !isAdmin && (
              <>
                {/* Primary member link */}
                <Link
                  to="/campaigns"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/campaigns')
                      ? 'bg-teal-50 text-acs-teal'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                  }`}
                >
                  Campaigns
                </Link>

                {/* Dropdown with profile-related links to avoid clutter */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setPortalOpen((v) => !v)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors ${
                      memberDropdownNav.some((item) => isActive(item.to))
                        ? 'bg-teal-50 text-acs-teal'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                    }`}
                  >
                    My Area
                    <span className="text-xs">{portalOpen ? '▴' : '▾'}</span>
                  </button>
                  {portalOpen && (
                    <div className="absolute right-0 mt-2 w-44 rounded-xl bg-white shadow-lg border border-slate-100 py-1 z-50">
                      {memberDropdownNav.map(({ to, label }) => (
                        <Link
                          key={to}
                          to={to}
                          className={`block px-3 py-2 text-sm rounded-lg mb-0.5 ${
                            isActive(to)
                              ? 'bg-teal-50 text-acs-teal'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          {label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Admin extra links stay simple (few items) */}
            {isAdmin &&
              adminExtraNav.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(to) ? 'bg-teal-50 text-acs-teal' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                  }`}
                >
                  {label}
                </Link>
              ))}

            {/* Guest sees only Campaigns as before */}
            {!user &&
              extraNav.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(to) ? 'bg-teal-50 text-acs-teal' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                  }`}
                >
                  {label}
                </Link>
              ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            {user ? (
              <>
                <span className="text-sm text-slate-600 truncate max-w-[120px] hidden sm:inline">{user.fullName}</span>
                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                    navigate('/');
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl bg-acs-teal text-white text-sm font-semibold hover:bg-acs-teal-dark transition-colors shadow-sm"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile nav: main + extra links */}
        <nav className="lg:hidden flex flex-wrap items-center gap-1 px-4 pb-3 pt-0 border-t border-slate-100">
          {mainNav.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-2 py-1.5 rounded text-xs font-medium ${isActive(to) ? 'bg-teal-50 text-acs-teal' : 'text-slate-600'}`}
            >
              {label}
            </Link>
          ))}
          {extraNav.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-2 py-1.5 rounded text-xs font-medium ${isActive(to) ? 'bg-teal-50 text-acs-teal' : 'text-slate-600'}`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="flex-1">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Outlet />
        </motion.div>
      </main>

      <footer className="bg-slate-900 text-slate-300 mt-auto">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div>
              <p className="font-semibold text-white mb-3">Main</p>
              <ul className="space-y-2 text-sm">
                {['Home', 'About Us', 'What We Do', 'News & Media', 'Support Us', 'Contact Us'].map((label, i) => {
                  const to = ['/', '/about', '/what-we-do', '/news', '/support', '/contact'][i];
                  return (
                    <li key={to}>
                      <Link to={to} className="hover:text-white transition-colors">
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-white mb-3">Platform</p>
              <ul className="space-y-2 text-sm">
                <li><Link to="/campaigns" className="hover:text-white transition-colors">Campaigns</Link></li>
                <li><Link to="/businesses" className="hover:text-white transition-colors">Directory</Link></li>
                <li><Link to="/feed" className="hover:text-white transition-colors">Feed</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-white mb-3">Account</p>
              <ul className="space-y-2 text-sm">
                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-white mb-3">ACS Social Awareness</p>
              <p className="text-sm text-slate-400">
                Connecting people, campaigns, and local businesses for community impact.
              </p>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-700 text-center text-sm text-slate-400">
            © {new Date().getFullYear()} ACS Social Awareness Platform
          </div>
        </div>
      </footer>
    </div>
  );
}

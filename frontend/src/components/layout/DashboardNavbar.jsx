import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function DashboardNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [initials, setInitials] = useState('AV');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('skillswap_user');
      if (stored) {
        const u = JSON.parse(stored);
        if (u && u.name && typeof u.name === 'string') {
          const parts = u.name.trim().split(/\s+/).filter(Boolean);
          const init = parts.map((p) => p[0] || '').join('').substring(0, 2).toUpperCase() || 'SS';
          setInitials(init);
        }
      }
    } catch (e) {
      // fallback
    }
  }, []);

  const links = [
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'Explore', to: '/explore' },
    { label: 'Requests', to: '/requests' },
    { label: 'Active Swaps', to: '/swaps' },
    { label: 'Profile', to: '/profile' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('skillswap_token');
    localStorage.removeItem('skillswap_user');
    navigate('/');
  };

  const isActive = (to) => location.pathname === to;

  return (
    <nav className="sticky top-0 z-40 glass border-b border-white/40">
      <div className="section-padding">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center gap-2 shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-md group-hover:rotate-12 transition-transform duration-300">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-gray-800 hidden sm:block">
              Skill<span className="gradient-text">Swap</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive(link.to)
                    ? 'bg-gradient-to-r from-primary-100 to-accent-100 text-primary-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white font-semibold text-sm shadow-md hover:scale-110 transition-transform duration-200">
              {initials}
            </div>
            <button onClick={handleLogout} className="px-4 py-2 text-gray-600 font-medium hover:text-red-500 transition-colors text-sm">
              Logout
            </button>
          </div>

          <button
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span className="text-2xl">{mobileOpen ? '✕' : '☰'}</span>
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 animate-slide-down">
            <div className="flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-xl font-medium transition-all ${
                    isActive(link.to) ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <button onClick={handleLogout} className="text-left px-4 py-3 text-red-500 font-medium hover:bg-red-50 rounded-xl transition-colors">
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

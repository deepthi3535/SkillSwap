import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function DashboardNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'Explore', to: '/explore' },
    { label: 'Requests', to: '/requests' },
    { label: 'Active Swaps', to: '/swaps' },
    { label: 'Profile', to: '/profile' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('skillswap_token');
    navigate('/');
  };

  const isActive = (to) => location.pathname === to;

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="section-padding">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-gray-800 hidden sm:block">
              Skill<span className="text-primary-600">Swap</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  isActive(link.to)
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white font-semibold text-sm">
              AV
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-600 font-medium hover:text-red-500 transition-colors text-sm"
            >
              Logout
            </button>
          </div>

          <button
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100"
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
                  className={`px-4 py-3 rounded-lg font-medium transition-all ${
                    isActive(link.to)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="text-left px-4 py-3 text-red-500 font-medium hover:bg-red-50 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

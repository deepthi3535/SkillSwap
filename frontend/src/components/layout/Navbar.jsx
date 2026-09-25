import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Explore', to: '/explore' },
    { label: 'How It Works', to: '/#how-it-works' },
  ];

  const handleNavClick = (to) => {
    setMobileOpen(false);
    if (to.includes('#')) {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(to.split('#')[1]);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      navigate(to);
    }
  };

  return (
    <nav className="sticky top-0 z-40 glass border-b border-white/40">
      <div className="section-padding">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-md group-hover:rotate-12 transition-transform duration-300">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-gray-800">
              Skill<span className="gradient-text">Swap</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.to)}
                className="text-gray-600 font-medium hover:text-primary-600 transition-colors link-underline"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="px-5 py-2 text-primary-600 font-medium hover:text-primary-700 transition-colors">
              Login
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 text-white font-semibold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shadow-md"
              style={{ backgroundImage: 'linear-gradient(135deg, #6366f1, #4f46e5, #0ea5e9)', backgroundSize: '200% 100%' }}
            >
              Get Started
            </Link>
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
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.to)}
                  className="text-left px-4 py-3 text-gray-600 font-medium hover:bg-gray-50 rounded-xl transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <div className="flex gap-3 px-4 pt-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center px-5 py-2.5 text-primary-600 font-medium border border-primary-200 rounded-xl">
                  Login
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 text-center px-5 py-2.5 bg-primary-600 text-white font-semibold rounded-xl">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

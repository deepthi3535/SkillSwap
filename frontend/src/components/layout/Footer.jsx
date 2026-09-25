import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="section-padding py-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold text-white">
                Skill<span className="gradient-text">Swap</span>
              </span>
            </div>
            <p className="text-gray-400 max-w-md leading-relaxed">
              SkillSwap is a peer-to-peer skill exchange platform for students.
              Learn what you want, teach what you know, and grow together.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-primary-400 transition-colors link-underline">Home</Link></li>
              <li><Link to="/explore" className="hover:text-primary-400 transition-colors link-underline">Explore</Link></li>
              <li><Link to="/register" className="hover:text-primary-400 transition-colors link-underline">Register</Link></li>
              <li><Link to="/login" className="hover:text-primary-400 transition-colors link-underline">Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="/#how-it-works" className="hover:text-primary-400 transition-colors link-underline">How It Works</a></li>
              <li><a href="/#features" className="hover:text-primary-400 transition-colors link-underline">Features</a></li>
              <li><a href="/#faq" className="hover:text-primary-400 transition-colors link-underline">FAQ</a></li>
              <li><a href="/" className="hover:text-primary-400 transition-colors link-underline">Support</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">© 2026 SkillSwap. Built for students, by students.</p>
          <div className="flex gap-4">
            <a href="/" className="text-gray-400 hover:text-primary-400 transition-colors">Twitter</a>
            <a href="/" className="text-gray-400 hover:text-primary-400 transition-colors">LinkedIn</a>
            <a href="/" className="text-gray-400 hover:text-primary-400 transition-colors">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

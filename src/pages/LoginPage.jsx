import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Button from '../components/ui/Button';

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); navigate('/dashboard'); }, 1000);
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-mesh-1 relative overflow-hidden">
        {/* Floating decorative blobs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl animate-float pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-accent-200/30 rounded-full blur-3xl animate-float-slow pointer-events-none"></div>

        <div className="w-full max-w-md relative animate-slide-up">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg animate-glow-pulse">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-2xl font-bold text-gray-800">
                Skill<span className="gradient-text">Swap</span>
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Login to continue your skill exchange journey.</p>
          </div>

          <div className="glass rounded-3xl p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="aakash@college.edu" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <input type="password" name="password" required value={formData.password} onChange={handleChange} placeholder="••••••••" className="input-field" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-200" />
                  Remember me
                </label>
                <a href="/" className="text-primary-600 font-medium hover:text-primary-700 transition-colors link-underline">Forgot password?</a>
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
            <p className="text-center text-gray-600 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors link-underline">Register here</Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

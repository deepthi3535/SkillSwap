import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Button from '../components/ui/Button';
import { authAPI } from '../services/api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', college: '', location: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        name: (formData.fullName || '').trim(),
        fullName: (formData.fullName || '').trim(),
        email: (formData.email || '').trim(),
        password: formData.password,
        college: (formData.college || '').trim(),
        location: (formData.location || '').trim(),
        skillsTeach: ['JavaScript', 'HTML/CSS'],
        skillsLearn: ['React', 'Python'],
        experience: 'Intermediate',
        learningMode: 'Online',
      };
      const res = await authAPI.register(payload);
      if (res.data.success || res.data.token) {
        if (res.data.token) {
          localStorage.setItem('skillswap_token', res.data.token);
        }
        if (res.data.user) {
          localStorage.setItem('skillswap_user', JSON.stringify(res.data.user));
        }
        navigate('/dashboard');
      } else {
        setError(res.data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      const serverMsg = err.response?.data?.message || err.message || 'Registration failed. Please check your details and try again.';
      setError(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-mesh-1 relative overflow-hidden">
        <div className="absolute top-10 right-10 w-80 h-80 bg-primary-200/30 rounded-full blur-3xl animate-float pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-accent-200/30 rounded-full blur-3xl animate-float-slow pointer-events-none"></div>

        <div className="w-full max-w-2xl relative animate-slide-up">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg animate-glow-pulse">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-2xl font-bold text-gray-800">
                Skill<span className="gradient-text">Swap</span>
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Your Account</h1>
            <p className="text-gray-600">Join the SkillSwap community and start exchanging skills.</p>
          </div>

          <div className="glass rounded-3xl p-8">
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} placeholder="Aakash Verma" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="aakash@college.edu" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                  <input type="password" name="password" required value={formData.password} onChange={handleChange} placeholder="••••••••" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">College</label>
                  <input type="text" name="college" required value={formData.college} onChange={handleChange} placeholder="IIT Kanpur" className="input-field" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                  <input type="text" name="location" required value={formData.location} onChange={handleChange} placeholder="Kanpur, India" className="input-field" />
                </div>
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? 'Creating Account...' : 'Register'}
              </Button>
            </form>
            <p className="text-center text-gray-600 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors link-underline">Login here</Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

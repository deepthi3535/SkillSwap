import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Button from '../components/ui/Button';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    college: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Placeholder — API integration via authAPI.register(formData)
    setTimeout(() => {
      setLoading(false);
      navigate('/login');
    }, 1000);
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-2xl font-bold text-gray-800">
                Skill<span className="text-primary-600">Swap</span>
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Your Account</h1>
            <p className="text-gray-600">Join the SkillSwap community and start exchanging skills.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Aakash Verma"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="aakash@college.edu"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">College</label>
                  <input
                    type="text"
                    name="college"
                    required
                    value={formData.college}
                    onChange={handleChange}
                    placeholder="IIT Kanpur"
                    className="input-field"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Kanpur, India"
                    className="input-field"
                  />
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? 'Creating Account...' : 'Register'}
              </Button>
            </form>

            <p className="text-center text-gray-600 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

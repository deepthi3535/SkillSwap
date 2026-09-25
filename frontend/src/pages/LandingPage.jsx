import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import SkillBadge from '../components/ui/SkillBadge';

const steps = [
  {
    icon: '📝',
    title: 'Create Your Profile',
    description: 'Sign up and list the skills you can teach and the skills you want to learn. Add your college, location, and availability.',
    gradient: 'from-primary-500 to-accent-500',
  },
  {
    icon: '🔍',
    title: 'Find Matches',
    description: 'Browse compatible users with our smart matching algorithm. See match percentages based on skill overlap.',
    gradient: 'from-accent-500 to-cyan-500',
  },
  {
    icon: '🤝',
    title: 'Send Swap Requests',
    description: 'Found someone with complementary skills? Send a swap request and start a conversation.',
    gradient: 'from-violet-500 to-primary-500',
  },
  {
    icon: '🚀',
    title: 'Learn & Teach Together',
    description: 'Once accepted, start your skill exchange. Track progress, complete swaps, and leave reviews.',
    gradient: 'from-emerald-500 to-teal-500',
  },
];

const features = [
  {
    icon: '🎯',
    title: 'Smart Matching',
    description: 'Our algorithm matches you with users whose teaching and learning goals complement yours.',
    gradient: 'from-primary-500 to-accent-500',
  },
  {
    icon: '📚',
    title: 'Skill Categories',
    description: 'From programming to photography, find peers across a wide range of skill categories.',
    gradient: 'from-accent-500 to-cyan-500',
  },
  {
    icon: '⭐',
    title: 'Ratings & Reviews',
    description: 'Build your reputation with ratings and reviews from completed skill swaps.',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: '🔒',
    title: 'College Verified',
    description: 'Connect with fellow students from verified college communities.',
    gradient: 'from-emerald-500 to-green-500',
  },
  {
    icon: '💬',
    title: 'Flexible Learning',
    description: 'Choose online, in-person, or hybrid learning modes that fit your schedule.',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    icon: '📊',
    title: 'Track Progress',
    description: 'Monitor your active swaps, pending requests, and completed exchanges in one place.',
    gradient: 'from-pink-500 to-rose-500',
  },
];

const popularSkills = [
  'React', 'Python', 'Node.js', 'Figma', 'Machine Learning',
  'Java', 'Photography', 'Spanish', 'Digital Marketing', 'Flutter',
];

export default function LandingPage() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-mesh-1">
        {/* Floating blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-80 h-80 bg-primary-300/30 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
          <div className="absolute top-20 right-1/4 w-80 h-80 bg-accent-300/30 rounded-full mix-blend-multiply filter blur-3xl animate-float-slow"></div>
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-violet-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}></div>

        <div className="relative section-padding py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-md text-primary-700 rounded-full text-sm font-semibold mb-6 border border-primary-100 shadow-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-glow-pulse"></span>
                🎓 Built for Students, by Students
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-800 leading-[1.15] mb-6">
                Learn What You Want.{' '}
                <span className="gradient-text">
                  Teach What You Know.
                </span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-xl">
                SkillSwap is a peer-to-peer platform where students exchange skills.
                List what you can teach, what you want to learn, and get matched with
                compatible peers from your college community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button to="/register" size="lg" className="group">
                  <span className="mr-1">Get Started — It's Free</span>
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Button>
                <Button to="/explore" variant="secondary" size="lg">
                  Explore Skills
                </Button>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-12">
                {[
                  { value: '500+', label: 'Active Students' },
                  { value: '1,200+', label: 'Skills Listed' },
                  { value: '50+', label: 'Colleges' },
                ].map((stat, i) => (
                  <div key={i} className={`animate-slide-up stagger-${i + 1}`}>
                    <p className="text-3xl font-extrabold bg-gradient-to-br from-gray-800 to-gray-600 bg-clip-text text-transparent">{stat.value}</p>
                    <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero visual */}
            <div className="hidden lg:block animate-fade-in">
              <div className="relative">
                {/* Glow behind cards */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 to-accent-400/20 blur-3xl scale-110"></div>

                <Card className="relative shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 ease-spring animate-float">
                  <div className="flex items-center gap-3 mb-4">
                    <img src="https://i.pravatar.cc/150?img=11" alt="User" className="w-12 h-12 rounded-full ring-2 ring-primary-200" />
                    <div>
                      <p className="font-bold text-gray-800">Rahul Kumar</p>
                      <p className="text-sm text-gray-500">IIT Delhi</p>
                    </div>
                    <div className="ml-auto bg-gradient-to-br from-green-500 to-emerald-500 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-md">
                      92% Match
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase mb-1">Teaches</p>
                      <div className="flex flex-wrap gap-1.5">
                        <SkillBadge skill="React" size="sm" />
                        <SkillBadge skill="Node.js" size="sm" />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase mb-1">Wants</p>
                      <div className="flex flex-wrap gap-1.5">
                        <SkillBadge skill="Python" type="learn" size="sm" />
                        <SkillBadge skill="SQL" type="learn" size="sm" />
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="absolute -bottom-8 -left-8 shadow-2xl -rotate-3 hover:rotate-0 transition-transform duration-500 ease-spring w-64 animate-float-slow">
                  <div className="flex items-center gap-3">
                    <img src="https://i.pravatar.cc/150?img=5" alt="User" className="w-12 h-12 rounded-full ring-2 ring-accent-200" />
                    <div>
                      <p className="font-bold text-gray-800 text-sm">Priya Sharma</p>
                      <p className="text-xs text-gray-500">NIT Trichy</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    <SkillBadge skill="Figma" size="sm" />
                    <SkillBadge skill="UI/UX" type="learn" size="sm" />
                  </div>
                </Card>

                {/* Floating skill bubble */}
                <div className="absolute -top-6 -right-4 bg-white/80 backdrop-blur-md shadow-lg rounded-2xl px-4 py-2 border border-primary-100 animate-bounce-soft">
                  <p className="text-xs font-semibold text-primary-600">🔥 5 new matches today</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular skills marquee */}
      <section className="py-12 bg-white border-y border-gray-50 relative overflow-hidden">
        <div className="section-padding">
          <p className="text-center text-gray-400 font-medium mb-6">Popular skills on SkillSwap</p>
          <div className="flex flex-wrap justify-center gap-3">
            {popularSkills.map((skill, i) => (
              <div key={skill} className={`animate-slide-up stagger-${(i % 5) + 1}`}>
                <SkillBadge skill={skill} size="lg" className="px-4 py-2 text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default glow-hover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 bg-gradient-to-b from-gray-50 to-white relative">
        <div className="section-padding">
          <div className="text-center mb-14">
            <div className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
              Simple Process
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Get started in minutes. Four simple steps to your first skill swap.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className={`animate-slide-up stagger-${idx + 1}`}>
                <Card hover className="text-center relative group h-full">
                  {/* Gradient number badge */}
                  <div className={`absolute -top-3 -right-3 w-9 h-9 bg-gradient-to-br ${step.gradient} text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 ease-spring`}>
                    {idx + 1}
                  </div>
                  {/* Icon with gradient glow */}
                  <div className={`relative inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br ${step.gradient} text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300 ease-spring`}>
                    <span className="filter drop-shadow-sm">{step.icon}</span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>

                  {/* Connecting arrow (except last) */}
                  {idx < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-6 text-primary-300 z-10">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </div>
                  )}
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-1/4 -left-20 w-60 h-60 bg-primary-100/40 rounded-full blur-3xl animate-float pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-20 w-60 h-60 bg-accent-100/40 rounded-full blur-3xl animate-float-slow pointer-events-none"></div>

        <div className="section-padding relative">
          <div className="text-center mb-14">
            <div className="inline-block px-4 py-1.5 bg-accent-100 text-accent-700 rounded-full text-sm font-semibold mb-4">
              Features
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-4">Why Choose SkillSwap?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Everything you need to exchange skills with peers efficiently and effectively.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className={`animate-slide-up stagger-${(idx % 3) + 1}`}>
                <Card hover className="group h-full overflow-hidden relative">
                  {/* Gradient sheen on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500 pointer-events-none`}></div>
                  <div className="flex items-start gap-4 relative">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-2xl shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ease-spring`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 mb-1.5">{feature.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-accent-500 to-primary-600 bg-[length:200%_100%] animate-gradient-x"></div>
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-40 h-40 border border-white/20 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-60 h-60 border border-white/20 rounded-full translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-white/40 rounded-full animate-bounce-soft"></div>
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-float"></div>

        <div className="section-padding text-center relative">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 drop-shadow-sm">
            Ready to Start Swapping Skills?
          </h2>
          <p className="text-primary-50 max-w-2xl mx-auto mb-8 text-lg">
            Join hundreds of students already exchanging skills on SkillSwap. It's free, fun, and educational.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 bg-white text-primary-700 font-bold rounded-xl hover:bg-gray-50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 text-lg"
            >
              Create Free Account
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-xl hover:bg-white/20 transition-all duration-300 border-2 border-white/30 text-lg"
            >
              Login
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}

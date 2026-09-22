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
  },
  {
    icon: '🔍',
    title: 'Find Matches',
    description: 'Browse compatible users with our smart matching algorithm. See match percentages based on skill overlap.',
  },
  {
    icon: '🤝',
    title: 'Send Swap Requests',
    description: 'Found someone with complementary skills? Send a swap request and start a conversation.',
  },
  {
    icon: '🚀',
    title: 'Learn & Teach Together',
    description: 'Once accepted, start your skill exchange. Track progress, complete swaps, and leave reviews.',
  },
];

const features = [
  {
    icon: '🎯',
    title: 'Smart Matching',
    description: 'Our algorithm matches you with users whose teaching and learning goals complement yours.',
  },
  {
    icon: '📚',
    title: 'Skill Categories',
    description: 'From programming to photography, find peers across a wide range of skill categories.',
  },
  {
    icon: '⭐',
    title: 'Ratings & Reviews',
    description: 'Build your reputation with ratings and reviews from completed skill swaps.',
  },
  {
    icon: '🔒',
    title: 'College Verified',
    description: 'Connect with fellow students from verified college communities.',
  },
  {
    icon: '💬',
    title: 'Flexible Learning',
    description: 'Choose online, in-person, or hybrid learning modes that fit your schedule.',
  },
  {
    icon: '📊',
    title: 'Track Progress',
    description: 'Monitor your active swaps, pending requests, and completed exchanges in one place.',
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
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute top-20 right-1/4 w-72 h-72 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        </div>
        <div className="relative section-padding py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
                🎓 Built for Students, by Students
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-800 leading-tight mb-6">
                Learn What You Want.{' '}
                <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
                  Teach What You Know.
                </span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-xl">
                SkillSwap is a peer-to-peer platform where students exchange skills.
                List what you can teach, what you want to learn, and get matched with
                compatible peers from your college community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button to="/register" size="lg">
                  Get Started — It's Free
                </Button>
                <Button to="/explore" variant="secondary" size="lg">
                  Explore Skills
                </Button>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-12">
                <div>
                  <p className="text-3xl font-bold text-gray-800">500+</p>
                  <p className="text-sm text-gray-500">Active Students</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-800">1,200+</p>
                  <p className="text-sm text-gray-500">Skills Listed</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-800">50+</p>
                  <p className="text-sm text-gray-500">Colleges</p>
                </div>
              </div>
            </div>

            {/* Hero visual */}
            <div className="hidden lg:block animate-fade-in">
              <div className="relative">
                <Card className="shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center gap-3 mb-4">
                    <img src="https://i.pravatar.cc/150?img=11" alt="User" className="w-12 h-12 rounded-full" />
                    <div>
                      <p className="font-bold text-gray-800">Rahul Kumar</p>
                      <p className="text-sm text-gray-500">IIT Delhi</p>
                    </div>
                    <div className="ml-auto bg-gradient-to-br from-green-500 to-emerald-500 text-white px-3 py-1 rounded-lg text-sm font-bold">
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
                <Card className="absolute -bottom-8 -left-8 shadow-2xl -rotate-3 hover:rotate-0 transition-transform duration-500 w-64">
                  <div className="flex items-center gap-3">
                    <img src="https://i.pravatar.cc/150?img=5" alt="User" className="w-12 h-12 rounded-full" />
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
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular skills */}
      <section className="py-12 bg-white border-y border-gray-50">
        <div className="section-padding">
          <p className="text-center text-gray-400 font-medium mb-6">Popular skills on SkillSwap</p>
          <div className="flex flex-wrap justify-center gap-3">
            {popularSkills.map((skill) => (
              <SkillBadge key={skill} skill={skill} size="lg" className="px-4 py-2 text-sm shadow-sm hover:shadow-md transition-shadow cursor-default" />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="section-padding">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Get started in minutes. Four simple steps to your first skill swap.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <Card key={idx} hover className="text-center relative">
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                  {idx + 1}
                </div>
                <div className="text-5xl mb-4">{step.icon}</div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white">
        <div className="section-padding">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Why Choose SkillSwap?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Everything you need to exchange skills with peers efficiently and effectively.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <Card key={idx} hover className="group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-2xl shrink-0 group-hover:bg-primary-100 transition-colors">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1.5">{feature.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-accent-600">
        <div className="section-padding text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Start Swapping Skills?
          </h2>
          <p className="text-primary-100 max-w-2xl mx-auto mb-8 text-lg">
            Join hundreds of students already exchanging skills on SkillSwap. It's free, fun, and educational.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 bg-white text-primary-700 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl text-lg"
            >
              Create Free Account
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-primary-700 text-white font-bold rounded-xl hover:bg-primary-800 transition-all border-2 border-primary-400 text-lg"
            >
              Login
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}

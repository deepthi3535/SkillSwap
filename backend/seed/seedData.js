import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import SwapRequest from '../models/SwapRequest.js';
import Review from '../models/Review.js';

export const demoUsers = [
  {
    name: 'Rahul Kumar',
    email: 'rahul.kumar@college.edu',
    password: 'password123',
    college: 'IIT Delhi',
    location: 'Delhi',
    bio: 'Full-stack developer passionate about teaching React and Node.js. Love helping beginners get started with web development.',
    avatar: 'https://i.pravatar.cc/150?img=11',
    skillsTeach: ['React', 'Node.js', 'JavaScript', 'MongoDB'],
    skillsLearn: ['Python', 'SQL', 'Data Science'],
    experience: 'Advanced',
    availability: ['Weekends', 'Evenings'],
    learningMode: 'Online',
    rating: 4.8,
    reviewCount: 24,
    completedSwaps: 5,
    category: 'Programming',
  },
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@college.edu',
    password: 'password123',
    college: 'NIT Trichy',
    location: 'Chennai',
    bio: 'UI/UX designer with 3 years of experience. I enjoy teaching design principles and Figma. Looking to learn backend development.',
    avatar: 'https://i.pravatar.cc/150?img=5',
    skillsTeach: ['Figma', 'UI/UX Design', 'Photoshop', 'Illustrator'],
    skillsLearn: ['Node.js', 'Express', 'React', 'MongoDB'],
    experience: 'Intermediate',
    availability: ['Weekdays', 'Evenings'],
    learningMode: 'Hybrid',
    rating: 4.9,
    reviewCount: 31,
    completedSwaps: 8,
    category: 'Design',
  },
  {
    name: 'Arjun Mehta',
    email: 'arjun.mehta@college.edu',
    password: 'password123',
    college: 'BITS Pilani',
    location: 'Pilani',
    bio: 'Data science enthusiast and Python expert. I love working with data and teaching machine learning concepts.',
    avatar: 'https://i.pravatar.cc/150?img=12',
    skillsTeach: ['Python', 'Machine Learning', 'SQL', 'Pandas'],
    skillsLearn: ['React', 'JavaScript', 'Tailwind CSS'],
    experience: 'Expert',
    availability: ['Weekdays', 'Weekends'],
    learningMode: 'Online',
    rating: 4.7,
    reviewCount: 18,
    completedSwaps: 4,
    category: 'Data Science',
  },
  {
    name: 'Sneha Reddy',
    email: 'sneha.reddy@college.edu',
    password: 'password123',
    college: 'IIIT Hyderabad',
    location: 'Hyderabad',
    bio: 'Backend developer specializing in Java and Spring Boot. Want to explore frontend frameworks and mobile development.',
    avatar: 'https://i.pravatar.cc/150?img=9',
    skillsTeach: ['Java', 'Spring Boot', 'SQL', 'Microservices'],
    skillsLearn: ['React Native', 'Flutter', 'Firebase'],
    experience: 'Advanced',
    availability: ['Weekends'],
    learningMode: 'In-Person',
    rating: 4.6,
    reviewCount: 15,
    completedSwaps: 3,
    category: 'Programming',
  },
  {
    name: 'Vikram Singh',
    email: 'vikram.singh@college.edu',
    password: 'password123',
    college: 'Delhi University',
    location: 'Delhi',
    bio: 'Marketing professional turned developer. I teach digital marketing and want to learn full-stack development.',
    avatar: 'https://i.pravatar.cc/150?img=13',
    skillsTeach: ['Digital Marketing', 'SEO', 'Content Writing', 'Social Media'],
    skillsLearn: ['JavaScript', 'React', 'Node.js'],
    experience: 'Intermediate',
    availability: ['Evenings', 'Flexible'],
    learningMode: 'Online',
    rating: 4.5,
    reviewCount: 12,
    completedSwaps: 2,
    category: 'Marketing',
  },
  {
    name: 'Ananya Gupta',
    email: 'ananya.gupta@college.edu',
    password: 'password123',
    college: 'IIT Bombay',
    location: 'Mumbai',
    bio: 'Photographer and visual artist. I teach photography and photo editing. Looking to learn graphic design and video editing.',
    avatar: 'https://i.pravatar.cc/150?img=20',
    skillsTeach: ['Photography', 'Lightroom', 'Photoshop', 'Composition'],
    skillsLearn: ['After Effects', 'Premiere Pro', 'Illustrator'],
    experience: 'Advanced',
    availability: ['Weekends', 'Evenings'],
    learningMode: 'Hybrid',
    rating: 4.9,
    reviewCount: 27,
    completedSwaps: 6,
    category: 'Photography',
  },
  {
    name: 'Karan Patel',
    email: 'karan.patel@college.edu',
    password: 'password123',
    college: 'NIT Surat',
    location: 'Surat',
    bio: 'Mobile app developer with expertise in Flutter and Dart. Want to learn backend and cloud technologies.',
    avatar: 'https://i.pravatar.cc/150?img=15',
    skillsTeach: ['Flutter', 'Dart', 'Firebase', 'Mobile UI'],
    skillsLearn: ['AWS', 'Docker', 'Kubernetes', 'Python'],
    experience: 'Intermediate',
    availability: ['Weekdays', 'Weekends'],
    learningMode: 'Online',
    rating: 4.4,
    reviewCount: 9,
    completedSwaps: 2,
    category: 'Programming',
  },
  {
    name: 'Divya Nair',
    email: 'divya.nair@college.edu',
    password: 'password123',
    college: 'VIT Vellore',
    location: 'Vellore',
    bio: 'Language enthusiast fluent in Spanish and French. I teach languages and want to learn programming.',
    avatar: 'https://i.pravatar.cc/150?img=25',
    skillsTeach: ['Spanish', 'French', 'German', 'English'],
    skillsLearn: ['Python', 'Data Science', 'Machine Learning'],
    experience: 'Expert',
    availability: ['Flexible'],
    learningMode: 'Online',
    rating: 5.0,
    reviewCount: 33,
    completedSwaps: 10,
    category: 'Languages',
  },
  {
    name: 'Aakash Verma',
    email: 'aakash.verma@college.edu',
    password: 'password123',
    college: 'IIT Kanpur',
    location: 'Kanpur',
    bio: 'Passionate learner exploring web development and design. I teach Python and machine learning basics. Always eager to share knowledge and pick up new skills.',
    avatar: 'https://i.pravatar.cc/150?img=33',
    skillsTeach: ['Python', 'Machine Learning', 'Data Science', 'SQL'],
    skillsLearn: ['React', 'Node.js', 'Tailwind CSS', 'Figma'],
    experience: 'Intermediate',
    availability: ['Weekdays', 'Evenings'],
    learningMode: 'Online',
    rating: 4.6,
    reviewCount: 14,
    completedSwaps: 4,
    category: 'Programming',
  },
];

export const seedDB = async (clearFirst = true) => {
  try {
    if (clearFirst) {
      await User.deleteMany({});
      await SwapRequest.deleteMany({});
      await Review.deleteMany({});
    }

    const salt = await bcrypt.genSalt(10);
    const createdUsers = [];

    for (const userData of demoUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      const user = await User.create({
        ...userData,
        password: hashedPassword,
      });
      createdUsers.push(user);
    }

    const aakash = createdUsers.find((u) => u.email === 'aakash.verma@college.edu');
    const rahul = createdUsers.find((u) => u.email === 'rahul.kumar@college.edu');
    const priya = createdUsers.find((u) => u.email === 'priya.sharma@college.edu');
    const arjun = createdUsers.find((u) => u.email === 'arjun.mehta@college.edu');
    const vikram = createdUsers.find((u) => u.email === 'vikram.singh@college.edu');
    const divya = createdUsers.find((u) => u.email === 'divya.nair@college.edu');

    if (aakash && rahul && priya && arjun && vikram && divya) {
      await SwapRequest.create({
        sender: rahul._id,
        receiver: aakash._id,
        offeredSkill: 'React',
        requestedSkill: 'Python',
        matchScore: 92,
        message: 'Hi! I would love to learn Python from you and can teach you React in exchange.',
        status: 'pending',
      });

      await SwapRequest.create({
        sender: arjun._id,
        receiver: aakash._id,
        offeredSkill: 'Machine Learning',
        requestedSkill: 'Data Science',
        matchScore: 85,
        message: 'I can help you with advanced ML concepts. Let me know if you are interested!',
        status: 'pending',
      });

      await SwapRequest.create({
        sender: aakash._id,
        receiver: priya._id,
        offeredSkill: 'Python',
        requestedSkill: 'Figma',
        matchScore: 88,
        message: 'I would love to learn Figma from you! I can teach you Python in return.',
        status: 'pending',
      });

      await SwapRequest.create({
        sender: aakash._id,
        receiver: vikram._id,
        offeredSkill: 'Python',
        requestedSkill: 'Digital Marketing',
        matchScore: 81,
        status: 'accepted',
        startDate: '2026-09-10',
      });

      await SwapRequest.create({
        sender: divya._id,
        receiver: aakash._id,
        offeredSkill: 'Spanish',
        requestedSkill: 'Data Science',
        matchScore: 90,
        status: 'accepted',
        startDate: '2026-09-05',
      });

      const completedSwap = await SwapRequest.create({
        sender: rahul._id,
        receiver: aakash._id,
        offeredSkill: 'Node.js',
        requestedSkill: 'SQL',
        matchScore: 94,
        status: 'completed',
        startDate: '2026-08-01',
      });

      await Review.create({
        reviewer: rahul._id,
        reviewedUser: aakash._id,
        swapRequest: completedSwap._id,
        rating: 5,
        comment: 'Excellent teacher! Very patient and explains concepts clearly.',
      });
    }

    console.log('[Seed] Database seeded with demo users and swaps.');
  } catch (error) {
    console.error('[Seed Error]:', error);
  }
};

if (process.argv[1]?.includes('seedData.js')) {
  import('../config/db.js').then(async ({ default: connectDB }) => {
    await connectDB();
    await seedDB(true);
    process.exit(0);
  });
}

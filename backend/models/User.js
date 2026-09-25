import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    college: {
      type: String,
      default: '',
      trim: true,
    },
    location: {
      type: String,
      default: '',
      trim: true,
    },
    avatar: {
      type: String,
      default: 'https://i.pravatar.cc/150?img=11',
    },
    bio: {
      type: String,
      default: '',
    },
    skillsTeach: {
      type: [String],
      default: [],
    },
    skillsLearn: {
      type: [String],
      default: [],
    },
    experience: {
      type: String,
      default: 'Intermediate',
    },
    availability: {
      type: [String],
      default: ['Weekends', 'Evenings'],
    },
    learningMode: {
      type: String,
      default: 'Online',
    },
    category: {
      type: String,
      default: 'Programming',
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    completedSwaps: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for compatibility with frontend _id
userSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    delete ret.password;
    return ret;
  },
});

const User = mongoose.model('User', userSchema);
export default User;

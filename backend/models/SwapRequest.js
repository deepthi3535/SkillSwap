import mongoose from 'mongoose';

const swapRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    offeredSkill: {
      type: String,
      required: [true, 'Offered skill is required'],
    },
    requestedSkill: {
      type: String,
      required: [true, 'Requested skill is required'],
    },
    matchScore: {
      type: Number,
      default: 80,
    },
    message: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
      default: 'pending',
    },
    startDate: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
  },
  {
    timestamps: true,
  }
);

swapRequestSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const SwapRequest = mongoose.model('SwapRequest', swapRequestSchema);
export default SwapRequest;

import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  traineeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainee'
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    maxlength: 500
  },
  serviceType: {
    type: String,
    enum: ['training', 'quote', 'service'],
    required: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date
}, {
  timestamps: true
});

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);

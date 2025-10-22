import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid'; // to generate unique unsubscribe tokens

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  name: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'unsubscribed'],
    default: 'active'
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  unsubscribedAt: {
    type: Date
  },
  unsubscribeToken: {
    type: String,
    unique: true,
    index: true
  }
}, { timestamps: true });

// ✅ Automatically generate unique unsubscribe token before saving
newsletterSchema.pre('save', function (next) {
  if (!this.unsubscribeToken) {
    this.unsubscribeToken = uuidv4();
  }
  next();
});

const Newsletter = mongoose.models.Newsletter || mongoose.model('Newsletter', newsletterSchema);

export default Newsletter;

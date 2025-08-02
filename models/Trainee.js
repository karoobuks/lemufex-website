import mongoose from 'mongoose';

const traineeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    
    unique: true, // 1 trainee record per user
  },
   fullName: {
    type: String,
    required: true,
  },
  email: { // redundant with User model, but OK for form display
    type: String,
    required: true,
  },
    trainings: [
    {
      track: {
        type: String,
        enum: ['Automation', 'Electrical', 'Software Programming'],
        required: true,
      },
      enrolledAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  phone: {
    type: String,
    required: true,
  },
  address: String,
}, { timestamps: true });

const Trainee = mongoose.models.Trainee || mongoose.model('Trainee', traineeSchema);
export default Trainee;

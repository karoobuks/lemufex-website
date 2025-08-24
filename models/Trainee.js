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
        trim:true,
      },
    },
  ],
  phone: {
    type: String,
    required: true,
  },
  emergencycontact: {
    type: String,
    required: true,
  },
  dob:{
    type:Date, 
    required:true
  },
  address: String,
  image: String,
  course: String,
  documents: String,
  level: String,
  bio: String,
  
}, { timestamps: true });

const Trainee = mongoose.models.Trainee || mongoose.model('Trainee', traineeSchema);
export default Trainee;

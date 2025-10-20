// models/Trainee.js
import mongoose, { Schema, model, models } from "mongoose";

const trainingSchema = new Schema({
  track: {
    type: String,
    enum: ["Automation", "Electrical Engineering", "Software Programming"],
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  enrolledAt: {
    type: Date,
    default: Date.now,
  },
  completedModules: {
    type: Number,
    default: 0,
  },
  totalModules: {
    type: Number,
    default: 0,
  },
});

// ✅ Trainee schema
const traineeSchema = new Schema(
  {
    // One-to-one link to User
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true, // prevents multiple trainee docs per user
      required: true,
      //index: true, // faster lookups
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    trainings: [trainingSchema],
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    emergencycontact: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    address: { type: String, trim: true },
    image: String,
    course: String,
    documents: String,
    level: String,
    bio: String,

    // ✅ Payment-related fields (based on your register route)
    fullPrice: Number,
    installmentPrice: Number,
    paymentType: {
      type: String,
      enum: ["full", "installment"],
      default: "installment",
    },
    currentInstallment: {
      type: Number,
      default: 0,
    },
    amountDue: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// ✅ Compound index for scaling queries
traineeSchema.index({ email: 1, user: 1 }); // efficient query performance
traineeSchema.index({ "trainings.track": 1 }); // for filtering trainees by track

const Trainee = models?.Trainee || model("Trainee", traineeSchema);
export default Trainee;

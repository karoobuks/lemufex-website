// import mongoose, { Schema, model, models } from "mongoose";

// const trainingSchema = new Schema({
//   track: {
//     type: String,
//     enum: ["Automation", "Electrical Engineering", "Software Programming"],
//     required: true,
//   },
//   course: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Course",
//     required: true,
//   },
//   enrolledAt: {
//     type: Date,
//     default: Date.now, // ✅ Proper default function
//     immutable: true,
//   },
//   completedModules: {
//     type: Number,
//     default: 0,
//   },
//   totalModules: {
//     type: Number,
//     default: 0,
//   },
// });

// // ✅ Middleware to ensure enrolledAt is always set automatically
// trainingSchema.pre("save", function (next) {
//   if (!this.enrolledAt) {
//     this.enrolledAt = new Date();
//   }
//   next();
// });

// const traineeSchema = new Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       unique: true,
//       required: true,
//     },
//     fullName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       trim: true,
//       lowercase: true,
//       index: true,
//     },
//     trainings: [trainingSchema],
//     phone: { type: String, required: true, trim: true },
//     emergencycontact: { type: String, required: true },
//     dob: { type: Date, required: true },
//     address: { type: String, trim: true },
//     image: String,
//     course: String,
//     documents: String,
//     level: String,
//     bio: String,

//     fullPrice: Number,
//     installmentPrice: Number,
//     paymentType: {
//       type: String,
//       enum: ["full", "installment"],
//       default: "installment",
//     },
//     currentInstallment: { type: Number, default: 0 },
//     amountDue: { type: Number, default: 0 },
//   },
//   { timestamps: true }
// );

// traineeSchema.index({ email: 1, user: 1 });
// traineeSchema.index({ "trainings.track": 1 });

// const Trainee = models?.Trainee || model("Trainee", traineeSchema);
// export default Trainee;


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
    default: Date.now, // ✅ ensures proper auto-date
    immutable: true,
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

const traineeSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    trainings: [trainingSchema],
    phone: { type: String, required: true, trim: true },
    emergencycontact: { type: String, required: true },
    dob: { type: Date, required: true },
    address: { type: String, trim: true },
    image: String,
    course: String,
    documents: String,
    level: String,
    bio: String,
    fullPrice: Number,
    installmentPrice: Number,
    paymentType: {
      type: String,
      enum: ["full", "installment"],
      default: "installment",
    },
    currentInstallment: { type: Number, default: 0 },
    amountDue: { type: Number, default: 0 },
  },
  { timestamps: true }
);

traineeSchema.index({ email: 1, user: 1 });
traineeSchema.index({ "trainings.track": 1 });

const Trainee = models?.Trainee || model("Trainee", traineeSchema);
export default Trainee;

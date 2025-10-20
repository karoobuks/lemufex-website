
// import mongoose from "mongoose";

// const paymentSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
 
//   course:{
//     type:mongoose.Schema.Types.ObjectId,
//     ref:"Course",
//     require:true,
//   },
//   amount: {
//     type: Number, // e.g., 5000, 10000
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//   },
//   paymentType: {
//     type: String,
//     enum: ["full", "installment"], // ✅ added
//     required: true,
//   },
//   currentInstallment: {
//     type: Number, // e.g., 1st installment, 2nd installment
//     default: 0,   // ✅ optional if full payment
//   },
//   amountDue:{
//     type: Number,
//     default: 0,
//   },
//   reference: {
//     type: String, // Paystack reference
//     sparse: true,
    
//   },
//   status: {
//     type: String,
//     enum: ["pending", "success", "completed", "failed"],
//     default: "pending",
//   },
//   paidAt: {
//     type: Date,
//     default: Date.now,
//   },
//   gateway_response: { type: String },
// });

// const Payment =
//   mongoose.models.Payment || mongoose.model("Payment", paymentSchema);

// export default Payment;



// models/Payment.js
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    amount: { type: Number, required: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    paymentType: { type: String, enum: ["full", "installment", "completion"], required: true },
    currentInstallment: { type: Number, default: 0 },
    amountDue: { type: Number, default: 0 },
    reference: { type: String, unique: true, sparse: true, index: true },
    status: {
      type: String,
      enum: ["pending", "success", "completed", "failed"],
      default: "pending",
      index: true,
    },
    paidAt: { type: Date, default: null },
    gateway_response: String,
  },
  { timestamps: true }
);

// Useful compound / partial indexes
paymentSchema.index({ userId: 1, status: 1 });
paymentSchema.index({ reference: 1 }, { unique: true, sparse: true });
// Partial index to find pending payments quickly (small index footprint)
paymentSchema.index({ userId: 1, course: 1 }, { partialFilterExpression: { status: "pending" } });

const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
export default Payment;


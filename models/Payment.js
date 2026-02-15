
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
    paymentMethod: { type: String, enum: ["paystack", "bank_transfer"], default: "bank_transfer" },
    paymentProof: { type: String },
    currentInstallment: { type: Number, default: 0 },
    amountDue: { type: Number, default: 0 },
    reference: { type: String, index: true },
    status: {
      type: String,
      enum: ["pending", "success", "completed", "failed", "verified"],
      default: "pending",
      index: true,
    },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    verifiedAt: { type: Date },
    paidAt: { type: Date, default: null },
    gateway_response: String,
  },
  { timestamps: true }
);

paymentSchema.index({ userId: 1, status: 1 });
paymentSchema.index({ userId: 1, course: 1 }, { partialFilterExpression: { status: "pending" } });

const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
export default Payment;



import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
 
  course:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Course",
    require:true,
  },
  amount: {
    type: Number, // e.g., 5000, 10000
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  paymentType: {
    type: String,
    enum: ["full", "installment"], // ✅ added
    required: true,
  },
  currentInstallment: {
    type: Number, // e.g., 1st installment, 2nd installment
    default: 0,   // ✅ optional if full payment
  },
  amountDue:{
    type: Number,
    default: 0,
  },
  reference: {
    type: String, // Paystack reference
    sparse: true,
    
  },
  status: {
    type: String,
    enum: ["pending", "success", "completed", "failed"],
    default: "pending",
  },
  paidAt: {
    type: Date,
    default: Date.now,
  },
  gateway_response: { type: String },
});

const Payment =
  mongoose.models.Payment || mongoose.model("Payment", paymentSchema);

export default Payment;

import mongoose from "mongoose";

const ResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  fileUrl: { type: String, required: true }, // link to uploaded file
   track: { 
    type: String, 
    enum: ["Automation", "Software Programming", "Electrical Engineering"], 
    required: true, 
    trim:true,
    lowerCase:true
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Resource || mongoose.model("Resource", ResourceSchema);

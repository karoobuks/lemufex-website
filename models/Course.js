

import mongoose from "mongoose";


const PriceSchema = new mongoose.Schema({
  full: {
    type: Number,
    required: true,
  },
  installment: {
    type: Number,
    required: true,
  },
});

const ModuleSchema = new mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  description:String,
  order:{
    type:Number,
    required:true
  },
})

const CourseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // Each course name should be unique (e.g., "Automation")
    },
    slug:{
      type: String,
      required:true,
      unique:true,
    },
    prices: {
      type: PriceSchema,
      required: true,
    },
    modules:[ModuleSchema],
    totalModules:{
      type:Number,
      default:0,
    }
  },
  { timestamps: true }
);

CourseSchema.pre("save", function (next) {
  if(this.isModified("name")) {
    this.slug = this.name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
  }
  
    this.totalModules = this.modules.length;
  
  
  next();
});

export default mongoose.models.Course || mongoose.model("Course", CourseSchema);


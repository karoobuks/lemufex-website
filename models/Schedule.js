import mongoose from "mongoose";

const ScheduleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    fileUrl: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    versionNumber: { type: Number, default: 1, index: true },
  },
  { timestamps: true }
);

// Auto-increment version by counting docs
ScheduleSchema.pre("save", async function (next) {
  if (this.isNew && !this.versionNumber) {
    const Model = mongoose.model("Schedule");
    const last = await Model.findOne().sort({ versionNumber: -1 }).select("versionNumber");
    this.versionNumber = last ? last.versionNumber + 1 : 1;
  }
  next();
});

export default mongoose.models.Schedule || mongoose.model("Schedule", ScheduleSchema);

import mongoose from "mongoose";

const SlotSchema = new mongoose.Schema({
  time: { type: String, default: "" },       // e.g. "9:00 AM - 11:00 AM"
  topic: { type: String, default: "" },
  course: { type: String, default: "" },
  instructor: { type: String, default: "" },
  notes: { type: String, default: "" },
}, { _id: true });

const DaySchema = new mongoose.Schema({
  day: { type: String, required: true },     // "Monday" … "Sunday"
  slots: { type: [SlotSchema], default: [] },
}, { _id: false });

const TimetableSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    days: { type: [DaySchema], default: [] },
    setBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    version: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export default mongoose.models.Timetable ||
  mongoose.model("Timetable", TimetableSchema);

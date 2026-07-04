import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    jobDescription: { type: String, required: true },
    resumeText: { type: String },
    matchScore: { type: Number },
    skillGaps: [{ type: String }],
    technicalQuestions: [{ type: String }],
    behavioralQuestions: [{ type: String }],
    roadmap: [
      {
        day: Number,
        focus: String,
        tasks: [String]
      }
    ],
    resumeSuggestions: [{ type: String }],
    rawResponse: { type: Object }
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);

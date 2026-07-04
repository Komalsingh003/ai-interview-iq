import express from "express";
import multer from "multer";
import { requireAuth } from "../middleware/auth.js";
import { extractTextFromFile } from "../services/resumeParser.js";
import { generateInterviewStrategy } from "../services/groqService.js";
import { streamReportPdf } from "../services/pdfService.js";
import Report from "../models/Report.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// POST /api/plan/generate
router.post("/generate", requireAuth, upload.single("resume"), async (req, res) => {
  try {
    const { jobDescription, selfDescription } = req.body;

    if (!jobDescription || jobDescription.trim().length < 20) {
      return res.status(400).json({ message: "Please provide a fuller job description" });
    }

    let candidateProfile = selfDescription || "";

    if (req.file) {
      const extracted = await extractTextFromFile(req.file.buffer, req.file.mimetype);
      candidateProfile = extracted;
    }

    if (!candidateProfile || candidateProfile.trim().length < 10) {
      return res
        .status(400)
        .json({ message: "Please upload a resume or provide a self-description" });
    }

    const result = await generateInterviewStrategy(jobDescription, candidateProfile);

    const report = await Report.create({
      user: req.userId,
      jobDescription,
      resumeText: candidateProfile,
      matchScore: result.matchScore,
      skillGaps: result.skillGaps,
      technicalQuestions: result.technicalQuestions,
      behavioralQuestions: result.behavioralQuestions,
      roadmap: result.roadmap,
      resumeSuggestions: result.resumeSuggestions,
      rawResponse: result
    });

    res.status(201).json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate strategy", error: err.message });
  }
});

// GET /api/plan/history
router.get("/history", requireAuth, async (req, res) => {
  const reports = await Report.find({ user: req.userId }).sort({ createdAt: -1 });
  res.json(reports);
});

// GET /api/plan/:id
router.get("/:id", requireAuth, async (req, res) => {
  const report = await Report.findOne({ _id: req.params.id, user: req.userId });
  if (!report) return res.status(404).json({ message: "Report not found" });
  res.json(report);
});

// GET /api/plan/:id/pdf
router.get("/:id/pdf", requireAuth, async (req, res) => {
  const report = await Report.findOne({ _id: req.params.id, user: req.userId });
  if (!report) return res.status(404).json({ message: "Report not found" });
  streamReportPdf(res, report);
});

export default router;

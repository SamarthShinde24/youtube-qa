import { Router } from "express";
import { fetchTranscript } from "../services/transcript.js";
import { answerQuestion } from "../services/llm.js";

const router = Router();

// POST /api/transcript — fetch and return transcript for a YouTube URL
router.post("/transcript", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "YouTube URL is required." });

    const { formattedText, videoId, segments } = await fetchTranscript(url);

    return res.json({
      videoId,
      transcript: formattedText,
      duration: Math.floor(segments[segments.length - 1]?.start || 0),
      segmentCount: segments.length,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// POST /api/ask — answer a question given a transcript + chat history
router.post("/ask", async (req, res) => {
  try {
    const { transcript, question, history = [] } = req.body;

    if (!transcript) return res.status(400).json({ error: "Transcript is required." });
    if (!question?.trim()) return res.status(400).json({ error: "Question is required." });

    const result = await answerQuestion(transcript, question, history);
    return res.json(result);
  } catch (err) {
    console.error("Ask error:", err);
    return res.status(500).json({ error: "Failed to answer. Please try again." });
  }
});

export default router;

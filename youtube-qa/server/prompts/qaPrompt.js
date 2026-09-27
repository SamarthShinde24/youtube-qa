export function buildQAPrompt(transcript, question, chatHistory = []) {
  const historyText = chatHistory.length
    ? chatHistory
        .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
        .join("\n")
    : "";

  return `You are a helpful assistant that answers questions strictly based on the YouTube video transcript below.

TRANSCRIPT (with timestamps):
"""
${transcript.slice(0, 12000)}
"""

${historyText ? `CONVERSATION SO FAR:\n${historyText}\n` : ""}

USER QUESTION: ${question}

Rules:
- Answer ONLY from the transcript. Do not use outside knowledge.
- Always cite the timestamp(s) where the answer comes from, like (2:34) or (5:12 - 5:45).
- If the transcript does not contain the answer, say clearly: "This topic isn't covered in the video."
- Keep answers concise but complete.
- If quoting, keep quotes under 15 words.

Return ONLY valid JSON in this exact shape:
{
  "answer": "<your answer with inline timestamp citations>",
  "citations": ["2:34", "5:12"],
  "confidence": "high" | "medium" | "low",
  "covered": true | false
}`;
}

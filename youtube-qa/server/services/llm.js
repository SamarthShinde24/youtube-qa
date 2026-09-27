import { buildQAPrompt } from "../prompts/qaPrompt.js";

// ⚠️ Replace with your Groq key. Move to .env before deploying.
const GROQ_API_KEY = "YOUR_GROQ_KEY_HERE";
const MODEL = "openai/gpt-oss-120b";

function cleanJson(text) {
  return text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

export async function answerQuestion(transcript, question, chatHistory = []) {
  const prompt = buildQAPrompt(transcript, question, chatHistory);

  const attempt = async (extra = "") => {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: prompt + extra }],
        temperature: 0.2,
      }),
    });

    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    const raw = data.choices?.[0]?.message?.content || "";
    return JSON.parse(cleanJson(raw));
  };

  try {
    return await attempt();
  } catch {
    return await attempt(
      "\n\nReturn ONLY the raw JSON object. No markdown, no commentary."
    );
  }
}

export async function loadTranscript(url) {
  const res = await fetch("/api/transcript", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load transcript.");
  return data;
}

export async function askQuestion(transcript, question, history) {
  const res = await fetch("/api/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transcript, question, history }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to get answer.");
  return data;
}

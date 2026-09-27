import { YoutubeTranscript } from "youtube-transcript";

/**
 * Extracts video ID from any YouTube URL format:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 */
export function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\n?#]+)/,
    /(?:youtu\.be\/)([^&\n?#]+)/,
    /(?:youtube\.com\/embed\/)([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  throw new Error("Invalid YouTube URL. Please paste a valid YouTube link.");
}

/**
 * Fetches and formats the transcript with timestamps.
 * Returns an array of { text, start, duration } objects
 * and a plain string version for LLM context.
 */
export async function fetchTranscript(videoUrl) {
  const videoId = extractVideoId(videoUrl);

  let segments;
  try {
    segments = await YoutubeTranscript.fetchTranscript(videoId);
  } catch {
    throw new Error(
      "Could not fetch transcript. The video may have no captions, be private, or be age-restricted."
    );
  }

  if (!segments || segments.length === 0) {
    throw new Error("This video has no transcript available.");
  }

  // Format for LLM: include timestamps so model can cite them
  const formattedText = segments
    .map((s) => {
      const minutes = Math.floor(s.start / 60);
      const seconds = Math.floor(s.start % 60).toString().padStart(2, "0");
      return `[${minutes}:${seconds}] ${s.text}`;
    })
    .join("\n");

  return { segments, formattedText, videoId };
}

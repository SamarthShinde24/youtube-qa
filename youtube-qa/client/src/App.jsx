import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import UrlInput from "./components/UrlInput.jsx";
import ChatMessage from "./components/ChatMessage.jsx";
import VideoInfo from "./components/VideoInfo.jsx";
import { loadTranscript, askQuestion } from "./api.js";

const SUGGESTED = [
  "What is this video about?",
  "What are the main points covered?",
  "What conclusions does the speaker reach?",
];

export default function App() {
  const [videoData, setVideoData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [urlLoading, setUrlLoading] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleLoadVideo = async (url) => {
    setUrlLoading(true);
    setError(null);
    try {
      const data = await loadTranscript(url);
      setVideoData(data);
      setMessages([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setUrlLoading(false);
    }
  };

  const handleAsk = async (question) => {
    if (!question.trim() || loading) return;
    setInput("");
    setError(null);

    const userMsg = { role: "user", content: question };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content || m.data?.answer || "",
      }));

      const result = await askQuestion(videoData.transcript, question, history);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: result.answer, data: result },
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!videoData) {
    return <UrlInput onLoad={handleLoadVideo} loading={urlLoading} />;
  }

  return (
    <div className="h-screen bg-gray-950 flex flex-col">
      <VideoInfo
        videoId={videoData.videoId}
        segmentCount={videoData.segmentCount}
        duration={videoData.duration}
        onReset={() => setVideoData(null)}
      />

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-6">Transcript loaded — ask anything about the video</p>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTED.map((q) => (
                <button
                  key={q}
                  onClick={() => handleAsk(q)}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm px-4 py-2 rounded-full border border-gray-700 transition"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="bg-red-900 rounded-full p-2 h-8 w-8 flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-red-400 animate-spin" />
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        {error && (
          <p className="text-center text-red-400 text-sm">{error}</p>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="border-t border-gray-800 bg-gray-900 px-4 py-4">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleAsk(input)}
            placeholder="Ask a question about the video..."
            disabled={loading}
            className="flex-1 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition disabled:opacity-50"
          />
          <button
            onClick={() => handleAsk(input)}
            disabled={loading || !input.trim()}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

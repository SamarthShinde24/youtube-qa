import { Clock, User, Youtube } from "lucide-react";

export default function ChatMessage({ message }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end gap-3">
        <div className="bg-red-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
          <p className="text-sm">{message.content}</p>
        </div>
        <div className="bg-gray-700 rounded-full p-2 h-8 w-8 flex items-center justify-center flex-shrink-0 mt-1">
          <User className="w-4 h-4 text-gray-300" />
        </div>
      </div>
    );
  }

  const { answer, citations = [], confidence, covered } = message.data || {};

  return (
    <div className="flex gap-3">
      <div className="bg-red-900 rounded-full p-2 h-8 w-8 flex items-center justify-center flex-shrink-0 mt-1">
        <Youtube className="w-4 h-4 text-red-400" />
      </div>
      <div className="bg-gray-800 border border-gray-700 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%] space-y-3">
        <p className="text-gray-100 text-sm leading-relaxed">{answer}</p>

        {citations.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {citations.map((ts, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full"
              >
                <Clock className="w-3 h-3" />
                {ts}
              </span>
            ))}
          </div>
        )}

        {confidence && (
          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                confidence === "high"
                  ? "bg-green-900 text-green-300"
                  : confidence === "medium"
                  ? "bg-yellow-900 text-yellow-300"
                  : "bg-red-900 text-red-300"
              }`}
            >
              {confidence} confidence
            </span>
            {!covered && (
              <span className="text-xs text-gray-500">Not covered in video</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

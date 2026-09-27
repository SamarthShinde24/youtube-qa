import { Youtube, FileText, RefreshCw } from "lucide-react";

export default function VideoInfo({ videoId, segmentCount, duration, onReset }) {
  const minutes = Math.floor(duration / 60);

  return (
    <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img
          src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
          alt="thumbnail"
          className="w-12 h-9 rounded object-cover"
        />
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Youtube className="w-3 h-3 text-red-500" />
            <span>youtube.com/watch?v={videoId}</span>
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="flex items-center gap-1 text-xs text-green-400">
              <FileText className="w-3 h-3" />
              {segmentCount} segments
            </span>
            <span className="text-xs text-gray-500">{minutes} min transcript</span>
          </div>
        </div>
      </div>
      <button
        onClick={onReset}
        className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition"
      >
        <RefreshCw className="w-3 h-3" />
        New video
      </button>
    </div>
  );
}

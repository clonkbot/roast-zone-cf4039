import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";

export interface Roast {
  _id: Id<"roasts">;
  targetName: string;
  roastText: string;
  memeUrl?: string;
  likes: number;
  hasLiked: boolean;
  createdAt: number;
}

export function RoastCard({ roast }: { roast: Roast }) {
  const toggleLike = useMutation(api.roasts.toggleLike);
  const deleteRoast = useMutation(api.roasts.remove);
  const [isLiking, setIsLiking] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      await toggleLike({ roastId: roast._id });
    } catch (error) {
      console.error("Failed to toggle like:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const timeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  // Generate a placeholder meme image based on target name
  const getMemeImage = () => {
    if (imageError || !roast.memeUrl) {
      // Fallback to a gradient placeholder
      return null;
    }
    return roast.memeUrl;
  };

  const memeImage = getMemeImage();

  return (
    <>
      <div className="group relative bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 hover:border-orange-500/30 rounded-2xl overflow-hidden transition-all hover:shadow-xl hover:shadow-orange-500/5">
        <div className="p-4 md:p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-xl md:text-2xl shadow-lg shadow-orange-500/20">
                🎯
              </div>
              <div>
                <h4 className="font-bold text-white text-sm md:text-base">Roasting: {roast.targetName}</h4>
                <p className="text-xs text-white/40">{timeAgo(roast.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-center gap-1 px-2 py-1 bg-orange-500/10 rounded-full">
              <span className="text-orange-400 text-sm">🔥</span>
              <span className="text-xs font-bold text-orange-300">{roast.likes}</span>
            </div>
          </div>

          {/* Roast Text */}
          <div className="mb-4">
            <p className="text-lg md:text-xl font-medium text-white/90 leading-relaxed">
              "{roast.roastText}"
            </p>
          </div>

          {/* Meme Image */}
          {memeImage && (
            <div
              className="relative mb-4 rounded-xl overflow-hidden bg-white/5 cursor-pointer group/img"
              onClick={() => setShowFullImage(true)}
            >
              <img
                src={memeImage}
                alt={`Meme roasting ${roast.targetName}`}
                className="w-full h-48 md:h-64 object-cover transition-transform group-hover/img:scale-105"
                onError={() => setImageError(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end justify-center pb-4">
                <span className="text-white/80 text-sm font-medium">Click to expand</span>
              </div>
            </div>
          )}

          {/* Placeholder when no image */}
          {!memeImage && (
            <div className="mb-4 p-8 rounded-xl bg-gradient-to-br from-orange-500/10 via-red-500/10 to-pink-500/10 border border-white/5 text-center">
              <span className="text-4xl block mb-2">🔥</span>
              <span className="text-white/30 text-sm">Meme generated</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
                roast.hasLiked
                  ? "bg-orange-500/20 text-orange-300 border border-orange-500/30"
                  : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-transparent"
              }`}
            >
              <span className={`text-lg ${roast.hasLiked ? "animate-pulse" : ""}`}>
                {roast.hasLiked ? "🔥" : "👍"}
              </span>
              <span className="text-sm">{roast.hasLiked ? "Loving It" : "That's Fire"}</span>
            </button>

            <button
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-xl transition-all"
              onClick={() => {
                navigator.clipboard.writeText(roast.roastText);
              }}
            >
              <span>📋</span>
              <span className="text-sm hidden md:inline">Copy</span>
            </button>
          </div>
        </div>

        {/* Decorative gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Full Image Modal */}
      {showFullImage && memeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          onClick={() => setShowFullImage(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={memeImage}
              alt={`Meme roasting ${roast.targetName}`}
              className="max-w-full max-h-[90vh] object-contain rounded-xl"
            />
            <button
              onClick={() => setShowFullImage(false)}
              className="absolute -top-4 -right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}

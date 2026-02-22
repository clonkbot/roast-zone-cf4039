import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

const ROAST_TEMPLATES = [
  "If {target} was a spice, they'd be flour.",
  "{target}'s IQ is room temperature... in Celsius.",
  "I'd agree with {target}, but then we'd both be wrong.",
  "{target} brings everyone so much joy... when they leave.",
  "If {target}'s brain was dynamite, they couldn't blow their nose.",
  "{target} is not the sharpest tool in the shed. They're the entire Home Depot.",
  "I'm not saying {target} is dumb, but they tried to put M&Ms in alphabetical order.",
  "{target}'s face is proof that God has a sense of humor.",
  "If I wanted to kill myself, I'd climb {target}'s ego and jump to their IQ.",
  "{target} is the human equivalent of a participation trophy.",
];

interface RoastCreatorProps {
  initialTarget?: string;
  onClose: () => void;
}

export function RoastCreator({ initialTarget = "", onClose }: RoastCreatorProps) {
  const createRoast = useMutation(api.roasts.create);
  const [targetName, setTargetName] = useState(initialTarget);
  const [roastText, setRoastText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  const generateMemeUrl = (target: string) => {
    // Using nanobananapro API pattern for meme generation
    const query = encodeURIComponent(`${target} funny meme roast`);
    return `https://api.nanobananapro.com/v1/meme?query=${query}&t=${Date.now()}`;
  };

  const handleTemplateSelect = (template: string) => {
    const filled = template.replace(/{target}/g, targetName || "[TARGET]");
    setRoastText(filled);
    setShowTemplates(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetName.trim() || !roastText.trim()) return;

    setIsSubmitting(true);
    try {
      const memeUrl = generateMemeUrl(targetName);
      await createRoast({
        targetName: targetName.trim(),
        roastText: roastText.trim(),
        memeUrl,
      });
      onClose();
    } catch (error) {
      console.error("Failed to create roast:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#1a1a24] to-[#0f0f15] border border-white/10 rounded-3xl shadow-2xl shadow-orange-500/20 overflow-hidden">
        {/* Header */}
        <div className="relative p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎯</span>
            <div>
              <h3 className="text-xl font-black tracking-tight">Create Your Roast</h3>
              <p className="text-sm text-white/40">Make it spicy, make it memorable</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Target Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-orange-300/60">
              Who are you roasting?
            </label>
            <input
              type="text"
              value={targetName}
              onChange={(e) => setTargetName(e.target.value)}
              placeholder="Enter their name..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all text-lg"
            />
          </div>

          {/* Roast Text */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-orange-300/60">
                Your Roast
              </label>
              <button
                type="button"
                onClick={() => setShowTemplates(!showTemplates)}
                className="text-xs text-orange-400 hover:text-orange-300 font-semibold transition-colors"
              >
                {showTemplates ? "Hide Templates" : "Need inspiration?"}
              </button>
            </div>

            {/* Templates Dropdown */}
            {showTemplates && (
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 max-h-48 overflow-y-auto space-y-2">
                {ROAST_TEMPLATES.map((template, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleTemplateSelect(template)}
                    className="w-full text-left p-2 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    {template.replace(/{target}/g, targetName || "[TARGET]")}
                  </button>
                ))}
              </div>
            )}

            <textarea
              value={roastText}
              onChange={(e) => setRoastText(e.target.value)}
              placeholder="Write something devastating..."
              rows={4}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all resize-none"
            />
          </div>

          {/* Preview */}
          {targetName && roastText && (
            <div className="p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl">
              <div className="text-xs text-orange-300/60 uppercase tracking-wider mb-2">Preview</div>
              <p className="text-white/80 italic">"{roastText}"</p>
              <p className="text-sm text-white/40 mt-2">— targeting {targetName}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !targetName.trim() || !roastText.trim()}
            className="w-full py-4 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-400 hover:via-red-400 hover:to-pink-400 text-white font-black uppercase tracking-wider rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-orange-500/25"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Dropping Heat...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>🔥</span>
                Drop The Roast
                <span>🔥</span>
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

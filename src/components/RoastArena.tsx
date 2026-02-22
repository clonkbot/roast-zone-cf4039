import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { RoastCard, Roast } from "./RoastCard";
import { RoastCreator } from "./RoastCreator";

const POPULAR_TARGETS = [
  { name: "Tucker Carlson", emoji: "🦊" },
  { name: "Candace Owens", emoji: "🎭" },
  { name: "Elon Musk", emoji: "🚀" },
  { name: "Mark Zuckerberg", emoji: "🤖" },
  { name: "Kanye West", emoji: "🎤" },
  { name: "Jake Paul", emoji: "🥊" },
];

export function RoastArena() {
  const roasts = useQuery(api.roasts.list);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState("");

  const handleTargetSelect = (name: string) => {
    setSelectedTarget(name);
    setIsCreating(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full mb-6">
          <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-orange-300">Live Roasts</span>
        </div>

        <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
          <span className="bg-gradient-to-r from-white via-orange-100 to-white bg-clip-text text-transparent">
            Pick Your Target
          </span>
        </h2>
        <p className="text-white/40 max-w-md mx-auto">
          Choose a celebrity to roast with AI-generated memes. No mercy, no filters.
        </p>
      </div>

      {/* Target Selection Grid */}
      <div className="mb-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {POPULAR_TARGETS.map((target) => (
            <button
              key={target.name}
              onClick={() => handleTargetSelect(target.name)}
              className="group relative p-4 md:p-6 bg-gradient-to-b from-white/[0.06] to-transparent border border-white/10 hover:border-orange-500/50 rounded-2xl transition-all hover:scale-105 hover:shadow-xl hover:shadow-orange-500/10"
            >
              <div className="text-4xl md:text-5xl mb-3 group-hover:scale-110 transition-transform">
                {target.emoji}
              </div>
              <div className="text-sm md:text-base font-bold text-white/80 group-hover:text-white transition-colors">
                {target.name}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity" />
            </button>
          ))}
        </div>

        {/* Custom Target Button */}
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition-all text-white/60 hover:text-white"
          >
            <span className="text-xl">✍️</span>
            <span className="font-semibold">Roast Someone Else</span>
          </button>
        </div>
      </div>

      {/* Roast Creator Modal */}
      {isCreating && (
        <RoastCreator
          initialTarget={selectedTarget}
          onClose={() => {
            setIsCreating(false);
            setSelectedTarget("");
          }}
        />
      )}

      {/* Roasts Feed */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-bold text-white/80">Recent Roasts</h3>
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-sm text-white/30">{roasts?.length || 0} total</span>
        </div>

        {roasts === undefined ? (
          <div className="flex justify-center py-12">
            <div className="flex items-center gap-3 text-white/40">
              <span className="w-6 h-6 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
              Loading roasts...
            </div>
          </div>
        ) : roasts.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="text-6xl mb-4">🦗</div>
            <p className="text-white/40 text-lg">No roasts yet. Be the first to drop some heat!</p>
          </div>
        ) : (
          <div className="grid gap-4 md:gap-6">
            {roasts.map((roast: Roast) => (
              <RoastCard key={roast._id} roast={roast} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

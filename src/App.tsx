import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { RoastArena } from "./components/RoastArena";
import { AuthScreen } from "./components/AuthScreen";

export default function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-orange-500/20 rounded-full animate-spin">
            <div className="absolute top-0 left-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 bg-orange-500 rounded-full" />
          </div>
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl">🔥</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-orange-500/20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="text-4xl md:text-5xl filter drop-shadow-[0_0_20px_rgba(249,115,22,0.5)]">🔥</span>
              <span className="absolute -bottom-1 -right-1 text-lg">💀</span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tighter bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
                ROAST.ZONE
              </h1>
              <p className="text-[10px] md:text-xs text-orange-300/60 uppercase tracking-[0.2em] -mt-1">No mercy. All memes.</p>
            </div>
          </div>

          {isAuthenticated && (
            <button
              onClick={() => signOut()}
              className="px-4 py-2 text-sm font-bold uppercase tracking-wider text-orange-300/80 hover:text-white border border-orange-500/30 hover:border-orange-500 rounded-lg transition-all hover:bg-orange-500/10"
            >
              Exit
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {!isAuthenticated ? <AuthScreen /> : <RoastArena />}
      </main>

      {/* Footer */}
      <footer className="py-4 px-4 text-center border-t border-white/5">
        <p className="text-[11px] text-white/25 tracking-wide">
          Requested by <span className="text-white/40">@stringer_kade</span> · Built by <span className="text-white/40">@clonkbot</span>
        </p>
      </footer>
    </div>
  );
}

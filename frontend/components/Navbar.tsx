import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-30 backdrop-blur-xl bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-slate-900/80 border-b border-white/10 shadow-lg shadow-sky-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-sky-500 via-cyan-400 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/40 ring-1 ring-white/30">
              <span className="text-slate-900 font-bold text-lg">AI</span>
            </div>
            <div>
              <Link
                href="/"
                className="text-2xl font-bold bg-gradient-to-r from-sky-300 via-white to-emerald-200 bg-clip-text text-transparent"
              >
                AI Desk
              </Link>
              <p className="text-xs text-slate-300/80">Real-time AI intelligence feed</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:text-white hover:bg-white/5 transition"
            >
              Dashboard
            </Link>
            <Link
              href="/categories"
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:text-white hover:bg-white/5 transition"
            >
              Categories
            </Link>
            <span className="hidden sm:inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-emerald-200 bg-white/5 border border-emerald-300/30 rounded-lg animate-[pulse-glow_3s_ease_infinite]">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping"></span>
              Live AI Feed
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}


export default function Loader() {
  return (
    <div className="flex justify-center items-center min-h-[320px]">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-white/10 border-t-emerald-300 animate-spin shadow-lg shadow-emerald-400/40"></div>
        <div className="absolute inset-0 rounded-full blur-xl bg-gradient-to-tr from-emerald-400/40 via-sky-400/30 to-indigo-400/30 animate-[pulse-glow_2.4s_ease_in_out_infinite]"></div>
      </div>
    </div>
  );
}


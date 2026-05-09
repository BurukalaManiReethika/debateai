const ROUND_LABELS = {
  opening: "Opening",
  rebuttal: "Rebuttal",
  closing: "Closing",
};

function TypingDots() {
  return (
    <span className="inline-flex gap-1 items-center ml-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-current animate-pulse-dot"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </span>
  );
}

export default function DebaterPanel({ side, messages, isActive, currentRound }) {
  const isPro = side === "pro";

  const accent = isPro
    ? "border-pro text-pro-dark bg-pro-light"
    : "border-con text-con-dark bg-con-light";

  const borderTop = isPro ? "border-t-4 border-t-pro" : "border-t-4 border-t-con";
  const activeRing = isActive
    ? isPro ? "ring-2 ring-pro ring-offset-2" : "ring-2 ring-con ring-offset-2"
    : "";

  return (
    <div className={`flex flex-col bg-white rounded-2xl border border-ink-100 ${borderTop} ${activeRing} transition-all duration-300 overflow-hidden`}>
      {/* Header */}
      <div className="px-5 py-4 border-b border-ink-100 flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-display ${accent}`}>
          {isPro ? "A" : "J"}
        </div>
        <div>
          <p className="font-display font-bold text-ink-900 text-base leading-none">
            {isPro ? "Alex" : "Jordan"}
          </p>
          <p className={`text-xs font-semibold mt-0.5 ${isPro ? "text-pro-dark" : "text-con-dark"}`}>
            {isPro ? "PRO" : "CON"}
          </p>
        </div>
        {isActive && (
          <div className={`ml-auto text-xs font-mono px-2 py-1 rounded-full ${accent}`}>
            {ROUND_LABELS[currentRound] || ""}
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 min-h-[280px] max-h-[400px] overflow-y-auto scrollbar-thin">
        {messages.length === 0 && (
          <p className="text-sm text-ink-400 italic">Waiting to speak…</p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className="animate-slide-up">
            <span className={`text-[10px] font-mono font-semibold uppercase tracking-wider ${isPro ? "text-pro-dark" : "text-con-dark"}`}>
              {ROUND_LABELS[msg.round]}
            </span>
            <p className="mt-1 text-sm text-ink-800 leading-relaxed">
              {msg.text}
              {msg.streaming && <TypingDots />}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

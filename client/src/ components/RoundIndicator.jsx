const ROUNDS = ["opening", "rebuttal", "closing"];
const LABELS = { opening: "Opening", rebuttal: "Rebuttal", closing: "Closing" };

export default function RoundIndicator({ currentRound, status }) {
  return (
    <div className="flex items-center justify-center gap-2 my-4">
      {ROUNDS.map((r, i) => {
        const roundIdx = ROUNDS.indexOf(currentRound);
        const isDone = roundIdx > i || status === "complete";
        const isActive = r === currentRound;

        return (
          <div key={r} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                  ${isActive ? "bg-ink-900 text-white scale-110" : isDone ? "bg-ink-200 text-ink-600" : "bg-ink-100 text-ink-400"}`}
              >
                {isDone && !isActive ? "✓" : i + 1}
              </div>
              <span className={`text-[10px] font-mono uppercase tracking-wide ${isActive ? "text-ink-900" : "text-ink-400"}`}>
                {LABELS[r]}
              </span>
            </div>
            {i < ROUNDS.length - 1 && (
              <div className={`w-10 h-px mb-4 transition-colors ${isDone ? "bg-ink-400" : "bg-ink-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

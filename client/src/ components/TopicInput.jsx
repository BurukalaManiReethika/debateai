import { useState } from "react";

const SUGGESTIONS = [
  "AI will replace most jobs within 20 years",
  "Social media does more harm than good",
  "Remote work is better than office work",
  "Nuclear energy is the future of clean power",
  "Humans should colonize Mars",
];

export default function TopicInput({ onStart, disabled }) {
  const [topic, setTopic] = useState("");

  const handleSubmit = (t) => {
    const val = (t || topic).trim();
    if (val.length < 3) return;
    onStart(val);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex gap-3">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Enter any debate topic…"
          disabled={disabled}
          className="flex-1 px-4 py-3 rounded-xl border border-ink-200 bg-white text-ink-900 placeholder:text-ink-400 font-body text-base focus:outline-none focus:ring-2 focus:ring-ink-800 disabled:opacity-50 transition"
        />
        <button
          onClick={() => handleSubmit()}
          disabled={disabled || topic.trim().length < 3}
          className="px-6 py-3 bg-ink-900 text-ink-50 rounded-xl font-body font-semibold text-sm hover:bg-ink-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          Debate ⚔️
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => { setTopic(s); handleSubmit(s); }}
            disabled={disabled}
            className="text-xs px-3 py-1.5 rounded-full border border-ink-200 bg-white text-ink-600 hover:border-ink-400 hover:text-ink-900 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

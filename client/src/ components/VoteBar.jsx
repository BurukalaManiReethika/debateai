import { castVote } from "../lib/api.js";

export default function VoteBar({ votes, userVote, onVote }) {
  const total = votes.pro + votes.con;
  const proPct = total === 0 ? 50 : Math.round((votes.pro / total) * 100);
  const conPct = 100 - proPct;

  const hasVoted = !!userVote;

  return (
    <div className="w-full max-w-2xl mx-auto bg-white border border-ink-100 rounded-2xl p-5 animate-fade-in">
      <p className="text-center text-sm font-semibold text-ink-600 mb-4">
        Who made the better case?
      </p>

      {!hasVoted ? (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onVote("pro")}
            className="py-3 px-4 rounded-xl border-2 border-pro text-pro-dark font-semibold text-sm hover:bg-pro-light transition"
          >
            👍 Alex (PRO)
          </button>
          <button
            onClick={() => onVote("con")}
            className="py-3 px-4 rounded-xl border-2 border-con text-con-dark font-semibold text-sm hover:bg-con-light transition"
          >
            👍 Jordan (CON)
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-between text-sm font-semibold">
            <span className="text-pro-dark">Alex (PRO) — {proPct}%</span>
            <span className="text-con-dark">Jordan (CON) — {conPct}%</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden bg-ink-100 flex">
            <div
              className="h-full bg-pro transition-all duration-700 ease-out"
              style={{ width: `${proPct}%` }}
            />
            <div
              className="h-full bg-con transition-all duration-700 ease-out"
              style={{ width: `${conPct}%` }}
            />
          </div>
          <p className="text-center text-xs text-ink-400">
            {total} vote{total !== 1 ? "s" : ""} cast
            {userVote && (
              <span className="ml-2">
                · You voted for <strong>{userVote === "pro" ? "Alex" : "Jordan"}</strong>
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

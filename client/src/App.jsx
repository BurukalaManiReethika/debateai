import { useDebate } from "./hooks/useDebate.js";
import TopicInput from "./components/TopicInput.jsx";
import DebaterPanel from "./components/DebaterPanel.jsx";
import RoundIndicator from "./components/RoundIndicator.jsx";
import VoteBar from "./components/VoteBar.jsx";

export default function App() {
  const { state, run, vote, reset } = useDebate();
  const { status, topic, messages, votes, userVote, currentRound, currentSpeaker, statusMessage, error } = state;

  const isIdle = status === "idle";
  const isActive = status === "running" || status === "loading";
  const isDone = status === "complete";

  return (
    <div className="min-h-screen bg-ink-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-ink-100 bg-white sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={reset} className="flex items-center gap-2 group">
            <span className="text-2xl">⚔️</span>
            <span className="font-display font-bold text-ink-900 text-lg group-hover:text-ink-600 transition">
              DebateAI
            </span>
          </button>
          <span className="text-xs text-ink-400 font-mono hidden sm:block">
            Powered by Claude
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 flex flex-col gap-8">
        {/* Hero */}
        {isIdle && (
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-display text-ink-900 mb-3">
              AI vs AI.<br />
              <span className="italic text-ink-400">You decide.</span>
            </h1>
            <p className="text-ink-600 text-base max-w-md mx-auto mb-8">
              Enter any topic. Two AI debaters argue PRO and CON across three rounds.
              Vote for the winner.
            </p>
          </div>
        )}

        {/* Topic input */}
        <div className={isIdle ? "" : "opacity-80"}>
          <TopicInput onStart={run} disabled={isActive} />
        </div>

        {/* Active topic badge */}
        {!isIdle && topic && (
          <div className="flex items-center justify-center gap-3 animate-fade-in">
            <div className="flex-1 h-px bg-ink-200" />
            <span className="text-xs font-mono text-ink-500 bg-white border border-ink-200 px-3 py-1 rounded-full max-w-sm truncate">
              "{topic}"
            </span>
            <div className="flex-1 h-px bg-ink-200" />
          </div>
        )}

        {/* Status */}
        {isActive && (
          <p className="text-center text-sm text-ink-500 animate-pulse">
            {statusMessage}
          </p>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm text-center">
            {error} —{" "}
            <button onClick={reset} className="underline font-semibold">
              try again
            </button>
          </div>
        )}

        {/* Round indicator */}
        {!isIdle && (
          <RoundIndicator currentRound={currentRound} status={status} />
        )}

        {/* Debate arena */}
        {!isIdle && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
            <DebaterPanel
              side="pro"
              messages={messages.pro}
              isActive={currentSpeaker === "pro"}
              currentRound={currentRound}
            />
            <DebaterPanel
              side="con"
              messages={messages.con}
              isActive={currentSpeaker === "con"}
              currentRound={currentRound}
            />
          </div>
        )}

        {/* Voting */}
        {isDone && (
          <VoteBar votes={votes} userVote={userVote} onVote={vote} />
        )}

        {/* Reset after done */}
        {isDone && (
          <div className="text-center animate-fade-in">
            <button
              onClick={reset}
              className="text-sm text-ink-500 underline underline-offset-4 hover:text-ink-900 transition"
            >
              Start a new debate
            </button>
          </div>
        )}
      </main>

      <footer className="border-t border-ink-100 py-4 text-center text-xs text-ink-400">
        DebateAI · Built with React + Claude API ·{" "}
        <a
          href="https://github.com/yourusername/debateai"
          className="underline hover:text-ink-700"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </footer>
    </div>
  );
}

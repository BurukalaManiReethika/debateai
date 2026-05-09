import { useState, useRef, useCallback } from "react";
import { startDebate, createDebateStream, castVote } from "../lib/api.js";

const INITIAL_STATE = {
  debateId: null,
  topic: "",
  status: "idle", // idle | loading | running | complete | error
  currentRound: null,
  currentSpeaker: null,
  messages: { pro: [], con: [] },
  votes: { pro: 0, con: 0 },
  userVote: null,
  statusMessage: "",
  error: null,
};

export function useDebate() {
  const [state, setState] = useState(INITIAL_STATE);
  const streamRef = useRef(null);
  const liveTextRef = useRef({ pro: "", con: "" });

  const updateState = (patch) => setState((prev) => ({ ...prev, ...patch }));

  const appendChunk = useCallback((side, chunk) => {
    liveTextRef.current[side] += chunk;
    const live = liveTextRef.current[side];
    setState((prev) => {
      const msgs = { ...prev.messages };
      const arr = [...msgs[side]];
      if (arr.length > 0 && arr[arr.length - 1].streaming) {
        arr[arr.length - 1] = { ...arr[arr.length - 1], text: live };
      }
      msgs[side] = arr;
      return { ...prev, messages: msgs };
    });
  }, []);

  const beginSpeaker = useCallback((side, round) => {
    liveTextRef.current[side] = "";
    setState((prev) => {
      const msgs = { ...prev.messages };
      msgs[side] = [...msgs[side], { round, text: "", streaming: true }];
      return { ...prev, messages: msgs, currentSpeaker: side, currentRound: round };
    });
  }, []);

  const finishSpeaker = useCallback((side, round, text) => {
    setState((prev) => {
      const msgs = { ...prev.messages };
      const arr = [...msgs[side]];
      const idx = arr.findLastIndex((m) => m.streaming);
      if (idx !== -1) arr[idx] = { round, text, streaming: false };
      msgs[side] = arr;
      return { ...prev, messages: msgs, currentSpeaker: null };
    });
  }, []);

  const run = useCallback(async (topic) => {
    if (streamRef.current) streamRef.current.close();
    liveTextRef.current = { pro: "", con: "" };

    updateState({
      ...INITIAL_STATE,
      topic,
      status: "loading",
      statusMessage: "Starting debate…",
    });

    try {
      const { debateId } = await startDebate(topic);
      updateState({ debateId, status: "running" });

      const es = createDebateStream(debateId);
      streamRef.current = es;

      es.addEventListener("status", (e) => {
        const { message } = JSON.parse(e.data);
        updateState({ statusMessage: message });
      });

      es.addEventListener("round_start", (e) => {
        const { round } = JSON.parse(e.data);
        updateState({ currentRound: round, statusMessage: `Round: ${round}` });
      });

      es.addEventListener("speaker_start", (e) => {
        const { side, round } = JSON.parse(e.data);
        beginSpeaker(side, round);
      });

      es.addEventListener("chunk", (e) => {
        const { side, chunk } = JSON.parse(e.data);
        appendChunk(side, chunk);
      });

      es.addEventListener("speaker_done", (e) => {
        const { side, round, text } = JSON.parse(e.data);
        finishSpeaker(side, round, text);
      });

      es.addEventListener("debate_done", (e) => {
        const { message } = JSON.parse(e.data);
        updateState({ status: "complete", statusMessage: message, currentRound: null });
        es.close();
      });

      es.addEventListener("error", (e) => {
        const data = e.data ? JSON.parse(e.data) : { message: "Connection lost." };
        updateState({ status: "error", error: data.message });
        es.close();
      });
    } catch (err) {
      updateState({ status: "error", error: err.message });
    }
  }, [beginSpeaker, appendChunk, finishSpeaker]);

  const vote = useCallback(async (side) => {
    if (!state.debateId || state.userVote) return;
    try {
      const { votes } = await castVote(state.debateId, side);
      updateState({ votes, userVote: side });
    } catch {
      // silent fail
    }
  }, [state.debateId, state.userVote]);

  const reset = useCallback(() => {
    if (streamRef.current) streamRef.current.close();
    setState(INITIAL_STATE);
  }, []);

  return { state, run, vote, reset };
}

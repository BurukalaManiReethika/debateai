import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { streamDebateArgument, ROUNDS } from "../services/claude.js";

const router = Router();

// In-memory store for active debates (use Redis/DB in production)
const debates = new Map();

// POST /api/debate/start — create a debate session
router.post("/start", (req, res) => {
  const { topic } = req.body;

  if (!topic || topic.trim().length < 3) {
    return res.status(400).json({ error: "Topic must be at least 3 characters." });
  }

  const id = uuidv4();
  debates.set(id, {
    id,
    topic: topic.trim(),
    createdAt: new Date().toISOString(),
    rounds: [],
    votes: { pro: 0, con: 0 },
    status: "pending",
  });

  res.json({ debateId: id, topic: topic.trim() });
});

// GET /api/debate/stream/:id — SSE stream of the debate
router.get("/stream/:id", async (req, res) => {
  const debate = debates.get(req.params.id);
  if (!debate) return res.status(404).json({ error: "Debate not found." });

  // SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const send = (event, data) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  debate.status = "running";
  send("status", { message: "Debate starting…" });

  try {
    for (const round of ROUNDS) {
      send("round_start", { round });

      // PRO argument
      send("speaker_start", { side: "pro", round });
      let proText = "";
      await streamDebateArgument({
        topic: debate.topic,
        side: "pro",
        round,
        onChunk: (chunk) => {
          proText += chunk;
          send("chunk", { side: "pro", chunk });
        },
        onDone: (full) => {
          debate.rounds.push({ round, side: "pro", text: full });
          send("speaker_done", { side: "pro", round, text: full });
        },
      });

      // Small pause between speakers
      await sleep(600);

      // CON argument
      send("speaker_start", { side: "con", round });
      await streamDebateArgument({
        topic: debate.topic,
        side: "con",
        round,
        onChunk: (chunk) => {
          send("chunk", { side: "con", chunk });
        },
        onDone: (full) => {
          debate.rounds.push({ round, side: "con", text: full });
          send("speaker_done", { side: "con", round, text: full });
        },
      });

      await sleep(400);
    }

    debate.status = "complete";
    send("debate_done", { message: "Debate complete! Cast your vote." });
  } catch (err) {
    console.error("Stream error:", err);
    send("error", { message: "Something went wrong. Please try again." });
  } finally {
    res.end();
  }
});

// POST /api/debate/:id/vote — record a vote
router.post("/:id/vote", (req, res) => {
  const debate = debates.get(req.params.id);
  if (!debate) return res.status(404).json({ error: "Debate not found." });

  const { side } = req.body;
  if (!["pro", "con"].includes(side)) {
    return res.status(400).json({ error: "Side must be 'pro' or 'con'." });
  }

  debate.votes[side]++;
  res.json({ votes: debate.votes });
});

// GET /api/debate/history — list recent debates
router.get("/history", (_, res) => {
  const recent = [...debates.values()]
    .filter((d) => d.status === "complete")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10)
    .map(({ id, topic, createdAt, votes }) => ({ id, topic, createdAt, votes }));

  res.json(recent);
});

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export default router;

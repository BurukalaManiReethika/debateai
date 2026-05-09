const BASE = "/api/debate";

export async function startDebate(topic) {
  const res = await fetch(`${BASE}/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic }),
  });
  if (!res.ok) throw new Error("Failed to start debate");
  return res.json();
}

export function createDebateStream(debateId) {
  return new EventSource(`${BASE}/stream/${debateId}`);
}

export async function castVote(debateId, side) {
  const res = await fetch(`${BASE}/${debateId}/vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ side }),
  });
  if (!res.ok) throw new Error("Vote failed");
  return res.json();
}

export async function fetchHistory() {
  const res = await fetch(`${BASE}/history`);
  if (!res.ok) throw new Error("Failed to fetch history");
  return res.json();
}

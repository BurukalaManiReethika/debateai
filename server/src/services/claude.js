import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const ROUNDS = ["opening", "rebuttal", "closing"];

const ROUND_INSTRUCTIONS = {
  opening:
    "Give your opening statement. State your position clearly and introduce your 2-3 strongest arguments. Be persuasive and confident. Keep it to 3-4 sentences.",
  rebuttal:
    "Give your rebuttal. Address the opponent's likely strongest points and counter them directly. Reinforce your own position. Keep it to 3-4 sentences.",
  closing:
    "Give your closing argument. Summarize why your side has won this debate. Be decisive and compelling. Keep it to 2-3 sentences.",
};

export function getDebaterSystemPrompt(side, topic) {
  const stance = side === "pro" ? "IN FAVOR OF" : "AGAINST";
  const name = side === "pro" ? "Alex" : "Jordan";

  return `You are ${name}, a sharp and confident debater. You are arguing ${stance} the following topic: "${topic}".

Rules:
- Always argue your assigned side, no matter what.
- Be persuasive, specific, and use evidence-based reasoning.
- Keep responses concise and punchy — no bullet points, pure prose.
- Never concede your position or acknowledge the other side might be right.
- Speak in first person, conversationally, as if in a live debate.
- Do NOT start with "I" — vary your opening words.`;
}

export async function streamDebateArgument({ topic, side, round, onChunk, onDone }) {
  const systemPrompt = getDebaterSystemPrompt(side, topic);
  const instruction = ROUND_INSTRUCTIONS[round];

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 300,
    system: systemPrompt,
    messages: [{ role: "user", content: instruction }],
  });

  let fullText = "";

  for await (const chunk of stream) {
    if (
      chunk.type === "content_block_delta" &&
      chunk.delta.type === "text_delta"
    ) {
      fullText += chunk.delta.text;
      onChunk(chunk.delta.text);
    }
  }

  onDone(fullText);
  return fullText;
}

export { ROUNDS };

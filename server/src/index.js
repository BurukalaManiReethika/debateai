import "dotenv/config";
import express from "express";
import cors from "cors";
import debateRoutes from "./routes/debate.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/health", (_, res) => res.json({ status: "ok" }));
app.use("/api/debate", debateRoutes);

app.listen(PORT, () => {
  console.log(`🚀 DebateAI server running on http://localhost:${PORT}`);
});

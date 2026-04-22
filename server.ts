import express from "express";
import { createServer as createViteServer } from "vite";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import cors from "cors";

// --- Types ---
interface Agent {
  id: string;
  name: string;
  role: string;
  model: string;
  status: "idle" | "running" | "failed";
  memory_provider: string;
  tools: string[];
  skills: string[];
}

interface Skill {
  id: string;
  name: string;
  description: string;
  version: string;
}

// --- Data ---
let agents: Agent[] = [
  {
    id: "1",
    name: "Operator Zero",
    role: "Task Executor",
    model: "gemini-3.1-pro-preview",
    status: "idle",
    memory_provider: "LanceDB",
    tools: ["web_search", "code_interpreter"],
    skills: ["skill-1"]
  },
  {
    id: "2",
    name: "Architect Prime",
    role: "System Designer",
    model: "gemini-3.1-pro-preview",
    status: "running",
    memory_provider: "Qdrant",
    tools: ["git_access"],
    skills: ["skill-2"]
  }
];

let skills: Skill[] = [
  { id: "skill-1", name: "Web Scraper", description: "Extracts data from websites", version: "1.0.0" },
  { id: "skill-2", name: "Code Reviewer", description: "Analyzes and suggests improvements to code", version: "1.1.0" }
];

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: { origin: "*" }
  });

  app.use(cors());
  app.use(express.json());

  // --- API Routes ---
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/agents", (req, res) => {
    res.json(agents);
  });

  app.post("/api/agents", (req, res) => {
    const newAgent = { ...req.body, id: Math.random().toString(36).substr(2, 9), status: "idle" };
    agents.push(newAgent);
    io.emit("agent_updated", agents);
    res.json(newAgent);
  });

  app.get("/api/skills", (req, res) => {
    res.json(skills);
  });

  // --- WebSockets ---
  io.on("connection", (socket) => {
    console.log("Client connected");
    socket.emit("init_data", { agents, skills });

    socket.on("run_agent", (agentId) => {
      const agent = agents.find(a => a.id === agentId);
      if (agent) {
        agent.status = "running";
        io.emit("agent_updated", agents);
        
        // Simulating work
        setTimeout(() => {
          agent.status = "idle";
          io.emit("agent_updated", agents);
          io.emit("agent_log", { agentId, message: "Task completed successfully", timestamp: new Date() });
        }, 3000);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const PORT = 3000;
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Mission Control Server running at http://localhost:${PORT}`);
  });
}

startServer();

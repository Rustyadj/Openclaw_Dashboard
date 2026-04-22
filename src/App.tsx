import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Wrench, 
  GitBranch, 
  Database, 
  Terminal, 
  Settings,
  Activity,
  Zap,
  ShieldCheck,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import socket from "./lib/socket";

// Components
import AgentsView from "./components/AgentsView";
import DashboardView from "./components/DashboardView";
import WorkflowEditor from "./components/WorkflowEditor";
import SkillsView from "./components/SkillsView";
import MemoryView from "./components/MemoryView";
import LogsView from "./components/LogsView";

import { cn } from "./lib/utils";
import { Button } from "./components/ui/button";
import { TooltipProvider } from "./components/ui/tooltip";

export default function App() {
  const [agents, setAgents] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    socket.on("init_data", (data) => {
      setAgents(data.agents);
      setSkills(data.skills);
    });

    socket.on("agent_updated", (updatedAgents) => {
      setAgents(updatedAgents);
    });

    socket.on("agent_log", (log) => {
      setLogs(prev => [log, ...prev].slice(0, 100));
    });

    return () => {
      socket.off("init_data");
      socket.off("agent_updated");
      socket.off("agent_log");
    };
  }, []);

  return (
    <TooltipProvider>
      <Router>
        <AppLayout agents={agents} skills={skills} logs={logs} />
      </Router>
    </TooltipProvider>
  );
}

function AppLayout({ agents, skills, logs }: { agents: any[], skills: any[], logs: any[] }) {
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-background text-zinc-100 font-sans selection:bg-emerald-500 selection:text-zinc-950">
      {/* Left Sidebar */}
      <aside className="w-64 border-r border-border flex flex-col z-20 bg-card">
        <div className="p-6 border-b border-border flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center text-zinc-950 font-bold">
            C
          </div>
          <span className="font-semibold text-zinc-100 tracking-tight">COMMAND CENTER</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4 px-2">Orchestration</div>
          <SidebarLink to="/" icon={<LayoutDashboard size={16} />} label="Dashboard" />
          <SidebarLink to="/agents" icon={<Users size={16} />} label="Agents" count={agents.length} />
          <SidebarLink to="/skills" icon={<Wrench size={16} />} label="Skills" />
          <SidebarLink to="/workflows" icon={<GitBranch size={16} />} label="Workflows" />
          
          <div className="pt-8 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4 px-2">Engine</div>
          <SidebarLink to="/memory" icon={<Database size={16} />} label="Memory Vault" />
          <SidebarLink to="/logs" icon={<Terminal size={16} />} label="Log Console" />
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-2 px-2 text-zinc-200 italic">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono tracking-tight">Cluster: GCP-US-CENTRAL</span>
          </div>
          <div className="w-full bg-secondary h-1.5 rounded overflow-hidden shadow-inner">
            <div 
              className="bg-emerald-500 h-full transition-all duration-700 ease-out" 
              style={{ width: `${(agents.filter(a => a.status === 'running').length / Math.max(agents.length, 1)) * 100}%` }}
            />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Bar - Header */}
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-md flex items-center justify-between px-8 z-10">
          <div className="flex gap-8">
            <HeaderStat label="System Latency" value="4ms" />
            <HeaderStat label="Active Threads" value={agents.filter(a => a.status === 'running').length.toString()} />
            <HeaderStat label="Session Resource" value="0.012% / m" />
          </div>

          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs rounded-md uppercase tracking-wider shadow-lg shadow-emerald-500/10 transition-all active:scale-95">
              New Agent
            </button>
            <div className="w-8 h-8 rounded-full border border-border bg-secondary flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-glow" />
            </div>
          </div>
        </header>

        {/* Viewport */}
        <div className="flex-1 overflow-auto p-8 bg-background relative">
          <div className="absolute inset-0 geometric-grid opacity-20 pointer-events-none" />
          <div className="relative z-10 h-full">
            <Routes location={location}>
              <Route path="/" element={<DashboardView agents={agents} skills={skills} logs={logs} />} />
              <Route path="/agents" element={<AgentsView agents={agents} />} />
              <Route path="/skills" element={<SkillsView skills={skills} />} />
              <Route path="/workflows" element={<WorkflowEditor />} />
              <Route path="/memory" element={<MemoryView />} />
              <Route path="/logs" element={<LogsView logs={logs} />} />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarLink({ to, icon, label, count }: { to: string, icon: React.ReactNode, label: string, count?: number }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to} 
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all group",
        isActive 
          ? "bg-secondary text-zinc-100 border border-border font-medium" 
          : "text-zinc-400 hover:bg-secondary hover:text-zinc-200"
      )}
    >
      <span className={cn("transition-colors", isActive ? "text-emerald-500" : "text-zinc-500 group-hover:text-zinc-300")}>
        {icon}
      </span>
      {label}
      {count !== undefined && (
        <span className="ml-auto text-[10px] bg-background px-1.5 py-0.5 rounded text-zinc-500 font-mono">
          {count}
        </span>
      )}
    </Link>
  );
}

function HeaderStat({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-tight">{label}</span>
      <span className="text-zinc-100 font-mono text-sm">{value}</span>
    </div>
  );
}


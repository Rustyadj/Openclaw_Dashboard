import React from "react";
import { motion } from "motion/react";
import { 
  Play, 
  Settings, 
  Trash2, 
  MoreVertical,
  Cpu,
  Layers,
  Activity,
  Plus,
  Terminal
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";
import socket from "../lib/socket";

export default function AgentsView({ agents }: { agents: any[] }) {
  const runAgent = (agentId: string) => {
    socket.emit("run_agent", agentId);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100 italic">Agent Workforce</h2>
          <p className="text-zinc-500 text-sm font-medium">Managing autonomous nodes across active sectors.</p>
        </div>
        <Button className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold uppercase tracking-widest text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
          <Plus size={14} className="mr-2" /> Deploy Node
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <Card key={agent.id} className="bg-card border-border group hover:border-zinc-500 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/50 mb-4 pt-4 px-6">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  agent.status === 'running' ? "bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-zinc-700"
                )} />
                <div>
                  <CardTitle className="text-sm font-bold text-zinc-100">{agent.name}</CardTitle>
                  <p className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-tighter leading-none mt-1">ID: {agent.id}</p>
                </div>
              </div>
              <Badge className={cn(
                "text-[10px] font-bold uppercase tracking-widest",
                agent.status === 'running' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-muted text-zinc-500 border-border"
              )}>
                {agent.status}
              </Badge>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                    <Cpu size={10} className="text-emerald-500" /> Model Route
                  </span>
                  <p className="text-xs font-medium text-zinc-100">{agent.model}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                    <Layers size={10} className="text-blue-400" /> Memory
                  </span>
                  <p className="text-xs font-medium text-zinc-100">{agent.memory_provider || agent.memory}</p>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Skills Manifest</span>
                <div className="flex flex-wrap gap-1.5">
                  {agent.skills.map((skill: string) => (
                    <Badge key={skill} variant="secondary" className="text-[9px] bg-muted border-border text-zinc-400 font-bold uppercase">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button 
                  onClick={() => runAgent(agent.id)}
                  disabled={agent.status === 'running'}
                  className={cn(
                    "flex-1 font-bold text-[10px] uppercase tracking-widest transition-all h-9",
                    agent.status === 'running' 
                      ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" 
                      : "bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-lg shadow-emerald-500/10"
                  )}
                >
                  <Play size={12} className={cn("mr-2", agent.status === 'running' ? "text-zinc-600" : "fill-current")} />
                  Initiate Mission
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="bg-muted border-border text-zinc-400 hover:text-zinc-100 h-9 w-9">
                      <Settings size={14} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-card border-border text-zinc-300">
                    <DropdownMenuItem className="focus:bg-muted focus:text-zinc-100 text-xs">Configure Node</DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-muted focus:text-zinc-100 text-xs text-rose-400">Decommission</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}

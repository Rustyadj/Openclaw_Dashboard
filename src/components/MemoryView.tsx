import React from "react";
import { motion } from "motion/react";
import { Database, Search, HardDrive, Share2, Layers, Cpu, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

export default function MemoryView() {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100 italic">Memory Architecture</h2>
          <p className="text-zinc-500 text-sm font-medium">Neural vector storage and namespace orchestration.</p>
        </div>
        <Button className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold uppercase tracking-widest text-[10px] h-10 px-4 shadow-lg shadow-emerald-500/10 transition-all active:scale-95">
          <Database size={14} className="mr-2" /> Provision Repository
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MemoryStatsCard title="Total Embeddings" value="482,801" icon={<Layers size={18} className="text-emerald-500" />} detail="Module: Text-Embedding-004" />
        <MemoryStatsCard title="Cluster Capacity" value="1.2 TB" icon={<HardDrive size={18} className="text-blue-400" />} detail="88% headroom available" />
        <MemoryStatsCard title="Retrieve Precision" value="96.4%" icon={<Cpu size={18} className="text-amber-500" />} detail="Top-k semantic match" />
      </div>

      <Card className="bg-card border-border shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between py-6 px-8 border-b border-border/50">
          <div>
            <CardTitle className="text-lg font-bold text-zinc-100 uppercase tracking-tighter">Memory Namespaces</CardTitle>
            <CardDescription className="text-zinc-500 text-xs font-medium italic">Isolated storage per agent sequence.</CardDescription>
          </div>
          <div className="relative">
             <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
             <Input placeholder="Search repositories..." className="bg-muted border-border text-zinc-100 pl-9 w-64 h-9 text-xs focus:border-zinc-700 font-medium" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/30">
            <MemoryItem name="namespace_alpha_prime" type="LanceDB" records="124,000" lastUsed="2m ago" status="Active" color="bg-emerald-500" />
            <MemoryItem name="shadow_vector_cluster" type="Qdrant" records="5,201" lastUsed="15m ago" status="Active" color="bg-blue-400" />
            <MemoryItem name="legacy_archive_node" type="Pinecone" records="2,400" lastUsed="4d ago" status="Standby" color="bg-zinc-700" />
            <MemoryItem name="realtime_stream_buffer" type="Redis" records="0" lastUsed="Never" status="Failed" color="bg-rose-500" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function MemoryStatsCard({ title, value, icon, detail }: { title: string, value: string, icon: React.ReactNode, detail: string }) {
  return (
    <Card className="bg-card border-border group hover:border-zinc-500 transition-all overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-md bg-muted border border-border flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-500">
            {icon}
          </div>
          <Button variant="ghost" size="icon" className="text-zinc-600 hover:text-zinc-400 h-8 w-8 transition-colors">
            <Share2 size={14}/>
          </Button>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-2">{title}</p>
          <h3 className="text-2xl font-mono font-bold text-zinc-100">{value}</h3>
          <p className="text-[10px] font-bold text-zinc-600 uppercase italic tracking-tight">{detail}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function MemoryItem({ name, type, records, lastUsed, status, color }: { name: string, type: string, records: string, lastUsed: string, status: string, color: string }) {
  return (
    <div className="flex items-center justify-between py-4 px-8 hover:bg-muted/30 transition-all group">
      <div className="flex items-center gap-6">
        <div className="w-1.5 h-8 bg-muted group-hover:bg-accent rounded-full overflow-hidden transition-colors">
          <div className={cn("w-full h-1/2 opacity-50", color)} />
        </div>
        <div>
          <p className="font-bold text-zinc-100 leading-none mb-2 italic tracking-tight group-hover:text-emerald-500 transition-colors uppercase text-sm">{name}</p>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 font-mono">{type}</span>
            <span className="text-[10px] font-bold text-zinc-700">•</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 font-mono italic">{records} VECTORS</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-12">
        <div className="text-right hidden sm:block">
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none mb-1">Last Sync</p>
          <span className="text-[11px] font-bold text-zinc-400 font-mono italic">{lastUsed}</span>
        </div>
        <div className="text-right flex flex-col items-end">
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none mb-1.5">Sector Status</p>
          <Badge className={cn(
             "text-[9px] font-extrabold uppercase tracking-widest border px-1.5 py-0",
             status === 'Active' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : 
             status === 'Standby' ? "bg-muted text-zinc-600 border-border" :
             "bg-rose-500/10 text-rose-500 border-rose-500/20"
          )}>
            {status}
          </Badge>
        </div>
        <Button variant="ghost" size="icon" className="text-zinc-600 hover:text-zinc-300 transition-all hover:translate-x-1">
          <ChevronRight size={18}/>
        </Button>
      </div>
    </div>
  );
}

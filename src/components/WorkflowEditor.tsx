import React, { useCallback } from "react";
import { motion } from "motion/react";
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Save, Play, Plus, Activity, Boxes, History } from "lucide-react";
import { cn } from "@/lib/utils";

const initialNodes = [
  { id: '1', position: { x: 50, y: 50 }, data: { label: 'TRIGGER: NEW_EVENT' }, type: 'input', className: '!bg-card !border-emerald-500/50 !text-emerald-500 !font-bold !text-[10px] !uppercase !tracking-widest rounded shadow-[0_0_15px_rgba(16,185,129,0.1)]' },
  { id: '2', position: { x: 50, y: 150 }, data: { label: 'AGENT: ORCHESTRATOR' }, className: '!bg-card !border-blue-500/50 !text-blue-400 !font-bold !text-[10px] !uppercase !tracking-widest rounded shadow-[0_0_15px_rgba(96,165,250,0.1)]' },
  { id: '3', position: { x: 50, y: 250 }, data: { label: 'SKILL: DATA_PARSER' }, className: '!bg-card !border-border !text-zinc-300 !font-bold !text-[10px] !uppercase !tracking-widest rounded shadow-2xl' },
  { id: '4', position: { x: 50, y: 350 }, data: { label: 'STORAGE: MEMORY_VAULT' }, type: 'output', className: '!bg-card !border-amber-500/50 !text-amber-500 !font-bold !text-[10px] !uppercase !tracking-widest rounded shadow-[0_0_15px_rgba(245,158,11,0.1)]' },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#10b981' } },
  { id: 'e2-3', source: '2', target: '3', style: { stroke: '#3f3f46' } },
  { id: 'e3-4', source: '3', target: '4', style: { stroke: '#3f3f46' } },
];

export default function WorkflowEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes as any);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex flex-col gap-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100 italic">Workflow Canvas</h2>
          <p className="text-zinc-500 text-sm font-medium">Visualizing data execution paths through autonomous node sequences.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-muted border-border text-zinc-400 hover:text-zinc-100 font-bold text-[10px] uppercase tracking-widest h-9 transition-all">
            <Save size={14}/> Save Draft
          </Button>
          <Button className="gap-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-[10px] uppercase tracking-widest h-9 shadow-lg shadow-emerald-500/20 transition-all active:scale-95">
            <Play size={14} className="fill-current"/> Deploy Pipeline
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-[500px] border border-border rounded-lg overflow-hidden relative bg-background">
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          <Button size="sm" className="bg-muted border border-border text-zinc-100 font-bold text-[10px] uppercase tracking-widest shadow-2xl hover:bg-secondary transition-all">
            <Plus size={14} className="mr-2 text-emerald-500" /> Insert Component
          </Button>
        </div>
        
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          className="geometric-grid opacity-80"
        >
          <Background color="#3f3f46" gap={24} size={1} />
          <Controls className="!bg-muted !border-border !text-zinc-400 fill-zinc-400" />
          <MiniMap 
            className="!bg-muted !border-border !bottom-4 !right-4 rounded shadow-2xl" 
            nodeColor={(n: any) => {
               if (n.type === 'input') return '#10b981';
               if (n.type === 'output') return '#f59e0b';
               return '#3b82f6';
            }} 
            maskColor="rgba(9, 9, 11, 0.7)"
          />
        </ReactFlow>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InspectorCard 
          icon={<Boxes size={14} className="text-zinc-500" />} 
          title="Component Properties" 
          content={<p className="text-[11px] text-zinc-500 italic font-medium">Select a canvas element to inspect metadata.</p>} 
        />
        <InspectorCard 
          icon={<Activity size={14} className="text-emerald-500" />} 
          title="Telemetry Data" 
          content={
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase">
                <span className="text-zinc-500">Pipeline Success</span>
                <span className="text-emerald-500">99.98%</span>
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase">
                <span className="text-zinc-500">Cycle Duration</span>
                <span className="text-zinc-100 font-mono italic">1.2ms avg</span>
              </div>
            </div>
          } 
        />
        <InspectorCard 
          icon={<History size={14} className="text-blue-400" />} 
          title="Trace Console" 
          content={
            <div className="text-[10px] font-mono text-zinc-500 leading-relaxed font-medium">
              [SYSTEM] INITIALIZING VECTOR_BUFFER... DONE<br/>
              [AGENT] APPLYING MASK_STRATEGY... DONE<br/>
              [SKILL] PARSING STREAM_CHUNK_02...
            </div>
          } 
        />
      </div>
    </motion.div>
  );
}

function InspectorCard({ icon, title, content }: { icon: React.ReactNode, title: string, content: React.ReactNode }) {
  return (
    <Card className="bg-card border-border shadow-xl group hover:border-zinc-500 transition-colors">
      <CardHeader className="py-3 border-b border-border/50 mb-3 px-5">
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-zinc-100">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        {content}
      </CardContent>
    </Card>
  );
}

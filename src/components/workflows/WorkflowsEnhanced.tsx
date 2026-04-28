import React, { useMemo, useState } from 'react';
import { workflowsApi } from '../../lib/api';
import { useCommandStore, type WorkflowNode } from '../../stores/useCommandStore';
import { ErrorMessage, LoadingSpinner } from '../ui/AsyncState';
import { Eyebrow, GlassCard, PageShell, PrimaryButton, SecondaryButton, SectionHeader, Segmented } from '../ui/premium';

type DragState = { id: string; offsetX: number; offsetY: number } | null;

const presets = ['Board Motion Flow', 'Legal Intake Flow', 'Growth Brief Flow', 'Private Workspace Sync'];
const palette = [
  { name: 'Trigger', icon: '⚡', color: '#00E6A8' },
  { name: 'Agent', icon: '◎', color: '#60a5fa' },
  { name: 'Skill', icon: '✦', color: '#a78bfa' },
  { name: 'Condition', icon: '◌', color: '#fbbf24' },
  { name: 'Storage', icon: '◫', color: '#94a3b8' },
  { name: 'Action', icon: '↗', color: '#fb7185' },
];

export function WorkflowsEnhanced() {
  const [view, setView] = useState('Canvas');
  const [preset, setPreset] = useState(presets[0]);
  const activeWorkflowId = useCommandStore(state => state.workflowStore.activeWorkflowId);
  const workflow = useCommandStore(state => state.workflowStore.workflows.find(flow => flow.id === state.workflowStore.activeWorkflowId));
  const updateWorkflowNodes = useCommandStore(state => state.updateWorkflowNodes);
  const markWorkflowDeployed = useCommandStore(state => state.markWorkflowDeployed);
  const [selectedId, setSelectedId] = useState(workflow?.nodes[1]?.id || null);
  const [drag, setDrag] = useState<DragState>(null);
  const [deploying, setDeploying] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const nodes = workflow?.nodes || [];
  const selected = useMemo(() => nodes.find(node => node.id === selectedId) || nodes[0] || null, [nodes, selectedId]);

  const moveNode = (id: string, x: number, y: number) => updateWorkflowNodes(activeWorkflowId, nodes.map(node => node.id === id ? { ...node, x: Math.max(20, x), y: Math.max(20, y) } : node));
  const deploy = async () => {
    if (!workflow) return;
    setDeploying(true);
    setError(null);
    try {
      await workflowsApi.save(workflow);
      await workflowsApi.deploy(workflow);
      markWorkflowDeployed(workflow.id);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setDeploying(false);
    }
  };

  return (
    <PageShell style={{ gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <SectionHeader title="Workflow builder" subtitle="Premium drag/drop orchestration canvas for triggers, actions, skills, storage, and AI agents" />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Segmented options={['Canvas', 'Runs', 'Templates']} value={view} onChange={setView} />
          <PrimaryButton onClick={deploy}>{deploying ? 'Deploying…' : 'Deploy workflow'}</PrimaryButton>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px minmax(0,1fr) 320px', gap: 16, minHeight: 680 }}>
        <GlassCard>
          <SectionHeader title="Templates" subtitle="Reusable premium flows" />
          <div style={{ marginTop: 14, display: 'grid', gap: 8 }}>
            {presets.map(item => (
              <button key={item} onClick={() => setPreset(item)} style={{ textAlign: 'left', padding: '12px 14px', borderRadius: 16, border: preset === item ? '1px solid rgba(0,230,168,0.3)' : '1px solid rgba(255,255,255,0.08)', background: preset === item ? 'rgba(0,230,168,0.1)' : 'rgba(255,255,255,0.04)', color: preset === item ? 'var(--accent-dark)' : 'var(--text-primary)', cursor: 'pointer', fontWeight: 700 }}>{item}</button>
            ))}
          </div>
          <div style={{ marginTop: 18 }}>
            <Eyebrow>Node palette</Eyebrow>
            <div style={{ marginTop: 10, display: 'grid', gap: 8 }}>
              {palette.map(node => (
                <div key={node.name} style={{ padding: '10px 12px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 12, background: `${node.color}20`, border: `1px solid ${node.color}44`, display: 'grid', placeItems: 'center', color: node.color }}>{node.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{node.name}</div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        <GlassCard strong style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: 18, borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800 }}>{preset}</div>
              <div style={{ marginTop: 4, fontSize: 12, color: 'var(--text-muted)' }}>Visual node editor with elegant spacing, enterprise polish, and AI-first flow design</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <SecondaryButton>Save draft</SecondaryButton>
              <PrimaryButton>+ Insert node</PrimaryButton>
            </div>
          </div>
          <div style={{ position: 'relative', minHeight: 600, background: 'rgba(255,255,255,0.03)', backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
              <Connector from={[170, 112]} to={[330, 112]} />
              <Connector from={[430, 112]} to={[600, 112]} />
              <Connector from={[380, 138]} to={[380, 250]} />
              <Connector from={[560, 138]} to={[560, 250]} />
            </svg>
            {nodes.map(node => (
              <button
                key={node.id}
                onPointerDown={event => {
                  const rect = event.currentTarget.parentElement?.getBoundingClientRect();
                  if (!rect) return;
                  setDrag({ id: node.id, offsetX: event.clientX - rect.left - node.x, offsetY: event.clientY - rect.top - node.y });
                  event.currentTarget.setPointerCapture(event.pointerId);
                }}
                onPointerMove={event => {
                  if (!drag || drag.id !== node.id) return;
                  const rect = event.currentTarget.parentElement?.getBoundingClientRect();
                  if (!rect) return;
                  moveNode(node.id, event.clientX - rect.left - drag.offsetX, event.clientY - rect.top - drag.offsetY);
                }}
                onPointerUp={() => setDrag(null)}
                onClick={() => setSelectedId(node.id)}
                style={{ position: 'absolute', left: node.x, top: node.y, width: 200, textAlign: 'left', padding: '14px 16px', borderRadius: 20, border: selected?.id === node.id ? `1px solid ${node.color}` : '1px solid rgba(255,255,255,0.1)', background: 'rgba(11,16,24,0.82)', color: 'var(--text-primary)', cursor: drag?.id === node.id ? 'grabbing' : 'grab', touchAction: 'none', boxShadow: selected?.id === node.id ? `0 18px 38px ${node.color}22` : '0 14px 28px rgba(8,12,19,0.18)' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 14, background: `${node.color}18`, border: `1px solid ${node.color}44`, display: 'grid', placeItems: 'center', color: node.color }}>{node.icon}</div>
                  <div>
                    <div style={{ fontSize: 10, color: node.color, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>{node.type}</div>
                    <div style={{ marginTop: 3, fontSize: 13, fontWeight: 700 }}>{node.title}</div>
                    <div style={{ marginTop: 4, fontSize: 11, color: 'var(--text-muted)' }}>{node.detail}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          {deploying && <LoadingSpinner label="Deploying workflow…" />}
          <ErrorMessage error={error} />
          <SectionHeader title={selected?.title || 'Node details'} subtitle="Triggers / actions / skills / storage" />
          {selected ? (
            <div style={{ marginTop: 14, display: 'grid', gap: 14 }}>
              <div style={{ padding: 16, borderRadius: 18, background: `${selected.color}12`, border: `1px solid ${selected.color}30` }}>
                <Eyebrow>{selected.type}</Eyebrow>
                <div style={{ marginTop: 10, fontSize: 16, fontWeight: 800 }}>{selected.title}</div>
                <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{selected.detail}</div>
              </div>
              {['Inputs', 'Outputs', 'Automation options'].map(section => (
                <div key={section}>
                  <Eyebrow>{section}</Eyebrow>
                  <div style={{ marginTop: 10, display: 'grid', gap: 8 }}>
                    <div style={{ padding: '10px 12px', borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', fontSize: 12, color: 'var(--text-secondary)' }}>Production-ready config surface for {section.toLowerCase()}.</div>
                  </div>
                </div>
              ))}
            </div>
          ) : <div style={{ marginTop: 16, fontSize: 12, color: 'var(--text-muted)' }}>Select a node on the canvas.</div>}
        </GlassCard>
      </div>
    </PageShell>
  );
}

function Connector({ from, to }: { from: [number, number]; to: [number, number] }) {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const c1 = x1 + (x2 - x1) / 2;
  const c2 = x1 + (x2 - x1) / 2;
  return <path d={`M${x1} ${y1} C ${c1} ${y1}, ${c2} ${y2}, ${x2} ${y2}`} stroke="rgba(255,255,255,0.16)" strokeWidth="2" fill="none" strokeDasharray="5 5" />;
}

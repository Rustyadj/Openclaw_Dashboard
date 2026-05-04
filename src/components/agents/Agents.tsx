import React, { useMemo, useState } from 'react';
import { agentsApi } from '../../lib/api';
import { useCommandStore, type AgentRecord } from '../../stores/useCommandStore';
import { ErrorMessage } from '../ui/AsyncState';
import { Eyebrow, GlassCard, PageShell, PrimaryButton, ProgressBar, SecondaryButton, SectionHeader, Segmented } from '../ui/premium';

export default function Agents() {
  const [layout, setLayout] = useState('Grid');
  const agents = useCommandStore(state => state.agentsStore.agents);
  const selectedId = useCommandStore(state => state.agentsStore.selectedAgentId);
  const selectAgent = useCommandStore(state => state.selectAgent);
  const addAgent = useCommandStore(state => state.addAgent);
  const cloneAgent = useCommandStore(state => state.cloneAgent);
  const disableAgent = useCommandStore(state => state.disableAgent);
  const [createOpen, setCreateOpen] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const selected = useMemo(() => agents.find(agent => agent.id === selectedId) || agents[0], [agents, selectedId]);

  const createAgent = async (agent: AgentRecord) => {
    setError(null);
    try {
      const created = await agentsApi.create(agent);
      addAgent(created);
      setCreateOpen(false);
    } catch (err) {
      const normalized = err instanceof Error ? err : new Error(String(err));
      setError(normalized);
    }
  };

  return (
    <PageShell>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <SectionHeader title="Agent workforce" subtitle="Card/grid control surface with live status, assigned tasks, tools, memory, and workflows" />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Segmented options={['Grid', 'Cards', 'Roster']} value={layout} onChange={setLayout} />
          <PrimaryButton onClick={() => setCreateOpen(true)}>+ Create agent</PrimaryButton>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.5fr) 360px', gap: 16, alignItems: 'start' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
          {agents.map(agent => (
            <GlassCard key={agent.id} style={{ cursor: 'pointer', borderColor: selected.id === agent.id ? `${agent.color}55` : undefined }}>
              <div onClick={() => selectAgent(agent.id)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'start' }}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 16, background: `${agent.color}20`, border: `1px solid ${agent.color}44`, display: 'grid', placeItems: 'center', color: agent.color, fontWeight: 800 }}>{agent.name.split(' ').map(s => s[0]).join('').slice(0,2)}</div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 800 }}>{agent.name}</div>
                      <div style={{ marginTop: 4, fontSize: 11, color: 'var(--text-muted)' }}>{agent.model}</div>
                    </div>
                  </div>
                  <span className={`tag ${agent.status === 'Active' ? 'tag-green' : agent.status === 'Busy' ? 'tag-amber' : 'tag-blue'}`}>{agent.status}</span>
                </div>
                <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{agent.summary}</div>
                <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                  <Mini label="Tasks" value={String(agent.tasks)} />
                  <Mini label="Tools" value={String(agent.tools)} />
                  <Mini label="Workflows" value={String(agent.workflows)} />
                  <Mini label="Memory" value={`${agent.memory}%`} />
                </div>
                <div style={{ marginTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Memory scope / readiness</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: agent.color }}>{agent.memory}%</span>
                  </div>
                  <ProgressBar value={agent.memory} tone={agent.color} />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        <GlassCard strong>
          <SectionHeader title={selected.name} subtitle="Assigned tasks, tools, memory, and workflow footprint" action={<SecondaryButton>Configure</SecondaryButton>} />
          <div style={{ marginTop: 14, display: 'grid', gap: 14 }}>
            <div style={{ padding: 16, borderRadius: 18, background: `${selected.color}12`, border: `1px solid ${selected.color}30` }}>
              <Eyebrow>Live status</Eyebrow>
              <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.06em' }}>{selected.tasks}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>assigned tasks</div>
                </div>
                <div>
                  <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.06em' }}>{selected.workflows}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>connected workflows</div>
                </div>
              </div>
            </div>
            {['Tool stack', 'Memory scopes', 'Workflow bindings'].map(section => (
              <div key={section}>
                <Eyebrow>{section}</Eyebrow>
                <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {section === 'Tool stack' && ['Browser', 'Docs', 'Memory', 'Search', 'Metrics'].map(i => <span key={i} className="tag tag-blue">{i}</span>)}
                  {section === 'Memory scopes' && ['Project', 'Org', 'Private'].map(i => <span key={i} className="tag tag-violet">{i}</span>)}
                  {section === 'Workflow bindings' && ['Board Pack', 'Growth Brief', 'Legal Intake'].map(i => <span key={i} className="tag tag-accent">{i}</span>)}
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <PrimaryButton>Chat with {selected.name}</PrimaryButton>
              <SecondaryButton onClick={() => cloneAgent(selected.id)}>Clone</SecondaryButton>
              <SecondaryButton onClick={async () => { await agentsApi.disable(selected.id); disableAgent(selected.id); }}>Disable</SecondaryButton>
            </div>
            <div>
              <Eyebrow>Agent logs</Eyebrow>
              <div style={{ marginTop: 8, display: 'grid', gap: 6 }}>
                {(selected.logs || ['No logs yet']).map((line, idx) => <div key={idx} style={{ fontSize: 12, color: 'var(--text-muted)', padding: '8px 10px', borderRadius: 12, background: 'rgba(255,255,255,0.04)' }}>{line}</div>)}
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
      <ErrorMessage error={error} />
      {createOpen && <CreateAgentModal onClose={() => setCreateOpen(false)} onCreate={createAgent} />}
    </PageShell>
  );
}

function CreateAgentModal({ onClose, onCreate }: { onClose: () => void; onCreate: (agent: AgentRecord) => Promise<void> }) {
  const [name, setName] = useState('');
  const [type, setType] = useState<AgentRecord['type']>('Agent');
  const [model, setModel] = useState('openai-codex/gpt-5.5-oauth');
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const valid = name.trim().length >= 2 && model.trim().length >= 3;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(5,8,13,0.48)', display: 'grid', placeItems: 'center', padding: 20 }}>
      <GlassCard strong style={{ width: 'min(100%, 520px)' }}>
        <SectionHeader title="Create agent" subtitle="Sub-Agent, Agent, or Agent Team" />
        <div style={{ display: 'grid', gap: 12, marginTop: 14 }}>
          <Segmented options={['Sub-Agent', 'Agent', 'Agent Team']} value={type || 'Agent'} onChange={(value) => setType(value as AgentRecord['type'])} />
          <Input label="Name" value={name} onChange={setName} error={!name.trim() && error ? 'Name is required.' : ''} />
          <Input label="Model" value={model} onChange={setModel} error={!model.trim() && error ? 'Model is required.' : ''} />
          <Input label="Summary" value={summary} onChange={setSummary} />
          {error && <div style={{ color: 'var(--status-red)', fontSize: 12 }}>{error}</div>}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
            <PrimaryButton onClick={async () => {
              if (!valid) { setError('Fix the required fields first.'); return; }
              await onCreate({ id: crypto.randomUUID(), name: name.trim(), type, model: model.trim(), status: 'Active', color: '#00E6A8', tasks: 0, tools: 0, memory: 0, workflows: 0, summary: summary.trim() || 'New agent ready for assignment.', logs: ['Created from Command Center'] });
            }}>Create</PrimaryButton>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

function Input({ label, value, onChange, error }: { label: string; value: string; onChange: (value: string) => void; error?: string }) {
  return <label style={{ display: 'grid', gap: 5 }}><span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>{label}</span><input value={value} onChange={e => onChange(e.target.value)} style={{ height: 42, borderRadius: 12, border: error ? '1px solid rgba(239,68,68,0.45)' : '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.06)', color: 'var(--text-primary)', padding: '0 12px' }} />{error && <span style={{ color: 'var(--status-red)', fontSize: 11 }}>{error}</span>}</label>;
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: '10px 12px', borderRadius: 16, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</div>
      <div style={{ marginTop: 6, fontSize: 18, fontWeight: 800 }}>{value}</div>
    </div>
  );
}

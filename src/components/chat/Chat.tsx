import React, { useEffect, useMemo, useRef, useState } from 'react';
import { chatApi } from '../../lib/api';
import { useCommandStore } from '../../stores/useCommandStore';
import { ErrorMessage, LoadingSpinner } from '../ui/AsyncState';
import { Eyebrow, GlassCard, PageShell, PrimaryButton, SecondaryButton, Segmented, SectionHeader } from '../ui/premium';

const threads = [
  { name: 'Board Strategy', type: 'Board', active: true, unread: 0 },
  { name: 'Legal Intake', type: 'Project', active: false, unread: 4 },
  { name: 'Personal Ops', type: 'Private', active: false, unread: 1 },
  { name: 'Agent Room', type: 'AI-only', active: false, unread: 2 },
];

const folders = [
  { name: 'Executive', count: 12 },
  { name: 'Client Ops', count: 8 },
  { name: 'Growth', count: 5 },
];

const agents = ['Orchestrator', 'Strategy Lead', 'Legal Ops', 'Research Agent'];
const models = ['Claude Sonnet 4.6', 'ChatGPT 5.4', 'Gemini 2.5 Pro', 'DeepSeek V3.2', 'openai-codex/gpt-5.5'];
const memoryScopes = ['Project', 'Organization', 'Personal', 'Global'];

export default function Chat() {
  const messages = useCommandStore(state => state.chat.messages);
  const addChatMessage = useCommandStore(state => state.addChatMessage);
  const updateChatMessage = useCommandStore(state => state.updateChatMessage);
  const upsertMemory = useCommandStore(state => state.upsertMemory);
  const logActivity = useCommandStore(state => state.logActivity);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [thread, setThread] = useState(threads[0].name);
  const [agent, setAgent] = useState(agents[0]);
  const [model, setModel] = useState(models[0]);
  const [memoryScope, setMemoryScope] = useState(memoryScopes[1]);
  const [composerMode, setComposerMode] = useState('Chat');
  const bottomRef = useRef<HTMLDivElement>(null);

  const visibleMessages = useMemo(() => messages.filter(message => !message.threadId || message.threadId === thread), [messages, thread]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [visibleMessages, sending]);

  const chips = useMemo(() => [
    { label: agent, tone: 'tag-accent' },
    { label: model, tone: 'tag-blue' },
    { label: `${memoryScope} memory`, tone: 'tag-violet' },
  ], [agent, model, memoryScope]);

  const send = async () => {
    const text = draft.trim();
    if (!text || sending) return;
    const now = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const userMessage = { id: `${Date.now()}-u`, role: 'user' as const, author: 'Rusty', time: now, text, threadId: thread, agent, model, memoryScope };
    const pendingId = `${Date.now()}-a`;
    addChatMessage(userMessage);
    addChatMessage({ id: pendingId, role: 'assistant', author: agent, time: now, text: 'Routing to agent backend…', threadId: thread, agent, model, memoryScope });
    setDraft('');
    setSending(true);
    setError(null);
    try {
      const response = await chatApi.send({ threadId: thread, message: text, agent, model, memoryScope, history: visibleMessages });
      updateChatMessage(pendingId, response.message);
      response.memory?.forEach(upsertMemory);
      logActivity(`${agent} answered in ${thread}`);
    } catch (err) {
      const normalized = err instanceof Error ? err : new Error(String(err));
      setError(normalized);
      updateChatMessage(pendingId, { text: `Backend error: ${normalized.message}` });
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '300px minmax(0,1fr) 300px', height: '100%', overflow: 'hidden' }}>
      <div style={{ padding: 18, borderRight: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.28)', display: 'grid', gap: 16, overflowY: 'auto' }}>
        <GlassCard>
          <SectionHeader title="Chat workspace" subtitle="Project folders and conversation spaces" action={<PrimaryButton style={{ padding: '8px 12px' }}>+ New</PrimaryButton>} />
          <div style={{ display: 'grid', gap: 10 }}>
            {folders.map(folder => (
              <div key={folder.name} style={{ padding: '12px 14px', borderRadius: 16, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{folder.name}</div>
                <div style={{ marginTop: 4, fontSize: 11, color: 'var(--text-muted)' }}>{folder.count} active conversations</div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <Eyebrow>Threads</Eyebrow>
          <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
            {threads.map(item => (
              <button key={item.name} onClick={() => setThread(item.name)} style={{ textAlign: 'left', padding: '12px 14px', borderRadius: 16, border: thread === item.name ? '1px solid rgba(0,230,168,0.3)' : '1px solid rgba(255,255,255,0.08)', background: thread === item.name ? 'rgba(0,230,168,0.11)' : 'rgba(255,255,255,0.04)', cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: thread === item.name ? 'var(--accent-dark)' : 'var(--text-primary)' }}>{item.name}</span>
                  {!!item.unread && <span className="tag tag-accent">{item.unread}</span>}
                </div>
                <div style={{ marginTop: 5, fontSize: 11, color: 'var(--text-muted)' }}>{item.type}</div>
              </button>
            ))}
          </div>
        </GlassCard>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <div className="glass" style={{ margin: 18, borderRadius: 24, padding: 16, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--text-primary)' }}>{thread}</div>
            <div style={{ marginTop: 4, fontSize: 12, color: 'var(--text-muted)' }}>Polished conversation surface with agents, model routing, uploads, and voice context</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {chips.map(chip => <span key={chip.label} className={`tag ${chip.tone}`}>{chip.label}</span>)}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 12px', display: 'grid', gap: 16 }}>
          {visibleMessages.map(message => (
            <div key={message.id} style={{ display: 'flex', justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{ width: 'min(760px, 92%)', display: 'grid', gridTemplateColumns: message.role === 'user' ? '1fr' : '44px 1fr', gap: 12 }}>
                {message.role === 'assistant' && (
                  <div style={{ width: 44, height: 44, borderRadius: 16, background: 'linear-gradient(135deg, rgba(0,230,168,0.18), rgba(96,165,250,0.18))', border: '1px solid rgba(255,255,255,0.12)', display: 'grid', placeItems: 'center', color: 'var(--accent-dark)', fontWeight: 800 }}>AI</div>
                )}
                <div style={{ justifySelf: message.role === 'user' ? 'end' : 'stretch' }}>
                  <div style={{ marginBottom: 6, display: 'flex', gap: 8, justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start', fontSize: 11, color: 'var(--text-muted)' }}>
                    <span>{message.author}</span>
                    <span>{message.time}</span>
                  </div>
                  <div className={message.role === 'assistant' ? 'glass-card' : ''} style={{
                    padding: '16px 18px',
                    borderRadius: 22,
                    background: message.role === 'assistant' ? undefined : 'linear-gradient(135deg, rgba(0,230,168,0.94), rgba(0,196,148,0.88))',
                    color: message.role === 'assistant' ? 'var(--text-primary)' : '#03281d',
                    boxShadow: message.role === 'assistant' ? undefined : '0 12px 28px rgba(0,230,168,0.22)',
                    fontSize: 14,
                    lineHeight: 1.75,
                  }}>
                    {message.text}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {sending && <LoadingSpinner label="Agent is working…" />}
          <ErrorMessage error={error} />
          <div ref={bottomRef} />
        </div>

        <div style={{ padding: '0 24px 24px' }}>
          <GlassCard strong style={{ padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
              <Segmented options={['Chat', 'Voice', 'Files']} value={composerMode} onChange={setComposerMode} />
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Select label="Agent" value={agent} options={agents} onChange={setAgent} />
                <Select label="Model" value={model} options={models} onChange={setModel} />
                <Select label="Memory" value={memoryScope} options={memoryScopes} onChange={setMemoryScope} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', gap: 10, alignItems: 'end' }}>
              <SecondaryButton style={{ height: 46 }}>＋ Files</SecondaryButton>
              <textarea value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }} placeholder="Message your workspace. Ask for summaries, create tasks, spin up projects, or route work to agents..." rows={3} style={{ width: '100%', minHeight: 46, borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.045)', color: 'var(--text-primary)', padding: '12px 14px', resize: 'none', lineHeight: 1.6 }} />
              <SecondaryButton style={{ height: 46 }}>🎙 Voice</SecondaryButton>
              <PrimaryButton style={{ height: 46 }} onClick={send}>{sending ? 'Sending…' : 'Send'}</PrimaryButton>
            </div>
          </GlassCard>
        </div>
      </div>

      <div style={{ padding: 18, borderLeft: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.28)', display: 'grid', gap: 16, overflowY: 'auto' }}>
        <GlassCard>
          <SectionHeader title="Context controls" subtitle="Agent + memory orchestration" />
          <div style={{ display: 'grid', gap: 12 }}>
            <ContextRow label="Selected agent" value={agent} />
            <ContextRow label="Model route" value={model} />
            <ContextRow label="Memory scope" value={memoryScope} />
            <ContextRow label="Voice status" value="Ready" tone="var(--status-green)" />
          </div>
        </GlassCard>

        <GlassCard>
          <Eyebrow>Suggested tools</Eyebrow>
          <div style={{ marginTop: 12, display: 'grid', gap: 10 }}>
            {['Search docs', 'Create task', 'Start meeting mode', 'Summarize thread'].map(tool => (
              <button key={tool} style={{ textAlign: 'left', padding: '12px 14px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600 }}>{tool}</button>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <label style={{ display: 'grid', gap: 4 }}>
      <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)} style={{ minWidth: 140, height: 40, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.045)', color: 'var(--text-primary)', padding: '0 12px' }}>
        {options.map(option => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function ContextRow({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 700, color: tone || 'var(--text-primary)' }}>{value}</span>
    </div>
  );
}

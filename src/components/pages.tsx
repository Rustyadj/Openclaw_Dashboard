import React, { useMemo, useState } from 'react';
import { documentsApi, terminalApi } from '../lib/api';
import { useCommandStore } from '../stores/useCommandStore';
import { ErrorMessage, LoadingSpinner } from './ui/AsyncState';
import { Eyebrow, GlassCard, PageShell, PrimaryButton, SectionHeader, Segmented } from './ui/premium';

export function Documents() {
  const [view, setView] = useState('Library');
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const documents = useCommandStore(state => state.documents);
  const upsertDocument = useCommandStore(state => state.upsertDocument);
  const filtered = useMemo(() => documents.filter(doc => `${doc.name} ${doc.kind} ${doc.summary || ''}`.toLowerCase().includes(query.toLowerCase())), [documents, query]);

  const upload = async () => {
    const name = prompt('Document name');
    if (!name) return;
    const doc = { id: crypto.randomUUID(), name, kind: name.split('.').pop()?.toUpperCase() || 'File', updated: 'Just now', size: 'Pending', summary: 'Uploaded from Command Center.' };
    try { upsertDocument(await documentsApi.upload(doc)); } catch (err) { setError(err instanceof Error ? err : new Error(String(err))); }
  };

  const search = async () => {
    setSearching(true);
    setError(null);
    try {
      const results = await documentsApi.search(query, filtered);
      results.forEach(upsertDocument);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setSearching(false);
    }
  };

  return (
    <PageShell>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <SectionHeader title="Documents + knowledge" subtitle="AI-searchable docs, files, wiki pages, and premium knowledge surfaces" />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Segmented options={['Library', 'Wiki', 'Files']} value={view} onChange={setView} />
          <PrimaryButton onClick={upload}>+ Upload</PrimaryButton>
        </div>
      </div>
      <GlassCard>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, marginBottom: 14 }}>
          <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && search()} placeholder="AI search documents…" style={{ height: 42, borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', padding: '0 14px' }} />
          <PrimaryButton onClick={search}>{searching ? 'Searching…' : 'AI Search'}</PrimaryButton>
        </div>
        {searching && <LoadingSpinner label="Searching knowledge base…" />}
        <ErrorMessage error={error} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
          {filtered.map(doc => (
            <div key={doc.id} style={{ padding: 16, borderRadius: 18, background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Eyebrow>{doc.kind} · {doc.size || 'Indexed'}</Eyebrow>
              <div style={{ marginTop: 10, fontSize: 14, fontWeight: 800 }}>{doc.name}</div>
              <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.7 }}>{doc.summary || 'Indexed for AI search, board packets, and project memory.'}</div>
              <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-muted)' }}>{doc.updated}</div>
            </div>
          ))}
        </div>
      </GlassCard>
    </PageShell>
  );
}

export function Terminal() {
  const [lines, setLines] = useState<string[]>([
    'openclaw status --all',
    '✓ Command Center terminal ready',
    'Tip: supported gateway commands include status --all and agents list',
  ]);
  const [cmd, setCmd] = useState('');
  const [running, setRunning] = useState(false);
  const run = async () => {
    const command = cmd.trim();
    if (!command || running) return;
    setRunning(true);
    setLines(prev => [...prev, `$ ${command}`]);
    setCmd('');
    try {
      const response = await terminalApi.run(command);
      setLines(prev => [...prev, response.output]);
    } catch (error) {
      setLines(prev => [...prev, `✗ ${error instanceof Error ? error.message : String(error)}`]);
    } finally {
      setRunning(false);
    }
  };

  return (
    <PageShell>
      <SectionHeader title="Terminal" subtitle="Clean ops surface for gateway and workflow diagnostics" />
      <div style={{ flex: 1, minHeight: 520, borderRadius: 24, background: '#071018', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 28px 70px rgba(2,8,23,0.24)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: 7, alignItems: 'center' }}>
          {['#ff5f57', '#ffbd2e', '#28c840'].map(color => <div key={color} style={{ width: 11, height: 11, borderRadius: 999, background: color }} />)}
          <span style={{ marginLeft: 8, fontFamily: 'DM Mono, monospace', fontSize: 12, color: 'rgba(255,255,255,0.38)' }}>openclaw / gateway-terminal</span>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 18, display: 'grid', gap: 6 }}>
          {lines.map((line, index) => <div key={index} style={{ whiteSpace: 'pre-wrap', fontFamily: 'DM Mono, monospace', color: line.startsWith('✓') ? '#34d399' : line.startsWith('⚠') || line.startsWith('✗') ? '#fbbf24' : 'rgba(255,255,255,0.82)', fontSize: 13 }}>{line}</div>)}
          {running && <LoadingSpinner label="Running command…" />}
        </div>
        <div style={{ padding: 16, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 10, alignItems: 'center' }}>
          <span style={{ fontFamily: 'DM Mono, monospace', color: '#00E6A8', fontSize: 13 }}>$</span>
          <input value={cmd} onChange={e => setCmd(e.target.value)} onKeyDown={e => e.key === 'Enter' && run()} placeholder="status --all" style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.88)', fontFamily: 'DM Mono, monospace', fontSize: 13 }} />
          <PrimaryButton style={{ padding: '8px 12px', height: 38 }} onClick={run}>{running ? 'Running…' : 'Run'}</PrimaryButton>
        </div>
      </div>
    </PageShell>
  );
}

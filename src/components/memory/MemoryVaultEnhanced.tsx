import React, { useMemo, useState } from 'react';
import { memoryApi } from '../../lib/api';
import { useCommandStore } from '../../stores/useCommandStore';
import { ErrorMessage } from '../ui/AsyncState';
import { Eyebrow, GlassCard, PageShell, PrimaryButton, SecondaryButton, SectionHeader, Segmented } from '../ui/premium';

export function MemoryVaultEnhanced() {
  const [scope, setScope] = useState('All');
  const [search, setSearch] = useState('');
  const entries = useCommandStore(state => state.memoryStore.entries);
  const updateMemory = useCommandStore(state => state.updateMemory);
  const deleteMemory = useCommandStore(state => state.deleteMemory);
  const upsertMemory = useCommandStore(state => state.upsertMemory);
  const [selectedKey, setSelectedKey] = useState(entries[0]?.key || '');
  const [error, setError] = useState<Error | null>(null);
  const selected = entries.find(entry => entry.key === selectedKey) || entries[0];

  const filtered = useMemo(() => entries.filter(item => (scope === 'All' || item.scope === scope) && `${item.key} ${item.preview}`.toLowerCase().includes(search.toLowerCase())), [entries, scope, search]);

  const addEntry = async () => {
    const entry = { key: `memory.${Date.now()}`, scope: scope === 'All' ? 'Organization' : scope, type: 'Note', updated: 'Just now', preview: 'New memory entry. Edit this summary.' };
    try { upsertMemory(await memoryApi.create(entry)); setSelectedKey(entry.key); } catch (err) { setError(err instanceof Error ? err : new Error(String(err))); }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '320px minmax(0,1fr)', height: '100%', overflow: 'hidden' }}>
      <div style={{ padding: 18, borderRight: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.28)', display: 'grid', gap: 16, overflowY: 'auto' }}>
        <GlassCard>
          <SectionHeader title="Memory vault" subtitle="Searchable memory database" action={<PrimaryButton style={{ padding: '8px 12px' }} onClick={addEntry}>+ Entry</PrimaryButton>} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search keys, previews, scopes..." style={{ marginTop: 12, width: '100%', height: 42, borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', padding: '0 14px' }} />
          <div style={{ marginTop: 12 }}><Segmented options={['All', 'Project', 'Organization', 'Chat', 'Global', 'Personal']} value={scope} onChange={setScope} /></div>
        </GlassCard>

        <div style={{ display: 'grid', gap: 8 }}>
          {filtered.map(entry => (
            <button key={entry.key} onClick={() => setSelectedKey(entry.key)} style={{ textAlign: 'left', padding: '14px 16px', borderRadius: 18, border: selected?.key === entry.key ? '1px solid rgba(0,230,168,0.3)' : '1px solid rgba(255,255,255,0.08)', background: selected?.key === entry.key ? 'rgba(0,230,168,0.1)' : 'rgba(11,16,24,0.7)', color: 'var(--text-primary)', cursor: 'pointer' }}>
              <div style={{ fontSize: 12.5, fontWeight: 700 }}>{entry.key}</div>
              <div style={{ marginTop: 6, fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.6 }}>{entry.preview}</div>
              <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <span className={`tag ${entry.scope === 'Organization' ? 'tag-accent' : entry.scope === 'Project' ? 'tag-blue' : entry.scope === 'Chat' ? 'tag-violet' : entry.scope === 'Global' ? 'tag-gray' : 'tag-amber'}`}>{entry.scope}</span>
                <span className="tag tag-gray">{entry.type}</span>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{entry.updated}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <PageShell>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.2fr) 320px', gap: 16, alignItems: 'start' }}>
          <GlassCard strong>
            <ErrorMessage error={error} />
            {selected ? (
              <>
                <SectionHeader title={selected.key} subtitle="Readable memory object view" action={<div style={{ display: 'flex', gap: 8 }}><SecondaryButton onClick={async () => { const preview = prompt('Update memory summary', selected.preview); if (preview) { try { await memoryApi.update(selected.key, { preview }); updateMemory(selected.key, { preview }); } catch (err) { setError(err instanceof Error ? err : new Error(String(err))); } } }}>Edit</SecondaryButton><SecondaryButton onClick={async () => { try { await memoryApi.delete(selected.key); deleteMemory(selected.key); } catch (err) { setError(err instanceof Error ? err : new Error(String(err))); } }}>Delete</SecondaryButton></div>} />
                <div style={{ marginTop: 14, padding: 18, borderRadius: 18, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <pre style={{ margin: 0, fontFamily: 'DM Mono, monospace', fontSize: 12.5, lineHeight: 1.8, whiteSpace: 'pre-wrap', color: 'var(--text-secondary)' }}>{`{
  "scope": "${selected.scope}",
  "type": "${selected.type}",
  "updated": "${selected.updated}",
  "summary": "${selected.preview}"
}`}</pre>
                </div>
              </>
            ) : <div style={{ color: 'var(--text-muted)' }}>No memory entries yet.</div>}
          </GlassCard>

          <GlassCard>
            <SectionHeader title="Filters + intelligence" subtitle="Project / org / chat / global" />
            <div style={{ marginTop: 14, display: 'grid', gap: 12 }}>
              {['Smart search', 'Semantic clustering', 'Retention rules', 'Promotion to shared org memory'].map(item => (
                <div key={item} style={{ padding: '12px 14px', borderRadius: 16, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700 }}>{item}</div>
                  <div style={{ marginTop: 6, fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.6 }}>Production SaaS-ready vault controls for governance and retrieval quality.</div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </PageShell>
    </div>
  );
}

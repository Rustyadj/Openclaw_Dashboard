import React from 'react';
import type { GatewaySummary } from '../../lib/api';

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  dashboard:    { title: 'Dashboard',           subtitle: 'Executive overview, AI summaries, and system posture' },
  chat:         { title: 'Chat',                subtitle: 'Polished multi-agent conversation workspace' },
  personal:     { title: 'Personal Workspace',  subtitle: 'Private workspace, private agents, private memory' },
  org:          { title: 'Organization Workspace', subtitle: 'Shared humans + AI org operating system' },
  agents:       { title: 'Agents',              subtitle: 'AI workforce roster, tooling, and task ownership' },
  workflows:    { title: 'Workflows',           subtitle: 'Visual automation builder and workflow deployment' },
  capabilities: { title: 'Capabilities',        subtitle: 'Skills, plugins, and extension surfaces' },
  memory:       { title: 'Memory Vault',        subtitle: 'Searchable persistent intelligence' },
  documents:    { title: 'Documents',           subtitle: 'Searchable docs, wiki, files, and AI summaries' },
  metrics:      { title: 'Metrics / Reports',   subtitle: 'Department performance and AI analytics' },
  terminal:     { title: 'Terminal',            subtitle: 'Operational diagnostics and gateway control' },
  settings:     { title: 'Settings',            subtitle: 'Environment controls, auth, and preferences' },
};

interface HeaderProps {
  active: string;
  onNewAgent: () => void;
  onSearchOpen: () => void;
  onNotifsToggle: () => void;
  onMenuToggle: () => void;
  onSidebarToggle: () => void;
  onNav: (id: string) => void;
  notifsOpen: boolean;
  unreadCount: number;
  mobile: boolean;
  summary: GatewaySummary;
  userLabel: string;
  sidebarCollapsed: boolean;
}

export default function Header({ active, onNewAgent, onSearchOpen, onNotifsToggle, onMenuToggle, onSidebarToggle, onNav, notifsOpen, unreadCount, mobile, summary, userLabel, sidebarCollapsed }: HeaderProps) {
  const info = PAGE_TITLES[active] ?? { title: active, subtitle: '' };

  return (
    <header style={{
      height: 74,
      margin: '18px 18px 0',
      borderRadius: 24,
      background: 'linear-gradient(180deg, rgba(11,16,24,0.82) 0%, rgba(8,12,19,0.78) 100%)',
      backdropFilter: 'blur(28px) saturate(180%)',
      WebkitBackdropFilter: 'blur(28px) saturate(180%)',
      border: '1px solid rgba(255,255,255,0.12)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 18px',
      gap: 14,
      position: 'sticky',
      top: 0,
      zIndex: 9,
      boxShadow: '0 22px 42px rgba(14,18,28,0.12)',
    }}>
      {mobile && (
        <button onClick={onMenuToggle} aria-label="Open navigation" style={{ width: 40, height: 40, borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.06)', color: 'var(--text-primary)', cursor: 'pointer', flexShrink: 0 }}>☰</button>
      )}

      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.04em' }}>{info.title}</div>
        <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 3 }}>{info.subtitle}</div>
      </div>

      {!mobile && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginLeft: 10, marginRight: 'auto', flexWrap: 'wrap' }}>
          <button onClick={() => onNav('chat')} style={{ border: '1px solid rgba(255,255,255,0.1)', background: active === 'chat' ? 'linear-gradient(135deg, rgba(0,230,168,0.18), rgba(255,255,255,0.08))' : 'rgba(255,255,255,0.04)', color: active === 'chat' ? 'var(--accent-dark)' : 'var(--text-secondary)', borderRadius: 999, padding: '9px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>✦ Chat</button>
          <button onClick={onSidebarToggle} style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)', borderRadius: 999, padding: '9px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{sidebarCollapsed ? 'Show left bar' : 'Hide left bar'}</button>
        </div>
      )}

      {!mobile && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {[
            { label: 'Latency', val: summary.latencyMs != null ? `${summary.latencyMs}ms` : '—', color: summary.ok ? 'var(--status-green)' : 'var(--status-amber)' },
            { label: 'Threads', val: summary.activeThreads != null ? `${summary.activeThreads}` : '—', color: 'var(--text-secondary)' },
            { label: 'Agents', val: summary.activeAgents != null ? `${summary.activeAgents}` : '—', color: 'var(--accent-dark)' },
          ].map(metric => (
            <div key={metric.label} style={{ minWidth: 72, padding: '8px 10px', borderRadius: 16, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{metric.label}</div>
              <div style={{ marginTop: 4, fontSize: 12, fontWeight: 800, color: metric.color }}>{metric.val}</div>
            </div>
          ))}
        </div>
      )}

      <button onClick={onSearchOpen} style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: mobile ? 120 : 190, padding: '10px 14px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)', cursor: 'pointer' }}>
        <span>⌕</span><span style={{ flex: 1, textAlign: 'left' }}>Search...</span><kbd style={{ fontSize: 10, background: 'rgba(255,255,255,0.08)', borderRadius: 6, padding: '2px 6px', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)' }}>⌘K</kbd>
      </button>

      {!mobile && <button onClick={onNewAgent} style={{ background: 'linear-gradient(135deg, var(--accent), #00c494)', border: 'none', borderRadius: 16, padding: '10px 16px', color: '#03281d', fontWeight: 800, cursor: 'pointer', boxShadow: '0 10px 24px rgba(57,255,182,0.22)' }}>+ New Agent</button>}

      <div style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis' }}>{userLabel}</div>

      <button onClick={onNotifsToggle} style={{ width: 40, height: 40, borderRadius: 14, background: notifsOpen ? 'rgba(0,230,168,0.12)' : 'rgba(255,255,255,0.04)', border: `1px solid ${notifsOpen ? 'rgba(0,230,168,0.28)' : 'rgba(255,255,255,0.1)'}`, cursor: 'pointer', fontSize: 16, display: 'grid', placeItems: 'center', position: 'relative', color: 'var(--text-primary)' }}>
        🔔
        {unreadCount > 0 && <span style={{ position: 'absolute', top: 7, right: 8, width: 8, height: 8, borderRadius: '50%', background: 'var(--status-amber)', border: '1.5px solid rgba(8,12,19,0.9)' }} />}
      </button>
    </header>
  );
}

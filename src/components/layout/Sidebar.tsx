import React from 'react';
import type { GatewaySummary } from '../../lib/api';

interface SidebarProps {
  active: string;
  onNav: (id: string) => void;
  summary: GatewaySummary;
  currentUserName: string;
  mobile?: boolean;
  mobileOpen?: boolean;
  desktopCollapsed?: boolean;
}

const NAV = [
  { section: 'Main', items: [
    { id: 'chat',       label: 'Chat',                icon: '✦' },
    { id: 'dashboard',  label: 'Dashboard',           icon: '◔' },
    { id: 'personal',   label: 'Personal Workspace',  icon: '◫' },
  ]},
  { section: 'Workspaces', items: [
    { id: 'org',       label: 'Organization', icon: '⬡' },
    { id: 'agents',    label: 'Agents',       icon: '◎' },
    { id: 'workflows', label: 'Workflows',    icon: '⟐' },
    { id: 'capabilities', label: 'Capabilities', icon: '⚡' },
  ]},
  { section: 'Knowledge', items: [
    { id: 'memory',    label: 'Memory Vault', icon: '◌' },
    { id: 'documents', label: 'Documents',    icon: '❏' },
    { id: 'metrics',   label: 'Metrics',      icon: '◳' },
  ]},
  { section: 'System', items: [
    { id: 'terminal',  label: 'Terminal', icon: '›_' },
    { id: 'settings',  label: 'Settings', icon: '⚙' },
  ]},
];

export default function Sidebar({ active, onNav, summary, currentUserName, mobile = false, mobileOpen = false, desktopCollapsed = false }: SidebarProps) {
  return (
    <aside style={{
      width: mobile ? 'var(--sidebar-w)' : (desktopCollapsed ? 0 : 'var(--sidebar-w)'),
      minWidth: mobile ? 'var(--sidebar-w)' : (desktopCollapsed ? 0 : 'var(--sidebar-w)'),
      margin: mobile ? 0 : 18,
      marginRight: mobile ? 0 : 0,
      borderRadius: mobile ? 0 : 28,
      background: 'linear-gradient(180deg, rgba(12,17,25,0.78), rgba(8,12,19,0.72))',
      backdropFilter: 'blur(30px) saturate(180%)',
      WebkitBackdropFilter: 'blur(30px) saturate(180%)',
      border: '1px solid rgba(255,255,255,0.12)',
      display: 'flex',
      flexDirection: 'column',
      height: mobile ? '100vh' : 'calc(100vh - 36px)',
      position: mobile ? 'fixed' : 'relative',
      left: mobile ? 0 : 'auto',
      top: mobile ? 0 : 'auto',
      zIndex: 20,
      boxShadow: '0 28px 58px rgba(14,18,28,0.14)',
      transform: mobile ? `translateX(${mobileOpen ? '0' : '-110%'})` : `translateX(${desktopCollapsed ? '-110%' : '0'})`,
      transition: 'transform .24s ease, width .24s ease, min-width .24s ease, opacity .24s ease',
      opacity: mobile ? 1 : (desktopCollapsed ? 0 : 1),
      overflow: 'hidden',
    }} aria-hidden={mobile && !mobileOpen}>
      <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 16, background: 'linear-gradient(135deg, var(--accent), #00c494)', boxShadow: '0 12px 26px rgba(57,255,182,0.22)', display: 'grid', placeItems: 'center', color: '#03281d', fontWeight: 900 }}>C</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.04em' }}>OpenClaw</div>
            <div style={{ marginTop: 3, fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Premium Control</div>
          </div>
        </div>
        <div style={{ marginTop: 16, padding: '10px 12px', borderRadius: 18, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: 12, fontWeight: 700 }}>{currentUserName}&apos;s Workspace</div>
          <div style={{ marginTop: 4, fontSize: 11, color: 'var(--text-muted)' }}>Personal + shared organization surfaces</div>
        </div>
      </div>

      <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 12px 16px' }}>
        {NAV.map(group => (
          <div key={group.section} style={{ marginBottom: 10 }}>
            <div style={{ padding: '8px 10px', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{group.section}</div>
            {group.items.map(item => {
              const isActive = active === item.id;
              return (
                <button key={item.id} onClick={() => onNav(item.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 12px', borderRadius: 18, border: 'none', cursor: 'pointer', marginBottom: 4, textAlign: 'left', background: isActive ? 'linear-gradient(135deg, rgba(0,230,168,0.18), rgba(255,255,255,0.08))' : 'transparent', color: isActive ? 'var(--accent-dark)' : 'var(--text-secondary)', boxShadow: isActive ? 'inset 0 0 0 1px rgba(0,230,168,0.24)' : 'none' }}>
                  <span style={{ width: 18, textAlign: 'center', opacity: isActive ? 1 : 0.76 }}>{item.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 600 }}>{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div style={{ padding: 14, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ padding: 14, borderRadius: 18, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span className="status-dot online" />
            <span style={{ fontSize: 12, fontWeight: 700 }}>{summary.environment}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}><span>Latency</span><span style={{ color: summary.ok ? 'var(--accent-dark)' : 'var(--status-amber)' }}>{summary.latencyMs != null ? `${summary.latencyMs}ms` : '—'}</span></div>
          <div style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}><span>Daily spend</span><span>{summary.dailyCostUsd != null ? `$${summary.dailyCostUsd.toFixed(2)}` : '—'}</span></div>
        </div>
      </div>
    </aside>
  );
}

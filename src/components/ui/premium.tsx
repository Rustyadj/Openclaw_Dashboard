import React from 'react';

export function PageShell({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18, minHeight: '100%', overflowY: 'auto', ...style }}>
      {children}
    </div>
  );
}

export function GlassCard({ children, style, strong = false }: { children: React.ReactNode; style?: React.CSSProperties; strong?: boolean }) {
  return (
    <div className={strong ? 'glass-strong' : 'glass-card'} style={{ padding: 18, ...style }}>
      {children}
    </div>
  );
}

export function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
      <div>
        <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--text-primary)' }}>{title}</div>
        {subtitle && <div style={{ marginTop: 4, fontSize: 12, color: 'var(--text-muted)' }}>{subtitle}</div>}
      </div>
      {action}
    </div>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{children}</div>;
}

export function PrimaryButton({ children, style, onClick }: { children: React.ReactNode; style?: React.CSSProperties; onClick?: () => void }) {
  return (
    <button onClick={onClick} style={{
      border: 'none',
      borderRadius: 12,
      padding: '10px 16px',
      background: 'linear-gradient(135deg, var(--accent), #00c494)',
      color: '#03281d',
      fontWeight: 800,
      fontSize: 12,
      cursor: 'pointer',
      boxShadow: '0 8px 24px rgba(57,255,182,0.22)',
      ...style,
    }}>{children}</button>
  );
}

export function SecondaryButton({ children, style, onClick }: { children: React.ReactNode; style?: React.CSSProperties; onClick?: () => void }) {
  return (
    <button onClick={onClick} style={{
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 12,
      padding: '10px 14px',
      background: 'rgba(255,255,255,0.05)',
      color: 'var(--text-secondary)',
      fontWeight: 700,
      fontSize: 12,
      cursor: 'pointer',
      ...style,
    }}>{children}</button>
  );
}

export function MetricCard({ label, value, delta, icon, tone = 'var(--accent)' }: { label: string; value: string; delta?: string; icon?: string; tone?: string }) {
  return (
    <GlassCard style={{ position: 'relative', overflow: 'hidden', minHeight: 126 }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at top right, ${tone}22, transparent 40%)`, pointerEvents: 'none' }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <Eyebrow>{label}</Eyebrow>
          <div style={{ marginTop: 10, fontSize: 28, fontWeight: 800, letterSpacing: '-0.06em', color: 'var(--text-primary)' }}>{value}</div>
          {delta && <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-secondary)' }}>{delta}</div>}
        </div>
        {icon && <div style={{ width: 44, height: 44, borderRadius: 14, background: `${tone}18`, border: `1px solid ${tone}40`, color: tone, display: 'grid', placeItems: 'center', fontSize: 18 }}>{icon}</div>}
      </div>
    </GlassCard>
  );
}

export function Segmented({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: 'inline-flex', gap: 4, padding: 4, borderRadius: 14, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', flexWrap: 'wrap' }}>
      {options.map(option => (
        <button key={option} onClick={() => onChange(option)} style={{
          border: 'none',
          borderRadius: 10,
          padding: '8px 12px',
          background: value === option ? 'rgba(255,255,255,0.11)' : 'transparent',
          color: value === option ? 'var(--text-primary)' : 'var(--text-muted)',
          fontWeight: value === option ? 700 : 600,
          fontSize: 12,
          cursor: 'pointer',
        }}>{option}</button>
      ))}
    </div>
  );
}

export function InfoRow({ label, value, valueColor }: { label: string; value: React.ReactNode; valueColor?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 700, color: valueColor || 'var(--text-primary)' }}>{value}</span>
    </div>
  );
}

export function ProgressBar({ value, tone = 'var(--accent)' }: { value: number; tone?: string }) {
  return (
    <div style={{ height: 7, borderRadius: 999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${Math.max(0, Math.min(100, value))}%`, borderRadius: 999, background: `linear-gradient(90deg, ${tone}, rgba(255,255,255,0.85))` }} />
    </div>
  );
}

export function AvatarBadge({ label, color, sublabel }: { label: string; color: string; sublabel?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 38, height: 38, borderRadius: 12, background: `${color}22`, border: `1px solid ${color}44`, display: 'grid', placeItems: 'center', color, fontWeight: 800 }}>{label.slice(0, 2)}</div>
      {sublabel && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{sublabel}</div>}
    </div>
  );
}

export function SparkBars({ values, color = 'var(--accent)' }: { values: number[]; color?: string }) {
  const max = Math.max(...values, 1);
  return (
    <div style={{ display: 'flex', alignItems: 'end', gap: 6, height: 88 }}>
      {values.map((v, i) => (
        <div key={i} style={{ flex: 1, height: `${(v / max) * 100}%`, borderRadius: '10px 10px 4px 4px', background: i === values.length - 1 ? color : `${color}88`, boxShadow: i === values.length - 1 ? `0 8px 20px ${color}30` : 'none' }} />
      ))}
    </div>
  );
}

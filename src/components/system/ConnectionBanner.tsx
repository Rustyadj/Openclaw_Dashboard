import React from 'react';
import type { GatewaySummary } from '../../lib/api';

export function ConnectionBanner({ summary }: { summary: GatewaySummary }) {
  return (
    <div
      style={{
        margin: '12px 24px 0',
        borderRadius: 14,
        padding: '10px 14px',
        border: `1px solid ${summary.ok ? 'rgba(52,211,153,0.24)' : 'rgba(251,191,36,0.24)'}`,
        background: summary.ok ? 'rgba(52,211,153,0.08)' : 'rgba(251,191,36,0.12)',
        color: summary.ok ? '#8ff0c3' : '#ffd978',
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <strong>{summary.ok ? 'Gateway connected' : 'Gateway not wired yet'}</strong>
      <span style={{ color: 'inherit', opacity: 0.88 }}>{summary.message}</span>
    </div>
  );
}

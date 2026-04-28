import React from 'react';

export function LoadingSpinner({ label = 'Loading…' }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)', fontSize: 13 }}>
      <span style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(0,230,168,0.25)', borderTopColor: 'var(--accent)', animation: 'spin 0.8s linear infinite' }} />
      <span>{label}</span>
    </div>
  );
}

export function ErrorMessage({ error, onRetry }: { error: Error | string | null | undefined; onRetry?: () => void }) {
  if (!error) return null;
  const message = typeof error === 'string' ? error : error.message;
  return (
    <div role="alert" style={{ border: '1px solid rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.08)', color: 'var(--status-red)', borderRadius: 14, padding: '12px 14px', fontSize: 13, display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
      <span>{message}</span>
      {onRetry && <button onClick={onRetry} style={{ border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(255,255,255,0.5)', borderRadius: 10, padding: '6px 10px', color: 'var(--status-red)', cursor: 'pointer', fontWeight: 700 }}>Retry</button>}
    </div>
  );
}

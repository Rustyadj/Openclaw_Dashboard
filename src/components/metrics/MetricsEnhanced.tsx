import React, { useState } from 'react';
import { GlassCard, MetricCard, PageShell, SectionHeader, Segmented, SparkBars } from '../ui/premium';

const metricSets = {
  '7D': {
    cards: [
      { label: 'Revenue influenced', value: '$84.2k', delta: '+18.2%', icon: '◔', tone: 'var(--accent)' },
      { label: 'AI task completion', value: '92%', delta: '+5.1%', icon: '◎', tone: '#60a5fa' },
      { label: 'Department efficiency', value: '2.6x', delta: 'Ops strongest', icon: '◌', tone: '#a78bfa' },
      { label: 'Org engagement', value: '88%', delta: 'Healthy', icon: '✦', tone: '#34d399' },
    ],
    bars: [48, 52, 60, 58, 69, 74, 81],
  },
  '30D': {
    cards: [
      { label: 'Revenue influenced', value: '$312k', delta: '+24%', icon: '◔', tone: 'var(--accent)' },
      { label: 'AI task completion', value: '89%', delta: '+9%', icon: '◎', tone: '#60a5fa' },
      { label: 'Department efficiency', value: '2.1x', delta: 'Stable', icon: '◌', tone: '#a78bfa' },
      { label: 'Org engagement', value: '83%', delta: '+4%', icon: '✦', tone: '#34d399' },
    ],
    bars: [34, 40, 46, 50, 58, 62, 65, 72],
  },
};

const departments = [
  ['Executive', '94%', 'Fastest decision cycles', 'tag-accent'],
  ['Operations', '91%', 'Highest automation leverage', 'tag-blue'],
  ['Growth', '84%', 'Needs tighter task conversion', 'tag-violet'],
  ['Board', '88%', 'Healthy meeting cadence', 'tag-amber'],
];

export function MetricsEnhanced() {
  const [range, setRange] = useState<'7D' | '30D'>('7D');
  const current = metricSets[range];

  return (
    <PageShell>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <SectionHeader title="Metrics + reports" subtitle="Advanced charts, department performance, and AI analytics" />
        <Segmented options={['7D', '30D']} value={range} onChange={v => setRange(v as '7D' | '30D')} />
      </div>

      <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {current.cards.map(card => <MetricCard key={card.label} {...card} />)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.2fr) minmax(320px,1fr)', gap: 16 }}>
        <GlassCard>
          <SectionHeader title="Department performance" subtitle="High-level executive chart" />
          <div style={{ marginTop: 18 }}><SparkBars values={current.bars} /></div>
          <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: 11, color: 'var(--text-muted)' }}>
            {range === '7D' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => <span key={day}>{day}</span>) : ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'].map(week => <span key={week}>{week}</span>)}
          </div>
        </GlassCard>

        <GlassCard>
          <SectionHeader title="AI analytics" subtitle="Cross-functional operating signal" />
          <div style={{ display: 'grid', gap: 12 }}>
            {departments.map(([name, score, note, tag]) => (
              <div key={name} style={{ padding: '14px 16px', borderRadius: 18, background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{name}</div>
                  <span className={`tag ${tag}`}>{score}</span>
                </div>
                <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.6 }}>{note}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </PageShell>
  );
}

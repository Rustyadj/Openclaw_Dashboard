import React, { useMemo } from 'react';
import { useCommandStore } from '../../stores/useCommandStore';
import { Eyebrow, GlassCard, MetricCard, PageShell, PrimaryButton, SecondaryButton, SectionHeader, ProgressBar, SparkBars } from '../ui/premium';

const actions = [
  { title: 'Start board meeting', desc: 'Launch vote mode with AI recommendations' },
  { title: 'Create project space', desc: 'Spin up kanban, docs, chat, and memory in one shot' },
  { title: 'Deploy agent team', desc: 'Provision legal, ops, and research agents together' },
];

const statusRows = [
  ['Inference routing', 'Healthy', 'var(--status-green)'],
  ['Memory indexing', 'Rebalancing', 'var(--status-amber)'],
  ['Slack / Telegram bridges', 'Connected', 'var(--status-green)'],
  ['Billing guardrails', 'Within target', 'var(--accent-dark)'],
];

const aiBriefs = [
  { title: 'Executive summary', text: 'Your org is shipping faster because intake, project setup, and follow-up are now mostly autonomous. Biggest upside is still in turning discussions into tasks automatically.' },
  { title: 'Risk watch', text: 'One team is overloading a single research agent. Split workload between synthesis and retrieval so decisions don’t bottleneck.' },
];

export default function Dashboard({ onNav }: { onNav: (id: string) => void }) {
  const agents = useCommandStore(state => state.agentsStore.agents);
  const workflows = useCommandStore(state => state.workflowStore.workflows);
  const memory = useCommandStore(state => state.memoryStore.entries);
  const tasks = useCommandStore(state => state.orgStore.tasks);
  const activityFeed = useCommandStore(state => state.activityFeed);
  const KPIS = useMemo(() => [
    { label: 'Active agents', value: String(agents.filter(agent => agent.status !== 'Disabled').length), delta: `${agents.reduce((sum, agent) => sum + agent.tasks, 0)} assigned tasks`, icon: '◎', tone: 'var(--accent)' },
    { label: 'Token / cost guardrail', value: '$0.00', delta: 'Wire live gateway usage when API is configured', icon: '◔', tone: '#60a5fa' },
    { label: 'Workflow automation', value: `${workflows.length}`, delta: `${workflows.filter(flow => flow.deployedAt).length} deployed`, icon: '⟐', tone: '#a78bfa' },
    { label: 'Open org tasks', value: String(tasks.filter(task => task.status !== 'Done').length), delta: `${memory.length} memory objects linked`, icon: '◌', tone: '#34d399' },
  ], [agents, workflows, tasks, memory]);
  const feed = activityFeed.length ? activityFeed.map((text, idx) => [text, idx === 0 ? 'Just now' : 'Recent', idx === 0 ? 'Board' : idx === 1 ? 'Workflow' : 'Summary']) : [['No live activity yet', 'Now', 'Summary']];
  return (
    <PageShell>
      <GlassCard strong style={{ padding: 24, overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at top right, rgba(0,230,168,0.14), transparent 28%)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 18, alignItems: 'flex-start', flexWrap: 'wrap', position: 'relative' }}>
          <div style={{ maxWidth: 760 }}>
            <Eyebrow>Executive workspace</Eyebrow>
            <div style={{ marginTop: 10, fontSize: 34, lineHeight: 1.04, letterSpacing: '-0.07em', fontWeight: 800, color: 'var(--text-primary)' }}>
              Premium command center for your humans, agents, projects, and decisions.
            </div>
            <div style={{ marginTop: 12, fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)', maxWidth: 680 }}>
              A polished SaaS control plane with live AI summaries, org-wide collaboration, modular dashboards, and beautiful glass surfaces that still read clean under pressure.
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <PrimaryButton>Launch briefing</PrimaryButton>
            <SecondaryButton style={{ background: 'rgba(255,255,255,0.08)' }} onClick={() => onNav('org')}>Open org workspace</SecondaryButton>
          </div>
        </div>
      </GlassCard>

      <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {KPIS.map(kpi => <MetricCard key={kpi.label} {...kpi} />)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(320px, 1fr)', gap: 16, alignItems: 'start' }}>
        <div style={{ display: 'grid', gap: 16 }}>
          <GlassCard>
            <SectionHeader title="AI operating brief" subtitle="High-level summaries that feel executive, not noisy" action={<SecondaryButton onClick={() => onNav('chat')}>Ask follow-up</SecondaryButton>} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
              {aiBriefs.map(brief => (
                <div key={brief.title} className="surface-light" style={{ padding: 16 }}>
                  <Eyebrow>{brief.title}</Eyebrow>
                  <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.7, color: 'var(--text-secondary)' }}>{brief.text}</div>
                </div>
              ))}
            </div>
          </GlassCard>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)', gap: 16 }}>
            <GlassCard>
              <SectionHeader title="Quick actions" subtitle="Fast paths into the work that matters" />
              <div style={{ display: 'grid', gap: 12 }}>
                {actions.map(action => (
                  <button key={action.title} style={{ textAlign: 'left', padding: 16, borderRadius: 18, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', cursor: 'pointer' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{action.title}</div>
                    <div style={{ marginTop: 6, fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>{action.desc}</div>
                  </button>
                ))}
              </div>
            </GlassCard>

            <GlassCard>
              <SectionHeader title="Automation trend" subtitle="Last 7 operating cycles" />
              <SparkBars values={[48, 56, 62, 58, 68, 74, 82]} />
              <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: 11, color: 'var(--text-muted)' }}>
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Today</span>
              </div>
            </GlassCard>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 16 }}>
          <GlassCard>
            <SectionHeader title="Activity feed" subtitle="Cross-org updates" />
            <div style={{ display: 'grid', gap: 14 }}>
              {feed.map(([text, time, tag], idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 12, alignItems: 'start' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 14, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', display: 'grid', placeItems: 'center' }}>{idx === 0 ? '✦' : idx === 1 ? '⟐' : idx === 2 ? '◫' : '◎'}</div>
                  <div>
                    <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.55 }}>{text}</div>
                    <div style={{ marginTop: 6, display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{time}</span>
                      <span className={`tag ${tag === 'Workflow' ? 'tag-blue' : tag === 'Memory' ? 'tag-violet' : tag === 'Summary' ? 'tag-gray' : 'tag-accent'}`}>{tag}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <SectionHeader title="System status" subtitle="Readable, not noisy" />
            <div style={{ display: 'grid', gap: 6 }}>
              {statusRows.map(([label, value, color]) => (
                <div key={label} style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 7 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color }}>{value}</span>
                  </div>
                  <ProgressBar value={label === 'Memory indexing' ? 62 : 92} tone={String(color)} />
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </PageShell>
  );
}

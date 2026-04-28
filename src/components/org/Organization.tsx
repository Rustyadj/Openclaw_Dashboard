import React, { useMemo, useState } from 'react';
import { orgApi } from '../../lib/api';
import { useCommandStore, type OrgTask } from '../../stores/useCommandStore';
import { Eyebrow, GlassCard, MetricCard, PageShell, PrimaryButton, SecondaryButton, SectionHeader, Segmented, ProgressBar } from '../ui/premium';

type Tab = 'Overview' | 'Org Chart' | 'Projects' | 'Discussions' | 'Tasks' | 'Documents' | 'Meetings' | 'Activity Feed' | 'Settings';

const tabs: Tab[] = ['Overview', 'Org Chart', 'Projects', 'Discussions', 'Tasks', 'Documents', 'Meetings', 'Activity Feed', 'Settings'];

const members = [
  { name: 'Rusty', role: 'Founder', team: 'Executive', color: '#00E6A8', agent: 'Strategy Lead' },
  { name: 'Sarah Kent', role: 'Operations Lead', team: 'Ops', color: '#60a5fa', agent: 'Ops Analyst' },
  { name: 'Marcus Trent', role: 'Growth', team: 'Growth', color: '#a78bfa', agent: 'Research Agent' },
  { name: 'Patricia Cruz', role: 'Board Advisor', team: 'Board', color: '#fbbf24', agent: 'Board Counsel' },
];

const orgMetrics = [
  { label: 'Shared workspaces', value: '07', delta: '3 private, 4 shared', icon: '◫', tone: 'var(--accent)' },
  { label: 'Projects in flight', value: '19', delta: '8 AI-assisted', icon: '◳', tone: '#60a5fa' },
  { label: 'Decision velocity', value: '2.4x', delta: 'Faster than last quarter', icon: '◌', tone: '#a78bfa' },
  { label: 'Board confidence', value: '94%', delta: 'Voting engine aligned', icon: '✦', tone: '#34d399' },
];

const projects = [
  { name: 'OpenClaw Mobile Strategy', owner: 'Rusty + Strategy Lead', view: 'Timeline', status: 'In progress' },
  { name: 'Legal Intake Automation', owner: 'Sarah + Ops Analyst', view: 'Kanban', status: 'Needs review' },
  { name: 'Pricing Council', owner: 'Board-only room', view: 'Calendar', status: 'Scheduled' },
  { name: 'Growth Experiments', owner: 'Marcus + Research Agent', view: 'List', status: 'Active' },
];

const tasks = [
  { title: 'Turn discussion decisions into task templates', assignee: 'Strategy Lead', dependency: 'Board motion #12', status: 'Running' },
  { title: 'Create board-only meeting pack', assignee: 'Board Counsel', dependency: 'Pricing summary', status: 'Queued' },
  { title: 'Sync shared org memory to project rooms', assignee: 'Ops Analyst', dependency: 'Vault index refresh', status: 'Ready' },
];

const channels = [
  { name: '# executive', type: 'Board-only', unread: 0 },
  { name: '# product-strategy', type: 'Shared', unread: 6 },
  { name: '# ai-only-ops', type: 'AI-only', unread: 2 },
  { name: '@ sarah', type: 'DM', unread: 1 },
];

const docs = [
  'Board packet · Q2 growth motions',
  'Shared org charter · humans + AI agents',
  'Legal intake operating system',
  'Decision memo templates',
];

const activity = [
  ['Board Meeting Mode assembled voting context for pricing', '8 min ago'],
  ['Growth workspace created 4 task automations from Slack discussion', '26 min ago'],
  ['Org Chart update: Research Agent moved under Growth pod', '58 min ago'],
  ['Shared memory synced into Executive and Product workspaces', '2 hrs ago'],
];

export default function Organization() {
  const [tab, setTab] = useState<Tab>('Overview');
  const [projectView, setProjectView] = useState('Kanban');
  const [meetingMode, setMeetingMode] = useState('Board Meeting Mode');
  const [room, setRoom] = useState('# product-strategy');

  const content = useMemo(() => {
    switch (tab) {
      case 'Overview': return <OverviewTab />;
      case 'Org Chart': return <OrgChartTab />;
      case 'Projects': return <ProjectsTab view={projectView} setView={setProjectView} />;
      case 'Discussions': return <DiscussionsTab room={room} setRoom={setRoom} />;
      case 'Tasks': return <TasksTab />;
      case 'Documents': return <DocumentsTab />;
      case 'Meetings': return <MeetingsTab mode={meetingMode} setMode={setMeetingMode} />;
      case 'Activity Feed': return <ActivityTab />;
      case 'Settings': return <SettingsTab />;
      default: return null;
    }
  }, [tab, projectView, room, meetingMode]);

  return (
    <PageShell>
      <GlassCard strong style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 18, flexWrap: 'wrap', alignItems: 'start' }}>
          <div>
            <Eyebrow>Organization workspace</Eyebrow>
            <div style={{ marginTop: 10, fontSize: 30, fontWeight: 800, letterSpacing: '-0.06em' }}>Shared human + AI operating system</div>
            <div style={{ marginTop: 10, fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)', maxWidth: 760 }}>
              Every member gets a private workspace and can selectively bring agents into the shared organization. Projects, discussions, tasks, memory, documents, and board decisions stay coordinated inside one premium control plane.
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <PrimaryButton>Invite member</PrimaryButton>
            <SecondaryButton>Launch AI voting</SecondaryButton>
          </div>
        </div>
      </GlassCard>

      <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {orgMetrics.map(metric => <MetricCard key={metric.label} {...metric} />)}
      </div>

      <Segmented options={tabs} value={tab} onChange={v => setTab(v as Tab)} />
      {content}
    </PageShell>
  );
}

function OverviewTab() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.45fr) minmax(320px,1fr)', gap: 16 }}>
      <div style={{ display: 'grid', gap: 16 }}>
        <GlassCard>
          <SectionHeader title="Member + agent workspace map" subtitle="Personal workspaces feeding one shared org" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            {members.map(member => (
              <div key={member.name} style={{ padding: 16, borderRadius: 18, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 14, background: `${member.color}20`, border: `1px solid ${member.color}44`, display: 'grid', placeItems: 'center', color: member.color, fontWeight: 800 }}>{member.name.split(' ').map(s => s[0]).join('').slice(0,2)}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{member.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{member.role} · {member.team}</div>
                  </div>
                </div>
                <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-secondary)' }}>Private workspace + shared org contribution lane</div>
                <div style={{ marginTop: 10 }}><span className="tag tag-accent">◎ {member.agent}</span></div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <SectionHeader title="Shared org projects" subtitle="Kanban, list, calendar, and timeline views" />
          <div style={{ display: 'grid', gap: 10 }}>
            {projects.map(project => (
              <div key={project.name} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto auto', gap: 10, alignItems: 'center', padding: '14px 16px', borderRadius: 18, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{project.name}</div>
                  <div style={{ marginTop: 4, fontSize: 11, color: 'var(--text-muted)' }}>{project.owner}</div>
                </div>
                <span className="tag tag-blue">{project.view}</span>
                <span className={`tag ${project.status === 'Needs review' ? 'tag-amber' : project.status === 'Scheduled' ? 'tag-violet' : 'tag-green'}`}>{project.status}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div style={{ display: 'grid', gap: 16 }}>
        <GlassCard>
          <SectionHeader title="Decision engine" subtitle="Board + AI consensus" />
          <div style={{ padding: 16, borderRadius: 18, background: 'linear-gradient(135deg, rgba(0,230,168,0.12), rgba(96,165,250,0.08))', border: '1px solid rgba(0,230,168,0.18)' }}>
            <div style={{ fontSize: 14, fontWeight: 800 }}>Board Meeting Mode</div>
            <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7 }}>AI assembles motions, surfaces tradeoffs, and lets human board members vote with context already distilled.</div>
            <div style={{ marginTop: 12, display: 'grid', gap: 10 }}>
              <VoteRow label="Increase growth budget" yes={78} />
              <VoteRow label="Add second legal ops agent" yes={88} />
              <VoteRow label="Hold pricing until next cycle" yes={34} />
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <SectionHeader title="Latest activity" subtitle="What changed across the org" />
          <div style={{ display: 'grid', gap: 12 }}>
            {activity.map(([text, time]) => (
              <div key={text} style={{ paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: 12.5, color: 'var(--text-primary)', lineHeight: 1.6 }}>{text}</div>
                <div style={{ marginTop: 6, fontSize: 11, color: 'var(--text-muted)' }}>{time}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function OrgChartTab() {
  return (
    <GlassCard>
      <SectionHeader title="Interactive org chart builder" subtitle="Humans + AI agents with expandable teams and profile side panels" action={<div style={{ display: 'flex', gap: 8 }}><SecondaryButton>Expand all</SecondaryButton><PrimaryButton>+ Add node</PrimaryButton></div>} />
      <div style={{ marginTop: 18, display: 'grid', placeItems: 'center', minHeight: 540, background: 'rgba(255,255,255,0.03)', borderRadius: 22, border: '1px dashed rgba(255,255,255,0.14)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div style={{ position: 'relative', display: 'grid', gap: 42, justifyItems: 'center' }}>
          <NodeCard title="Rusty" subtitle="Founder · Executive" accent="#00E6A8" meta="Strategy Lead + Board Counsel" root />
          <div style={{ width: 2, height: 28, background: 'rgba(255,255,255,0.16)' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(180px, 1fr))', gap: 28 }}>
            <NodeCard title="Operations Pod" subtitle="Sarah Kent" accent="#60a5fa" meta="Ops Analyst + Legal Ops" />
            <NodeCard title="Growth Pod" subtitle="Marcus Trent" accent="#a78bfa" meta="Research Agent + Campaign AI" />
            <NodeCard title="Board Cell" subtitle="Patricia Cruz" accent="#fbbf24" meta="Board-only room + voting AI" />
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

function ProjectsTab({ view, setView }: { view: string; setView: (v: string) => void }) {
  return (
    <GlassCard>
      <SectionHeader title="Projects workspace" subtitle="Kanban / list / calendar / timeline" action={<PrimaryButton>+ New project</PrimaryButton>} />
      <div style={{ marginTop: 12, marginBottom: 18 }}><Segmented options={['Kanban', 'List', 'Calendar', 'Timeline']} value={view} onChange={setView} /></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(220px,1fr))', gap: 14 }}>
        {['Backlog', 'In Progress', 'Review', 'Done'].map(col => (
          <div key={col} className="surface-light" style={{ padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#1f2937' }}>{col}</div>
              <span className="tag tag-gray">{projects.filter(p => (col === 'Done' ? false : col === 'Review' ? p.status === 'Needs review' : col === 'In Progress' ? p.status === 'In progress' : col === 'Backlog' ? p.status === 'Scheduled' || p.status === 'Active' : false)).length}</span>
            </div>
            <div style={{ display: 'grid', gap: 10 }}>
              {projects.map(project => (
                <div key={project.name + col} style={{ padding: 12, borderRadius: 16, background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(15,23,35,0.08)' }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: '#111827' }}>{project.name}</div>
                  <div style={{ marginTop: 6, fontSize: 11, color: '#6b7280' }}>{project.owner}</div>
                  <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <span className="tag tag-blue">{project.view}</span>
                    <span className="tag tag-accent">AI assisted</span>
                  </div>
                </div>
              )).slice(0,1)}
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

function DiscussionsTab({ room, setRoom }: { room: string; setRoom: (v: string) => void }) {
  const discussions = useCommandStore(state => state.orgStore.discussions);
  const addDiscussionReply = useCommandStore(state => state.addDiscussionReply);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [reply, setReply] = useState('');
  const submitReply = async (discussionId: string) => {
    if (!reply.trim()) return;
    await orgApi.reply(discussionId, reply);
    addDiscussionReply(discussionId, { id: crypto.randomUUID(), author: 'Rusty', text: reply.trim(), createdAt: 'Just now' });
    setReply('');
    setReplyingTo(null);
  };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px minmax(0,1fr)', gap: 16 }}>
      <GlassCard>
        <SectionHeader title="Channels" subtitle="Slack / Discord style collaboration" />
        <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
          {channels.map(channel => (
            <button key={channel.name} onClick={() => setRoom(channel.name)} style={{ textAlign: 'left', padding: '12px 14px', borderRadius: 16, border: room === channel.name ? '1px solid rgba(0,230,168,0.3)' : '1px solid rgba(255,255,255,0.08)', background: room === channel.name ? 'rgba(0,230,168,0.11)' : 'rgba(255,255,255,0.04)', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: room === channel.name ? 'var(--accent-dark)' : 'var(--text-primary)' }}>{channel.name}</span>
                {channel.unread > 0 && <span className="tag tag-accent">{channel.unread}</span>}
              </div>
              <div style={{ marginTop: 5, fontSize: 11, color: 'var(--text-muted)' }}>{channel.type}</div>
            </button>
          ))}
        </div>
      </GlassCard>
      <GlassCard>
        <SectionHeader title={room} subtitle="Humans, agents, and board-only rooms in one collaboration surface" action={<PrimaryButton>+ New room</PrimaryButton>} />
        <div style={{ marginTop: 14, display: 'grid', gap: 14 }}>
          {discussions.map(item => (
            <div key={item.id} style={{ padding: '14px 16px', borderRadius: 18, background: item.author === 'Rusty' ? 'linear-gradient(135deg, rgba(0,230,168,0.14), rgba(0,196,148,0.12))' : 'rgba(255,255,255,0.045)', border: '1px solid rgba(255,255,255,0.09)', fontSize: 13, lineHeight: 1.7, color: 'var(--text-primary)' }}>
              <strong>{item.author}:</strong> {item.text}
              <div style={{ marginTop: 8 }}><button onClick={() => setReplyingTo(replyingTo === item.id ? null : item.id)} style={{ border: 'none', background: 'transparent', color: 'var(--accent-dark)', cursor: 'pointer', fontWeight: 700 }}>Reply</button></div>
              {item.replies.map(child => <div key={child.id} style={{ marginTop: 8, marginLeft: 16, padding: '10px 12px', borderRadius: 14, background: 'rgba(255,255,255,0.08)' }}><strong>{child.author}:</strong> {child.text}</div>)}
              {replyingTo === item.id && <div style={{ marginTop: 10, display: 'flex', gap: 8 }}><input value={reply} onChange={e => setReply(e.target.value)} placeholder="Write threaded reply…" style={{ flex: 1, height: 38, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.06)', color: 'var(--text-primary)', padding: '0 12px' }} /><PrimaryButton onClick={() => submitReply(item.id)}>Send</PrimaryButton></div>}
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

function TasksTab() {
  const orgTasks = useCommandStore(state => state.orgStore.tasks);
  const moveOrgTask = useCommandStore(state => state.moveOrgTask);
  const statuses: OrgTask['status'][] = ['Backlog', 'In Progress', 'Review', 'Done'];
  const move = async (taskId: string, status: OrgTask['status']) => { await orgApi.moveTask(taskId, status); moveOrgTask(taskId, status); };
  return (
    <GlassCard>
      <SectionHeader title="Task orchestration" subtitle="Drag tasks between columns; changes persist to org state" action={<PrimaryButton>+ New task</PrimaryButton>} />
      <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(4, minmax(180px,1fr))', gap: 12 }}>
        {statuses.map(status => (
          <div key={status} onDragOver={event => event.preventDefault()} onDrop={event => move(event.dataTransfer.getData('task/id'), status)} style={{ minHeight: 260, padding: 12, borderRadius: 18, background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ marginBottom: 10, fontSize: 12, fontWeight: 800 }}>{status}</div>
            <div style={{ display: 'grid', gap: 10 }}>
              {orgTasks.filter(task => task.status === status).map(task => (
                <div key={task.id} draggable onDragStart={event => event.dataTransfer.setData('task/id', task.id)} style={{ padding: '14px 16px', borderRadius: 18, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)', cursor: 'grab' }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700 }}>{task.title}</div>
                  <div style={{ marginTop: 6, fontSize: 11, color: 'var(--text-muted)' }}>{task.owner || 'Unassigned'} · {task.priority || 'Normal'}</div>
                  <div style={{ marginTop: 10 }}><ProgressBar value={status === 'Done' ? 100 : status === 'Review' ? 78 : status === 'In Progress' ? 52 : 18} /></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

function DocumentsTab() {
  return (
    <GlassCard>
      <SectionHeader title="Shared documents + AI knowledge" subtitle="Wiki, files, summaries, and searchable operating knowledge" action={<PrimaryButton>Upload</PrimaryButton>} />
      <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
        {docs.map(doc => (
          <div key={doc} style={{ padding: 16, borderRadius: 18, background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{doc}</div>
            <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-muted)' }}>Indexed for AI search, board packets, and project memory.</div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

function MeetingsTab({ mode, setMode }: { mode: string; setMode: (v: string) => void }) {
  const castMeetingVote = useCommandStore(state => state.castMeetingVote);
  const vote = async (motionId: string, choice: 'yes' | 'no' | 'abstain') => { await orgApi.castVote(mode, motionId, choice); castMeetingVote({ meetingId: mode, motionId, choice, user: 'Rusty' }); };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.2fr) 360px', gap: 16 }}>
      <GlassCard>
        <SectionHeader title="Meetings + AI voting engine" subtitle="Premium board mode with structured motions" />
        <div style={{ marginTop: 12 }}><Segmented options={['Board Meeting Mode', 'Leadership Sync', 'Project Review']} value={mode} onChange={setMode} /></div>
        <div style={{ marginTop: 16, padding: 18, borderRadius: 22, background: 'linear-gradient(135deg, rgba(0,230,168,0.12), rgba(96,165,250,0.08))', border: '1px solid rgba(0,230,168,0.18)' }}>
          <div style={{ fontSize: 16, fontWeight: 800 }}>{mode}</div>
          <div style={{ marginTop: 8, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>AI assembles agendas, summarizes tradeoffs, forecasts likely vote outcomes, and prepares counterarguments before the room opens.</div>
          <div style={{ marginTop: 16, display: 'grid', gap: 10 }}>
            <VoteRow label="Expand org-wide AI workforce" yes={82} onVote={(choice) => vote('expand-ai-workforce', choice)} />
            <VoteRow label="Approve pricing test" yes={74} onVote={(choice) => vote('approve-pricing-test', choice)} />
            <VoteRow label="Pause onboarding until legal flow is fixed" yes={41} onVote={(choice) => vote('pause-onboarding', choice)} />
          </div>
        </div>
      </GlassCard>
      <GlassCard>
        <SectionHeader title="Live controls" subtitle="Meeting prep" />
        <div style={{ display: 'grid', gap: 10 }}>
          {['Generate agenda', 'Assemble board packet', 'Run pre-vote simulation', 'Open live voting'].map(item => (
            <button key={item} style={{ textAlign: 'left', padding: '12px 14px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600 }}>{item}</button>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

function ActivityTab() {
  return (
    <GlassCard>
      <SectionHeader title="Org activity feed" subtitle="Cross-tab operational pulse" />
      <div style={{ marginTop: 14, display: 'grid', gap: 12 }}>
        {activity.map(([text, time], i) => (
          <div key={text} style={{ display: 'grid', gridTemplateColumns: '42px 1fr', gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 16, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'grid', placeItems: 'center' }}>{i % 2 === 0 ? '◌' : '✦'}</div>
            <div style={{ paddingTop: 4 }}>
              <div style={{ fontSize: 13, lineHeight: 1.6 }}>{text}</div>
              <div style={{ marginTop: 6, fontSize: 11, color: 'var(--text-muted)' }}>{time}</div>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

function SettingsTab() {
  return (
    <GlassCard>
      <SectionHeader title="Organization settings" subtitle="Control collaboration boundaries and AI participation" />
      <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
        {[
          ['Private workspaces', 'Allow members to keep personal AI teams and private memory while joining the shared org.'],
          ['Shared org memory', 'Decide what gets promoted from private workspaces into shared context.'],
          ['AI room policy', 'Control AI-only rooms, board-only rooms, and which agents may enter each.'],
          ['Voting thresholds', 'Set quorum, weighted votes, and when AI recommendations are visible.'],
        ].map(([title, text]) => (
          <div key={title} style={{ padding: 16, borderRadius: 18, background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{title}</div>
            <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.7 }}>{text}</div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

function NodeCard({ title, subtitle, accent, meta, root = false }: { title: string; subtitle: string; accent: string; meta: string; root?: boolean }) {
  return (
    <div style={{ minWidth: 220, padding: root ? '18px 20px' : '16px 18px', borderRadius: 22, background: root ? `${accent}16` : 'rgba(255,255,255,0.06)', border: `1px solid ${root ? `${accent}44` : 'rgba(255,255,255,0.1)'}`, boxShadow: root ? `0 18px 40px ${accent}18` : 'none' }}>
      <div style={{ fontSize: 14, fontWeight: 800 }}>{title}</div>
      <div style={{ marginTop: 4, fontSize: 11, color: 'var(--text-muted)' }}>{subtitle}</div>
      <div style={{ marginTop: 10 }}><span className="tag tag-accent">◎ {meta}</span></div>
    </div>
  );
}

function VoteRow({ label, yes, onVote }: { label: string; yes: number; onVote?: (choice: 'yes' | 'no' | 'abstain') => void }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 7 }}>
        <span style={{ fontSize: 12, color: 'var(--text-primary)' }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-dark)' }}>{yes}% yes</span>
      </div>
      <ProgressBar value={yes} />
      {onVote && <div style={{ marginTop: 8, display: 'flex', gap: 6 }}><SecondaryButton onClick={() => onVote('yes')}>Yes</SecondaryButton><SecondaryButton onClick={() => onVote('no')}>No</SecondaryButton><SecondaryButton onClick={() => onVote('abstain')}>Abstain</SecondaryButton></div>}
    </div>
  );
}

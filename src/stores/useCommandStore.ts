import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AgentStatus = 'Active' | 'Busy' | 'Reviewing' | 'Disabled';
export type AgentRecord = {
  id: string;
  name: string;
  type?: 'Sub-Agent' | 'Agent' | 'Agent Team';
  model: string;
  status: AgentStatus;
  color: string;
  tasks: number;
  tools: number;
  memory: number;
  workflows: number;
  summary: string;
  logs?: string[];
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  author: string;
  text: string;
  time: string;
  threadId?: string;
  agent?: string;
  model?: string;
  memoryScope?: string;
};

export type WorkflowNode = { id: string; title: string; type: string; x: number; y: number; color: string; icon: string; detail: string };
export type WorkflowDefinition = { id: string; name: string; nodes: WorkflowNode[]; deployedAt?: string; updatedAt?: string };
export type MemoryEntry = { key: string; scope: string; type: string; updated: string; preview: string; content?: string };
export type DocumentRecord = { id: string; name: string; kind: string; updated: string; size?: string; summary?: string };
export type OrgTask = { id: string; title: string; status: 'Backlog' | 'In Progress' | 'Review' | 'Done'; owner?: string; priority?: string };
export type DiscussionReply = { id: string; author: string; text: string; createdAt: string };
export type Discussion = { id: string; author: string; text: string; createdAt: string; replies: DiscussionReply[] };
export type MeetingVote = { meetingId: string; motionId: string; choice: 'yes' | 'no' | 'abstain'; user: string };

export type SettingsState = {
  general: { displayName: string; email: string; timezone: string; gatewayUrl: string; cluster: string; tokenAuth: string };
  models: { primary: string; fallback: string; reasoning: string; budget: string; dailyBudget: string; monthlyBudget: string; apiKeys: Record<string, string> };
  channels: Record<string, { connected: boolean; route: string }>;
  notifications: Record<string, boolean>;
  appearance: { theme: string; accentColor: string; fontSize: string; sidebarCollapsed: boolean };
  billing: { plan: string; costAlerts: boolean };
  security: { commandApprovalGate: boolean; twoFactor: boolean; auditLogging: boolean };
};

type CommandStore = {
  agentsStore: { agents: AgentRecord[]; selectedAgentId: string | null };
  workflowStore: { workflows: WorkflowDefinition[]; activeWorkflowId: string };
  memoryStore: { entries: MemoryEntry[] };
  orgStore: { tasks: OrgTask[]; discussions: Discussion[]; votes: MeetingVote[] };
  settingsStore: SettingsState;
  documents: DocumentRecord[];
  chat: { messages: ChatMessage[] };
  activityFeed: string[];

  addAgent: (agent: AgentRecord) => void;
  updateAgent: (id: string, patch: Partial<AgentRecord>) => void;
  cloneAgent: (id: string) => void;
  disableAgent: (id: string) => void;
  selectAgent: (id: string) => void;

  addChatMessage: (message: ChatMessage) => void;
  updateChatMessage: (id: string, patch: Partial<ChatMessage>) => void;

  upsertMemory: (entry: MemoryEntry) => void;
  updateMemory: (key: string, patch: Partial<MemoryEntry>) => void;
  deleteMemory: (key: string) => void;

  updateWorkflowNodes: (workflowId: string, nodes: WorkflowNode[]) => void;
  markWorkflowDeployed: (workflowId: string) => void;

  moveOrgTask: (taskId: string, status: OrgTask['status']) => void;
  addDiscussionReply: (discussionId: string, reply: DiscussionReply) => void;
  castMeetingVote: (vote: MeetingVote) => void;

  saveSettings: (tab: keyof SettingsState, value: SettingsState[keyof SettingsState]) => void;
  upsertDocument: (doc: DocumentRecord) => void;
  logActivity: (text: string) => void;
};

const nowLabel = () => 'Just now';

const initialAgents: AgentRecord[] = [
  { id: '1', name: 'Strategy Lead', model: 'Claude Sonnet 4.6', status: 'Active', color: '#00E6A8', tasks: 14, tools: 8, memory: 82, workflows: 5, summary: 'Exec planning, board summaries, and delegation orchestration.', logs: ['Booted strategy lane', 'Generated board brief'] },
  { id: '2', name: 'Legal Ops', model: 'Gemini 2.5 Pro', status: 'Active', color: '#60a5fa', tasks: 11, tools: 6, memory: 64, workflows: 4, summary: 'Legal intake, document review, contract summaries, and follow-up.', logs: ['Reviewed 4 intake packets'] },
  { id: '3', name: 'Research Agent', model: 'DeepSeek V3.2', status: 'Busy', color: '#a78bfa', tasks: 19, tools: 5, memory: 74, workflows: 7, summary: 'Market research, synthesis, competitor analysis, and supporting briefs.', logs: ['Running competitor scan'] },
  { id: '4', name: 'Board Counsel', model: 'ChatGPT 5.4', status: 'Reviewing', color: '#fbbf24', tasks: 5, tools: 4, memory: 58, workflows: 2, summary: 'Board memos, voting packages, meeting prep, and decision framing.', logs: ['Reviewing pricing motion'] },
];

const initialWorkflow: WorkflowDefinition = {
  id: 'board-motion-flow',
  name: 'Board Motion Flow',
  nodes: [
    { id: 'agenda', title: 'Board agenda request', type: 'Trigger', x: 80, y: 80, color: '#00E6A8', icon: '⚡', detail: 'New request / schedule' },
    { id: 'strategy', title: 'Strategy Lead', type: 'Agent', x: 330, y: 80, color: '#60a5fa', icon: '◎', detail: 'Summarize proposals' },
    { id: 'memory', title: 'Memory vault sync', type: 'Storage', x: 600, y: 80, color: '#94a3b8', icon: '◫', detail: 'Load org context' },
    { id: 'vote', title: 'Voting simulation', type: 'Skill', x: 330, y: 250, color: '#a78bfa', icon: '✦', detail: 'Forecast likely outcomes' },
    { id: 'publish', title: 'Board-only room', type: 'Action', x: 600, y: 250, color: '#fb7185', icon: '↗', detail: 'Publish final packet' },
  ],
};

const initialMemory: MemoryEntry[] = [
  { key: 'org.executive.strategy', scope: 'Organization', type: 'Summary', updated: '11 min ago', preview: 'Operating thesis for board motions, pricing, and AI workforce structure.' },
  { key: 'project.legal-intake.followups', scope: 'Project', type: 'Structured', updated: '37 min ago', preview: 'Client follow-up state, priorities, and deadline-sensitive commitments.' },
  { key: 'workspace.rusty.personal-ops', scope: 'Personal', type: 'Private', updated: '1 hr ago', preview: 'Private workspace memory for personal workflows, preferences, and private AI staff.' },
];

const initialSettings: SettingsState = {
  general: { displayName: 'Rusty', email: 'rusty@example.com', timezone: 'America/Chicago', gatewayUrl: 'http://127.0.0.1:18789', cluster: 'VPS Root', tokenAuth: '' },
  models: { primary: 'openai-codex/gpt-5.5', fallback: 'claude-sonnet-4-6', reasoning: 'claude-opus-4-6', budget: 'openrouter/free', dailyBudget: '5.00', monthlyBudget: '150.00', apiKeys: {} },
  channels: { Telegram: { connected: true, route: 'Orchestrator' }, Discord: { connected: false, route: 'Orchestrator' } },
  notifications: { agentErrors: true, cronFailures: true, highCost: true, newMember: true, agentActivity: false, memoryCompact: false, weeklyReport: true, dailyBrief: true },
  appearance: { theme: 'light-glass', accentColor: '#00E6A8', fontSize: 'medium', sidebarCollapsed: false },
  billing: { plan: 'Pro', costAlerts: true },
  security: { commandApprovalGate: true, twoFactor: false, auditLogging: true },
};

export const useCommandStore = create<CommandStore>()(persist((set, get) => ({
  agentsStore: { agents: initialAgents, selectedAgentId: initialAgents[0].id },
  workflowStore: { workflows: [initialWorkflow], activeWorkflowId: initialWorkflow.id },
  memoryStore: { entries: initialMemory },
  orgStore: {
    tasks: [
      { id: 't1', title: 'Turn board discussion into accountable tasks', status: 'Backlog', owner: 'Strategy Lead', priority: 'High' },
      { id: 't2', title: 'Review legal intake queue', status: 'In Progress', owner: 'Legal Ops', priority: 'High' },
      { id: 't3', title: 'Publish weekly AI summary', status: 'Review', owner: 'Orchestrator', priority: 'Medium' },
    ],
    discussions: [{ id: 'd1', author: 'Rusty', text: 'Need the command center to feel like a real operating cockpit.', createdAt: 'Today', replies: [] }],
    votes: [],
  },
  settingsStore: initialSettings,
  documents: [
    { id: 'doc1', name: 'Board motion packet.pdf', kind: 'PDF', updated: 'Today', size: '1.2 MB', summary: 'Pricing motion and implementation notes.' },
    { id: 'doc2', name: 'Legal intake SOP.md', kind: 'Markdown', updated: 'Yesterday', size: '28 KB', summary: 'Current routing procedure and escalation map.' },
  ],
  chat: { messages: [
    { id: '1', role: 'assistant', author: 'Orchestrator', time: '9:02 AM', text: 'I pulled together the org-wide picture. Revenue conversations are healthy, but the legal intake queue is starting to stack. I recommend splitting review and follow-up into two separate agent lanes.', threadId: 'Board Strategy' },
    { id: '2', role: 'user', author: 'Rusty', time: '9:03 AM', text: 'Give me the board-level summary and the highest leverage next move.', threadId: 'Board Strategy' },
    { id: '3', role: 'assistant', author: 'Orchestrator', time: '9:03 AM', text: 'Board summary: growth is fine, execution is fine, but your org still treats discussion as work. Highest leverage move is converting discussions into accountable tasks automatically.', threadId: 'Board Strategy' },
  ] },
  activityFeed: ['Command Center store initialized'],

  addAgent: (agent) => set(state => ({ agentsStore: { ...state.agentsStore, agents: [agent, ...state.agentsStore.agents], selectedAgentId: agent.id }, activityFeed: [`Created agent ${agent.name}`, ...state.activityFeed].slice(0, 20) })),
  updateAgent: (id, patch) => set(state => ({ agentsStore: { ...state.agentsStore, agents: state.agentsStore.agents.map(agent => agent.id === id ? { ...agent, ...patch } : agent) } })),
  cloneAgent: (id) => {
    const source = get().agentsStore.agents.find(agent => agent.id === id);
    if (!source) return;
    get().addAgent({ ...source, id: crypto.randomUUID(), name: `${source.name} Clone`, status: 'Active', logs: [`Cloned from ${source.name}`] });
  },
  disableAgent: (id) => get().updateAgent(id, { status: 'Disabled' }),
  selectAgent: (id) => set(state => ({ agentsStore: { ...state.agentsStore, selectedAgentId: id } })),

  addChatMessage: (message) => set(state => ({ chat: { messages: [...state.chat.messages, message] } })),
  updateChatMessage: (id, patch) => set(state => ({ chat: { messages: state.chat.messages.map(message => message.id === id ? { ...message, ...patch } : message) } })),

  upsertMemory: (entry) => set(state => ({ memoryStore: { entries: [entry, ...state.memoryStore.entries.filter(item => item.key !== entry.key)] } })),
  updateMemory: (key, patch) => set(state => ({ memoryStore: { entries: state.memoryStore.entries.map(entry => entry.key === key ? { ...entry, ...patch, updated: nowLabel() } : entry) } })),
  deleteMemory: (key) => set(state => ({ memoryStore: { entries: state.memoryStore.entries.filter(entry => entry.key !== key) } })),

  updateWorkflowNodes: (workflowId, nodes) => set(state => ({ workflowStore: { ...state.workflowStore, workflows: state.workflowStore.workflows.map(flow => flow.id === workflowId ? { ...flow, nodes, updatedAt: new Date().toISOString() } : flow) } })),
  markWorkflowDeployed: (workflowId) => set(state => ({ workflowStore: { ...state.workflowStore, workflows: state.workflowStore.workflows.map(flow => flow.id === workflowId ? { ...flow, deployedAt: new Date().toISOString() } : flow) }, activityFeed: [`Deployed workflow ${workflowId}`, ...state.activityFeed].slice(0, 20) })),

  moveOrgTask: (taskId, status) => set(state => ({ orgStore: { ...state.orgStore, tasks: state.orgStore.tasks.map(task => task.id === taskId ? { ...task, status } : task) } })),
  addDiscussionReply: (discussionId, reply) => set(state => ({ orgStore: { ...state.orgStore, discussions: state.orgStore.discussions.map(discussion => discussion.id === discussionId ? { ...discussion, replies: [...discussion.replies, reply] } : discussion) } })),
  castMeetingVote: (vote) => set(state => ({ orgStore: { ...state.orgStore, votes: [vote, ...state.orgStore.votes.filter(item => !(item.meetingId === vote.meetingId && item.motionId === vote.motionId && item.user === vote.user))] } })),

  saveSettings: (tab, value) => set(state => ({ settingsStore: { ...state.settingsStore, [tab]: value } })),
  upsertDocument: (doc) => set(state => ({ documents: [doc, ...state.documents.filter(item => item.id !== doc.id)] })),
  logActivity: (text) => set(state => ({ activityFeed: [text, ...state.activityFeed].slice(0, 20) })),
}), { name: 'openclaw-command-center-store-v1', version: 1 }));

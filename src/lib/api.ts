import { appConfig, hasApiBaseUrl } from './config';
import type { AgentRecord, ChatMessage, DocumentRecord, MemoryEntry, OrgTask, SettingsState, WorkflowDefinition } from '../stores/useCommandStore';

export type GatewaySummary = {
  ok: boolean;
  source: 'live' | 'demo';
  environment: string;
  latencyMs?: number;
  activeThreads?: number;
  activeAgents?: number;
  dailyCostUsd?: number;
  message?: string;
};

export type ApiErrorPayload = { message?: string; code?: string; details?: unknown };
export class ApiError extends Error {
  status: number;
  payload?: ApiErrorPayload;
  constructor(message: string, status: number, payload?: ApiErrorPayload) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

export type RequestOptions = RequestInit & { token?: string; skipAuth?: boolean };
export type ChatRequest = { threadId: string; message: string; agent: string; model: string; memoryScope: string; history: ChatMessage[] };
export type ChatResponse = { message: ChatMessage; memory?: MemoryEntry[] };

const DEFAULT_SUMMARY: GatewaySummary = {
  ok: false,
  source: 'demo',
  environment: 'Not connected',
  latencyMs: undefined,
  activeThreads: undefined,
  activeAgents: undefined,
  dailyCostUsd: undefined,
  message: 'Set VITE_API_BASE_URL to wire the real gateway API.',
};

const getStoredToken = () => {
  try {
    return localStorage.getItem('openclaw.auth.token') || localStorage.getItem('gatewayToken') || '';
  } catch {
    return '';
  }
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!hasApiBaseUrl) throw new ApiError('API base URL is not configured.', 0);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), appConfig.apiTimeoutMs);
  const token = options.token || (!options.skipAuth ? getStoredToken() : '');

  try {
    const response = await fetch(`${appConfig.apiBaseUrl}${path}`, {
      ...options,
      headers: {
        Accept: 'application/json',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      signal: controller.signal,
    });

    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json') ? await response.json().catch(() => undefined) : await response.text().catch(() => undefined);

    if (!response.ok) {
      const apiPayload = typeof payload === 'object' && payload ? payload as ApiErrorPayload : undefined;
      const message = apiPayload?.message || (typeof payload === 'string' && payload) || `HTTP ${response.status}`;
      throw new ApiError(message, response.status, apiPayload);
    }

    return payload as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof DOMException && error.name === 'AbortError') throw new ApiError('Request timed out.', 408);
    throw error instanceof Error ? error : new Error(String(error));
  } finally {
    clearTimeout(timeout);
  }
}

async function maybeRequest<T>(path: string, fallback: T, options?: RequestOptions): Promise<T> {
  if (!hasApiBaseUrl) return fallback;
  try {
    return await request<T>(path, options);
  } catch (error) {
    console.warn(`[api] ${path} failed`, error);
    return fallback;
  }
}

const jsonBody = (body: unknown) => JSON.stringify(body);

function pickNumber(...values: unknown[]): number | undefined {
  for (const value of values) {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value))) return Number(value);
  }
  return undefined;
}

export async function fetchGatewaySummary(): Promise<GatewaySummary> {
  if (!hasApiBaseUrl) return DEFAULT_SUMMARY;

  const started = performance.now();

  try {
    const [health, status] = await Promise.allSettled([
      request<any>('/health', { skipAuth: true }),
      request<any>('/status'),
    ]);

    const healthData = health.status === 'fulfilled' ? health.value : {};
    const statusData = status.status === 'fulfilled' ? status.value : {};
    const elapsed = Math.round(performance.now() - started);

    return {
      ok: true,
      source: 'live',
      environment:
        statusData.region ||
        statusData.environment ||
        statusData.cluster ||
        healthData.region ||
        'Connected gateway',
      latencyMs: pickNumber(statusData.latencyMs, healthData.latencyMs, elapsed),
      activeThreads: pickNumber(statusData.activeThreads, statusData.threads, statusData.threadCount),
      activeAgents: pickNumber(statusData.activeAgents, statusData.agents, statusData.agentCount),
      dailyCostUsd: pickNumber(statusData.dailyCostUsd, statusData.dailySpend, statusData.costToday),
      message: 'Live data from gateway API.',
    };
  } catch (error) {
    return {
      ...DEFAULT_SUMMARY,
      message: error instanceof Error ? error.message : 'Unable to reach gateway API.',
    };
  }
}

export const agentsApi = {
  list: (fallback: AgentRecord[] = []) => maybeRequest<AgentRecord[]>('/agents', fallback),
  create: (agent: AgentRecord) => maybeRequest<AgentRecord>('/agents', agent, { method: 'POST', body: jsonBody(agent) }),
  update: (id: string, patch: Partial<AgentRecord>) => maybeRequest<AgentRecord>(`/agents/${encodeURIComponent(id)}`, { id, ...patch } as AgentRecord, { method: 'PATCH', body: jsonBody(patch) }),
  clone: (id: string) => maybeRequest<{ ok: boolean }>(`/agents/${encodeURIComponent(id)}/clone`, { ok: false }, { method: 'POST' }),
  disable: (id: string) => maybeRequest<{ ok: boolean }>(`/agents/${encodeURIComponent(id)}/disable`, { ok: false }, { method: 'POST' }),
  logs: (id: string, fallback: string[] = []) => maybeRequest<string[]>(`/agents/${encodeURIComponent(id)}/logs`, fallback),
};

export const workflowsApi = {
  list: (fallback: WorkflowDefinition[] = []) => maybeRequest<WorkflowDefinition[]>('/workflows', fallback),
  save: (workflow: WorkflowDefinition) => maybeRequest<WorkflowDefinition>(`/workflows/${encodeURIComponent(workflow.id)}`, workflow, { method: 'PUT', body: jsonBody(workflow) }),
  deploy: (workflow: WorkflowDefinition) => maybeRequest<{ ok: boolean; runId?: string }>('/workflows/deploy', { ok: false }, { method: 'POST', body: jsonBody(workflow) }),
};

export const memoryApi = {
  list: (fallback: MemoryEntry[] = []) => maybeRequest<MemoryEntry[]>('/memory', fallback),
  create: (entry: MemoryEntry) => maybeRequest<MemoryEntry>('/memory', entry, { method: 'POST', body: jsonBody(entry) }),
  update: (key: string, patch: Partial<MemoryEntry>) => maybeRequest<MemoryEntry>(`/memory/${encodeURIComponent(key)}`, { key, ...patch } as MemoryEntry, { method: 'PATCH', body: jsonBody(patch) }),
  delete: (key: string) => maybeRequest<{ ok: boolean }>(`/memory/${encodeURIComponent(key)}`, { ok: false }, { method: 'DELETE' }),
};

export const documentsApi = {
  list: (fallback: DocumentRecord[] = []) => maybeRequest<DocumentRecord[]>('/documents', fallback),
  upload: (doc: DocumentRecord) => maybeRequest<DocumentRecord>('/documents', doc, { method: 'POST', body: jsonBody(doc) }),
  search: (query: string, fallback: DocumentRecord[] = []) => maybeRequest<DocumentRecord[]>(`/documents/search?q=${encodeURIComponent(query)}`, fallback),
};

export const orgApi = {
  tasks: (fallback: OrgTask[] = []) => maybeRequest<OrgTask[]>('/org/tasks', fallback),
  moveTask: (taskId: string, status: OrgTask['status']) => maybeRequest<{ ok: boolean }>('/org/tasks/move', { ok: false }, { method: 'POST', body: jsonBody({ taskId, status }) }),
  discussions: (fallback: unknown[] = []) => maybeRequest<unknown[]>('/org/discussions', fallback),
  reply: (discussionId: string, text: string) => maybeRequest<{ ok: boolean }>('/org/discussions/reply', { ok: false }, { method: 'POST', body: jsonBody({ discussionId, text }) }),
  castVote: (meetingId: string, motionId: string, choice: string) => maybeRequest<{ ok: boolean }>('/org/meetings/votes', { ok: false }, { method: 'POST', body: jsonBody({ meetingId, motionId, choice }) }),
};

export const settingsApi = {
  load: (fallback: SettingsState) => maybeRequest<SettingsState>('/settings', fallback),
  save: (tab: keyof SettingsState, value: SettingsState[keyof SettingsState]) => maybeRequest<{ ok: boolean }>(`/settings/${String(tab)}`, { ok: false }, { method: 'PUT', body: jsonBody(value) }),
  testConnection: (provider: string, value?: string) => maybeRequest<{ ok: boolean; message: string }>('/settings/test-connection', { ok: Boolean(value), message: value ? 'Looks valid locally. Backend not configured.' : 'Missing credential.' }, { method: 'POST', body: jsonBody({ provider, value }) }),
};

export const chatApi = {
  send: async (input: ChatRequest): Promise<ChatResponse> => {
    if (!hasApiBaseUrl) {
      const time = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
      return {
        message: {
          id: `${Date.now()}-a`,
          role: 'assistant',
          author: input.agent,
          time,
          threadId: input.threadId,
          agent: input.agent,
          model: input.model,
          memoryScope: input.memoryScope,
          text: `Execution route prepared through ${input.agent} on ${input.model}. Gateway API is not configured, so this response is persisted locally until VITE_API_BASE_URL is set.`,
        },
        memory: input.memoryScope !== 'Off' ? [{ key: `chat.${input.threadId}.${Date.now()}`, scope: input.memoryScope, type: 'Transcript', updated: 'Just now', preview: input.message.slice(0, 140), content: input.message }] : [],
      };
    }
    return request<ChatResponse>('/chat/send', { method: 'POST', body: jsonBody(input) });
  },
};

export const terminalApi = {
  run: (command: string) => maybeRequest<{ output: string }>(`/terminal/run`, { output: `Backend command endpoint unavailable. Command queued locally: ${command}` }, { method: 'POST', body: jsonBody({ command }) }),
};

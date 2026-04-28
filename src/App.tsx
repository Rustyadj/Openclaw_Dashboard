import React, { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import './styles/globals.css';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import { LoadingSpinner } from './components/ui/AsyncState';
import { SearchModal, NotificationsPanel } from './components/ui/SearchAndNotifications';
import { fetchGatewaySummary, type GatewaySummary } from './lib/api';
import { ConnectionBanner } from './components/system/ConnectionBanner';
import { useAuth } from './context/AuthContext';
import { appConfig } from './lib/config';

const Dashboard = lazy(() => import('./components/dashboard/Dashboard'));
const Chat = lazy(() => import('./components/chat/Chat'));
const Organization = lazy(() => import('./components/org/Organization'));
const Agents = lazy(() => import('./components/agents/Agents'));
const Capabilities = lazy(() => import('./components/capabilities/Capabilities'));
const WorkflowsEnhanced = lazy(() => import('./components/workflows/WorkflowsEnhanced').then(module => ({ default: module.WorkflowsEnhanced })));
const MemoryVaultEnhanced = lazy(() => import('./components/memory/MemoryVaultEnhanced').then(module => ({ default: module.MemoryVaultEnhanced })));
const Documents = lazy(() => import('./components/pages').then(module => ({ default: module.Documents })));
const Terminal = lazy(() => import('./components/pages').then(module => ({ default: module.Terminal })));
const MetricsEnhanced = lazy(() => import('./components/metrics/MetricsEnhanced').then(module => ({ default: module.MetricsEnhanced })));
const Settings = lazy(() => import('./components/settings/Settings'));
const PersonalWorkspace = lazy(() => import('./components/workspace/PersonalWorkspace'));

const FALLBACK_SUMMARY: GatewaySummary = {
  ok: false,
  source: 'demo',
  environment: 'Not connected',
  message: 'Set VITE_API_BASE_URL to show live gateway data.',
};

export default function App() {
  const auth = useAuth();
  const [active, setActive] = useState('dashboard');
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifsOpen, setNotifsOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1100);
  const [summary, setSummary] = useState<GatewaySummary>(FALLBACK_SUMMARY);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 1100);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const next = await fetchGatewaySummary();
      if (!cancelled) setSummary(next);
    };

    load();
    const interval = window.setInterval(load, 30000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  // Global Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(s => !s);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setNotifsOpen(false);
        setMobileNavOpen(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (!isMobile) setMobileNavOpen(false);
    if (isMobile) setDesktopSidebarCollapsed(false);
  }, [isMobile]);

  const renderPage = () => {
    switch (active) {
      case 'dashboard':    return <Dashboard onNav={setActive} />;
      case 'chat':         return <Chat />;
      case 'personal':     return <PersonalWorkspace />;
      case 'org':          return <Organization />;
      case 'agents':       return <Agents />;
      case 'workflows':    return <WorkflowsEnhanced />;
      case 'capabilities': return <Capabilities />;
      case 'memory':       return <MemoryVaultEnhanced />;
      case 'documents':    return <Documents />;
      case 'metrics':      return <MetricsEnhanced />;
      case 'terminal':     return <Terminal />;
      case 'settings':     return <Settings />;
      default:             return null;
    }
  };

  const fullHeight = ['chat', 'terminal', 'settings', 'workflows', 'memory'].includes(active);
  const unreadCount = 3;
  const page = useMemo(() => renderPage(), [active]);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
      {isMobile && mobileNavOpen && (
        <button
          aria-label="Close navigation"
          onClick={() => setMobileNavOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(15,17,23,0.36)', border: 'none', zIndex: 15 }}
        />
      )}

      {!isMobile && desktopSidebarCollapsed && (
        <button
          onClick={() => setDesktopSidebarCollapsed(false)}
          aria-label="Show left navigation"
          style={{
            position: 'fixed',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 18,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(10,16,27,0.78)',
            color: 'var(--accent-dark)',
            borderRadius: 999,
            padding: '12px 10px',
            cursor: 'pointer',
            boxShadow: '0 12px 30px rgba(0,0,0,0.18)',
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            letterSpacing: '0.08em',
            fontWeight: 700,
            fontSize: 11,
          }}
        >
          ✦ Chat / Show Tabs
        </button>
      )}

      <Sidebar
        active={active}
        onNav={(id) => {
          setActive(id);
          setMobileNavOpen(false);
        }}
        summary={summary}
        currentUserName={auth.user?.displayName || 'Rusty'}
        mobile={isMobile}
        mobileOpen={mobileNavOpen}
        desktopCollapsed={desktopSidebarCollapsed}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <Header
          active={active}
          onNewAgent={() => setActive('agents')}
          onSearchOpen={() => setSearchOpen(true)}
          onNotifsToggle={() => setNotifsOpen(n => !n)}
          onMenuToggle={() => setMobileNavOpen(v => !v)}
          onSidebarToggle={() => setDesktopSidebarCollapsed(v => !v)}
          onNav={(id) => setActive(id)}
          notifsOpen={notifsOpen}
          unreadCount={unreadCount}
          mobile={isMobile}
          summary={summary}
          userLabel={auth.isDemoMode ? 'Demo mode' : (appConfig.authMode === 'openclaw' ? 'OpenClaw mode' : auth.user?.email || 'Authenticated')}
          sidebarCollapsed={desktopSidebarCollapsed}
        />

        {!summary.ok && <ConnectionBanner summary={summary} />}

        <main style={{ flex: 1, overflow: fullHeight ? 'hidden' : 'auto', position: 'relative' }}>
          <div key={active} className="animate-fade-up" style={{ height: '100%' }}>
            <Suspense fallback={<div style={{ padding: 24 }}><LoadingSpinner label="Loading workspace…" /></div>}>
              {page}
            </Suspense>
          </div>
        </main>
      </div>

      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNav={(id) => { setActive(id); setSearchOpen(false); setMobileNavOpen(false); }}
      />
      <NotificationsPanel
        open={notifsOpen}
        onClose={() => setNotifsOpen(false)}
      />
    </div>
  );
}

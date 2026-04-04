// App.tsx — Root component. Full view routing + Dexie DB + auth + command palette.
import { useState, useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import LandingPage      from './components/LandingPage';
import LoginPage        from './components/LoginPage';
import Sidebar          from './components/Sidebar';
import ChatArea         from './components/ChatArea';
import InputBar         from './components/InputBar';
import PdfViewerModal   from './components/PdfViewerModal';
import CommandPalette   from './components/CommandPalette';
import PrivacyPage      from './components/PrivacyPage';
import TermsPage        from './components/TermsPage';

import { API_BASE, API_KEY }                 from './config';
import { generateId, sanitizeInput, buildHistory } from './utils';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { fetchUserSessions, syncUserSession, removeUserSession, checkUserAccess } from './db';
import type { Session, Message, QueryApiResponse } from './types';

// ── Types ─────────────────────────────────────────────────────────────────────

type View = 'landing' | 'login' | 'dashboard' | 'privacy' | 'terms' | 'pending_approval';
type SaveState = 'idle' | 'saving' | 'saved' | 'error';
interface AuthUser { uid: string; name: string; email: string; lastLogin?: string; }

// ── Helpers ───────────────────────────────────────────────────────────────────
function defaultSession(): Session {
  return { id: generateId(), title: 'New Chat', mode: 'qa', messages: [] };
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function App() {
  const [view,       setView]      = useState<View>('landing');
  const [authInit,   setAuthInit]  = useState(false);
  const [authUser,   setAuthUser]  = useState<AuthUser | null>(null);
  const [sessions,   setSessions]  = useState<Session[]>([defaultSession()]);
  const [activeId,   setActiveId]  = useState<string>('');
  const [version,    setVersion]   = useState('');
  const [loading,    setLoading]   = useState(false);
  const [input,      setInput]     = useState('');
  const [modalImg,   setModalImg]  = useState<string | null>(null);
  const [pdfUrl,     setPdfUrl]    = useState<string | null>(null);
  const [pdfPage,    setPdfPage]   = useState(0);
  const [collapsed,  setCollapsed] = useState(false);
  const [paletteOpen,setPalette]   = useState(false);
  const [saveState,  setSaveState] = useState<SaveState>('idle');
  const saveTimer                  = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Active session derived
  const activeSession: Session = sessions.find((s) => s.id === activeId) ?? sessions[0] ?? defaultSession();

  // Ensure activeId is always valid
  useEffect(() => {
    if (sessions.length > 0 && !sessions.find((s) => s.id === activeId)) {
      setActiveId(sessions[0].id);
    }
  }, [sessions, activeId]);

  // Persist sessions to cloud auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const email = user.email || '';
        const name = user.displayName || email.split('@')[0] || 'Engineer';
        setAuthUser({ uid: user.uid, name, email, lastLogin: user.metadata.lastSignInTime });
        
        const accessCheck = await checkUserAccess(user.uid, email);
        if (!accessCheck.approved) {
           setView('pending_approval');
           setAuthInit(true);
           return;
        }

        const cloudSessions = await fetchUserSessions(user.uid);
        if (cloudSessions.length > 0) {
          setSessions(cloudSessions);
          setActiveId(cloudSessions[0].id);
        } else {
          const fresh = { id: generateId(), title: 'New Chat', mode: 'qa' as const, messages: [] };
          setSessions([fresh]);
          setActiveId(fresh.id);
        }
        setView('dashboard');
      } else {
        setAuthUser(null);
        const fresh = { id: generateId(), title: 'New Chat', mode: 'qa' as const, messages: [] };
        setSessions([fresh]);
        setActiveId(fresh.id);
        setView('landing');
      }
      setAuthInit(true);
    });
    return () => unsubscribe();
  }, []);

  // Ctrl+K command palette, Ctrl+N new session
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setPalette(true); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') { e.preventDefault(); handleNewSession('qa'); }
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // ── Save indicator helper ────────────────────────────────────────────────
  function triggerSave(state: SaveState) {
    setSaveState(state);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    if (state === 'saved') {
      saveTimer.current = setTimeout(() => setSaveState('idle'), 3000);
    }
  }

  // ── Update sessions + persist ─────────────────────────────────────────────
  const updateSessions = useCallback((next: Session[]) => {
    setSessions(next);
  }, []);

  // ── Navigation ────────────────────────────────────────────────────────────
  const goToChat = useCallback((mode: 'qa' | 'flowchart' = 'qa') => {
    const existing = sessions.find((s) => s.mode === mode && s.messages.length === 0);
    if (existing) {
      setActiveId(existing.id);
    } else {
      const sess: Session = { id: generateId(), title: 'New Chat', mode, messages: [] };
      const next = [sess, ...sessions];
      updateSessions(next);
      setActiveId(sess.id);
      if (authUser) syncUserSession(authUser.uid, sess);
    }
    setInput('');
    setView('dashboard');
  }, [sessions, updateSessions]);

  // ── Session handlers ──────────────────────────────────────────────────────
  const handleNewSession = useCallback((mode: 'qa' | 'flowchart') => {
    const sess: Session = { id: generateId(), title: 'New Chat', mode, messages: [] };
    setSessions((prev) => {
      const next = [sess, ...prev];
      return next;
    });
    setActiveId(sess.id);
    setInput('');
    if (authUser) syncUserSession(authUser.uid, sess);
  }, [authUser]);

  const handleSwitchSession = useCallback((id: string) => {
    setActiveId(id); setInput('');
  }, []);

  const handleDeleteSession = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSessions((prev) => {
      const next = prev.filter((s) => s.id !== id);
      const result = next.length === 0 ? [{ id: generateId(), title: 'New Chat', mode: 'qa' as const, messages: [] }] : next;
      if (id === activeId) setActiveId(result[0].id);
      return result;
    });
    if (authUser) removeUserSession(authUser.uid, id);
  }, [activeId, authUser]);

  const handlePdfClick = useCallback((url: string, pages: number[]) => {
    setPdfUrl(url);
    setPdfPage(pages?.length > 0 ? Math.max(0, pages[0] - 1) : 0);
  }, []);

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const text = sanitizeInput(input);
    if (!text || loading) return;

    const userMsg: Message = { role: 'user', content: text, timestamp: Date.now() };

    const updatedUserSession = { 
       ...activeSession, 
       messages: [...activeSession.messages, userMsg],
       title: activeSession.messages.length === 0 ? text.slice(0, 50) + (text.length > 50 ? '…' : '') : activeSession.title
    };

    setSessions((prev) => prev.map((s) => s.id === activeId ? updatedUserSession : s));
    if (authUser) syncUserSession(authUser.uid, updatedUserSession);
    setInput('');
    setLoading(true);
    triggerSave('saving');

    try {
      const history = buildHistory(activeSession.messages);
      const hiddenRules = `\n\n%% SYSTEM: Output ONE complete SCL Function Block.\n%% Wrap all code in <SCL_CODE>...</SCL_CODE> tags.\n%% Siemens S7-1200 only. Timer calls: "Timer_DB".TON(IN:=..., PT:=...);`;

      const body = {
        query          : activeSession.mode === 'qa' ? text : 'Generate SCL code for the attached flowchart',
        mode           : activeSession.mode,
        version_filter : version || null,
        mermaid_code   : activeSession.mode === 'flowchart' ? text + hiddenRules : null,
        history,
      };

      const res = await fetch(`${API_BASE}/query`, {
        method : 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': API_KEY
        },
        body   : JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`Server Error ${res.status}`);
      const data: QueryApiResponse = await res.json();

      const assistantMsg: Message = {
        role: 'assistant', content: data.answer,
        sources: data.sources, images: data.images,
        latency: data.latency_ms, timestamp: Date.now(),
      };

      const nextSession = { ...updatedUserSession, messages: [...updatedUserSession.messages, assistantMsg] };
      setSessions((prev) => prev.map((s) => s.id === activeId ? nextSession : s));
      if (authUser) syncUserSession(authUser.uid, nextSession);
      triggerSave('saved');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      const errorMsg: Message = { role: 'assistant', content: `**Error:** ${msg}`, isError: true };
      const errSession = { ...updatedUserSession, messages: [...updatedUserSession.messages, errorMsg] };
      setSessions((prev) => prev.map((s) => s.id === activeId ? errSession : s));
      if (authUser) syncUserSession(authUser.uid, errSession);
      triggerSave('error');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  };

  const isFlowchart = activeSession?.mode === 'flowchart';

  // ── View Routing ──────────────────────────────────────────────────────────

  if (!authInit) return (
     <div className="h-screen w-full bg-[#001540] flex items-center justify-center">
       <span className="text-[#0050C0] font-industrial animate-pulse text-lg tracking-widest uppercase">Initializing Secure Terminal...</span>
     </div>
  );

  if (view === 'pending_approval') {
    return (
      <div className="h-screen w-full bg-[#001540] flex flex-col items-center justify-center p-8 text-center text-white">
        <div className="w-16 h-16 bg-[#003080] rounded-full flex items-center justify-center mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        <h1 className="text-3xl font-industrial uppercase tracking-widest mb-4">Access Request Pending</h1>
        <p className="text-[#999999] max-w-md mb-8">Your Google Account ({authUser?.email}) request to access the ControlsAI Engineer Terminal has been securely received.</p>
        <p className="text-[#C8D8F0] font-mono text-sm bg-white/5 p-4 border border-white/10 mb-8 max-w-md">Please contact the Head Electrical Engineer or Domain Admin to approve your account UID: {authUser?.uid}</p>
        <button onClick={() => { auth.signOut(); setView('landing'); }} className="border border-white/20 px-8 py-3 uppercase text-xs font-bold tracking-widest hover:bg-white/10 transition-colors">Sign Out</button>
      </div>
    );
  }

  if (view === 'landing') {
    return (
      <LandingPage
        user={authUser}
        isLoggedIn={!!authUser}
        onLogout={() => auth.signOut()}
        onStartChat={() => authUser ? setView('dashboard') : setView('login')}
        onStartFlowchart={() => authUser ? setView('dashboard') : setView('login')}
        onLogin={() => setView('login')}
        onPrivacy={() => setView('privacy')}
        onTerms={() => setView('terms')}
      />
    );
  }

  if (view === 'login') {
    return (
      <LoginPage
        onLogin={(user) => { 
          // Firebase onAuthStateChanged handles routing to dashboard
        }}
      />
    );
  }

  if (view === 'privacy') return <PrivacyPage onBack={() => setView('landing')} />;
  if (view === 'terms')   return <TermsPage   onBack={() => setView('landing')} />;

  // ── Dashboard ─────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen bg-[#fcf9f8] overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* Command Palette */}
      <CommandPalette
        open={paletteOpen}
        sessions={sessions}
        onClose={() => setPalette(false)}
        onNew={handleNewSession}
        onSwitch={(id) => { handleSwitchSession(id); setView('dashboard'); }}
      />

      {/* Image zoom modal */}
      <AnimatePresence>
        {modalImg && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-10 cursor-zoom-out"
            onClick={() => setModalImg(null)}
          >
            <img src={modalImg} className="max-h-full max-w-full object-contain" alt="Zoomed" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* PDF Modal */}
      <AnimatePresence>
        {pdfUrl && (
          <PdfViewerModal key="pdf" pdfUrl={pdfUrl} initialPage={pdfPage} onClose={() => setPdfUrl(null)} />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <Sidebar
        user={authUser}
        sessions={sessions}
        activeId={activeId}
        collapsed={collapsed}
        version={version}
        onNewSession={handleNewSession}
        onSwitchSession={handleSwitchSession}
        onDeleteSession={handleDeleteSession}
        onVersionChange={setVersion}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        onOpenPalette={() => setPalette(true)}
      />

      {/* Main panel */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#fcf9f8] relative overflow-hidden">

        {/* Header */}
        <header className="flex justify-between items-center w-full px-8 py-4 border-b border-[#C8D8F0]/20 bg-[#fcf9f8]/80 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setView('landing')}
              className="text-[#757681] hover:text-[#000d33] transition-colors"
              title="Back to home"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <nav className="flex items-center gap-2 text-xs font-medium text-[#757681]">
              <span>Projects</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
              <span>Industrial_Module_01</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
              <span className="text-[#002060] font-bold">{activeSession.title.slice(0, 30)}</span>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-industrial text-[#757681] tracking-widest hidden md:block">
              {isFlowchart ? 'LOGIC DESIGNER' : 'MODEL: ISA-X1 PRECISION'}
            </span>
            <button className="bg-[#000d33] text-white px-5 py-2 font-industrial text-sm tracking-widest hover:bg-[#0050C0] transition-colors">
              {isFlowchart ? 'COMPILE SCL' : 'EXECUTE CODE'}
            </button>
          </div>
        </header>

        {/* Chat */}
        <ChatArea
          session={activeSession}
          loading={loading}
          onImageClick={setModalImg}
          onPdfClick={handlePdfClick}
        />

        {/* Input */}
        <InputBar
          input={input}
          loading={loading}
          mode={activeSession.mode}
          saveState={saveState}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onSubmit={handleSubmit}
        />
      </main>
    </div>
  );
}

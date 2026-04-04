// Sidebar.tsx — Technical Navy Sidebar with Lucide React icons
import { useState } from 'react';
import {
  Plus, MessageSquare, GitBranch, HardHat, Clock,
  Trash2, Pencil, PanelLeftClose, PanelLeftOpen,
  Search, Settings2, Tag, ChevronDown, ChevronUp
} from 'lucide-react';
import type { Session } from '../types';
import { VERSIONS } from '../config';

interface SidebarProps {
  user            : { name: string; email: string } | null;
  sessions        : Session[];
  activeId        : string;
  collapsed       : boolean;
  version         : string;
  onNewSession    : (mode: 'qa' | 'flowchart') => void;
  onSwitchSession : (id: string) => void;
  onDeleteSession : (e: React.MouseEvent, id: string) => void;
  onVersionChange : (v: string) => void;
  onToggleCollapse: () => void;
  onOpenPalette   : () => void;
}

export default function Sidebar({
  user, sessions, activeId, collapsed, version,
  onNewSession, onSwitchSession, onDeleteSession,
  onVersionChange, onToggleCollapse, onOpenPalette,
}: SidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [showEnv, setShowEnv]     = useState(false);

  function startEdit(e: React.MouseEvent, sess: Session) {
    e.stopPropagation();
    setEditingId(sess.id);
    setEditTitle(sess.title);
  }

  // ── Collapsed ────────────────────────────────────────────────────────────
  if (collapsed) {
    return (
      <div className="flex flex-col items-center py-4 gap-4 bg-[#001540] border-r border-white/5 w-12 h-screen sticky top-0 shrink-0">
        <button onClick={onToggleCollapse} title="Expand sidebar" className="text-[#999999] hover:text-white transition-colors">
          <PanelLeftOpen size={18} />
        </button>
        <button onClick={() => onNewSession('qa')} title="New Chat" className="text-[#999999] hover:text-[#0050C0] transition-colors">
          <Plus size={18} />
        </button>
        <button onClick={() => onNewSession('flowchart')} title="Logic Designer" className="text-[#999999] hover:text-[#0050C0] transition-colors">
          <GitBranch size={18} />
        </button>
        <button onClick={onOpenPalette} title="Search (Ctrl+K)" className="text-[#999999] hover:text-white transition-colors">
          <Search size={18} />
        </button>
      </div>
    );
  }

  // ── Expanded ─────────────────────────────────────────────────────────────
  return (
    <aside className="flex flex-col h-screen sticky top-0 bg-[#001540] w-64 border-r border-white/5 grid-pattern shrink-0 text-white">

      {/* Header */}
      <div className="p-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tighter text-white font-industrial">CONTROLSAI</h1>
          <p className="text-[#999999] text-[10px] font-medium uppercase tracking-widest mt-1">Terminal 01-A</p>
        </div>
        <button onClick={onToggleCollapse} title="Collapse sidebar" className="text-[#555555] hover:text-white transition-colors mt-1">
          <PanelLeftClose size={18} />
        </button>
      </div>

      {/* Action buttons */}
      <div className="px-4 mb-4 space-y-2">
        <button
          onClick={() => onNewSession('qa')}
          className="w-full bg-[#0050C0] text-white py-2.5 px-4 flex items-center justify-center gap-2 font-headline text-sm font-bold transition-all hover:bg-[#003080] active:scale-95"
        >
          <Plus size={16} /> New Chat
        </button>
        <button
          onClick={() => onNewSession('flowchart')}
          className="w-full border border-white/10 text-[#999999] py-2.5 px-4 flex items-center justify-center gap-2 font-headline text-sm font-bold transition-all hover:bg-white/5 hover:text-white active:scale-95"
        >
          <GitBranch size={16} /> Logic Designer
        </button>
      </div>

      {/* Search / Palette trigger */}
      <div className="px-4 mb-4">
        <button
          onClick={onOpenPalette}
          className="w-full flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 text-[#555555] hover:text-white hover:border-white/20 transition-colors text-xs"
        >
          <Search size={13} />
          <span className="flex-1 text-left">Search sessions…</span>
          <kbd className="bg-white/10 px-1.5 py-0.5 text-[9px] font-mono">Ctrl K</kbd>
        </button>
      </div>

      {/* Sessions */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto scrollbar-hide">
        <div className="px-3 mb-2 text-[#999999] text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
          <Clock size={11} /> Recent Sessions
        </div>

        {sessions.length === 0 && (
          <div className="px-3 py-2 text-xs text-[#555555]">No sessions yet</div>
        )}

        {sessions.map((sess) => {
          const isActive = sess.id === activeId;
          const isEditing = editingId === sess.id;
          return (
            <div key={sess.id} className="relative group/item">
              {isEditing ? (
                <input
                  autoFocus
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={() => setEditingId(null)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === 'Escape') setEditingId(null);
                  }}
                  className="w-full bg-[#003080] text-white text-xs px-3 py-2 border border-[#0050C0] outline-none"
                />
              ) : (
                <button
                  onClick={() => onSwitchSession(sess.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs transition-all border-l-2 ${
                    isActive
                      ? 'bg-[#003080]/50 text-white border-[#0050C0]'
                      : 'text-[#999999] border-transparent hover:text-white hover:bg-[#003080]/20 hover:border-[#0050C0]/40'
                  }`}
                >
                  {sess.mode === 'qa'
                    ? <MessageSquare size={12} className="shrink-0 opacity-60" />
                    : <GitBranch    size={12} className="shrink-0 opacity-60" />
                  }
                  <span className="flex-1 text-left truncate">{sess.title}</span>
                </button>
              )}

              {/* Hover actions */}
              {!isEditing && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => startEdit(e, sess)}
                    className="text-[#555555] hover:text-white p-0.5 transition-colors"
                    title="Rename"
                  >
                    <Pencil size={11} />
                  </button>
                  <button
                    onClick={(e) => onDeleteSession(e, sess.id)}
                    className="text-[#555555] hover:text-red-400 p-0.5 transition-colors"
                    title="Delete session"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Environment / Version */}
      <div className="px-3 py-2 border-t border-white/5">
        <button
          onClick={() => setShowEnv(!showEnv)}
          className="w-full flex items-center gap-2 px-3 py-2 text-[#999999] hover:text-white transition-colors text-xs"
        >
          <Tag size={12} />
          <span className="flex-1 text-left">Environment</span>
          {showEnv ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
        {showEnv && (
          <div className="px-3 pb-2">
            <select
              className="w-full bg-[#0D1117] border border-white/10 text-[#999999] text-xs py-2 px-3 outline-none focus:border-[#0050C0] transition-colors"
              value={version}
              onChange={(e) => onVersionChange(e.target.value)}
            >
              {VERSIONS.map((v) => (
                <option key={v.value} value={v.value}>{v.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Dynamic Profile Footer */}
      {user && (
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-2 py-2 hover:bg-white/5 transition-colors cursor-pointer" title={user.email}>
            <div className="w-8 h-8 rounded-full bg-[#0050C0] flex items-center justify-center text-white text-xs border border-white/10 shrink-0 font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-white font-bold truncate">{user.name}</span>
              <span className="text-[10px] text-[#999999] truncate">{user.email}</span>
            </div>
            <Settings2 size={14} className="ml-auto text-[#555555] hover:text-white transition-colors" />
          </div>
        </div>
      )}
    </aside>
  );
}

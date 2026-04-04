// CommandPalette.tsx — Ctrl+K command palette
// Fuzzy search over sessions + quick actions.

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MessageSquare, GitBranch, Plus, Clock, X } from 'lucide-react';
import type { Session } from '../types';

interface CommandPaletteProps {
  open     : boolean;
  sessions : Session[];
  onClose  : () => void;
  onNew    : (mode: 'qa' | 'flowchart') => void;
  onSwitch : (id: string) => void;
}

interface PaletteItem {
  id    : string;
  label : string;
  sub?  : string;
  icon  : React.ReactNode;
  action: () => void;
}

export default function CommandPalette({ open, sessions, onClose, onNew, onSwitch }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [sel,   setSel]   = useState(0);
  const inputRef          = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) { setQuery(''); setSel(0); setTimeout(() => inputRef.current?.focus(), 50); }
  }, [open]);

  const staticItems: PaletteItem[] = [
    { id: 'new-qa',       label: 'New Q&A Chat',       sub: 'Start a fresh conversation',   icon: <Plus size={16} className="text-[#0050C0]" />, action: () => { onNew('qa');       onClose(); } },
    { id: 'new-flow',     label: 'New Logic Session',  sub: 'Open flowchart → SCL editor',  icon: <GitBranch size={16} className="text-[#0050C0]" />, action: () => { onNew('flowchart'); onClose(); } },
  ];

  const sessionItems: PaletteItem[] = sessions.map((s) => ({
    id    : s.id,
    label : s.title,
    sub   : s.mode === 'qa' ? 'Q&A Chat' : 'Logic Session',
    icon  : s.mode === 'qa' ? <MessageSquare size={16} className="text-[#999999]" /> : <GitBranch size={16} className="text-[#999999]" />,
    action: () => { onSwitch(s.id); onClose(); },
  }));

  const all = [...staticItems, ...sessionItems];
  const filtered = query
    ? all.filter((i) => i.label.toLowerCase().includes(query.toLowerCase()) || (i.sub ?? '').toLowerCase().includes(query.toLowerCase()))
    : all;

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(s + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
    if (e.key === 'Enter')     { filtered[sel]?.action(); }
    if (e.key === 'Escape')    { onClose(); }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[998]"
            onClick={onClose}
          />
          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg z-[999] bg-[#001540] border border-[#C8D8F0]/20 shadow-2xl overflow-hidden"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
              <Search size={16} className="text-[#999999] shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSel(0); }}
                onKeyDown={handleKey}
                placeholder="Search sessions or actions..."
                className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder-[#555555]"
              />
              <button onClick={onClose} className="text-[#555555] hover:text-white transition-colors">
                <X size={14} />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-72 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="text-center text-[#555555] text-xs py-8 uppercase tracking-widest">No results found</p>
              ) : (
                filtered.map((item, i) => (
                  <button
                    key={item.id}
                    onClick={item.action}
                    onMouseEnter={() => setSel(i)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${i === sel ? 'bg-[#0050C0]/20 border-l-2 border-[#0050C0]' : 'border-l-2 border-transparent hover:bg-white/5'}`}
                  >
                    {item.icon}
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">{item.label}</div>
                      {item.sub && <div className="text-[#999999] text-[11px]">{item.sub}</div>}
                    </div>
                    {i < staticItems.length && (
                      <span className="text-[10px] text-[#555555] font-mono">action</span>
                    )}
                    {i >= staticItems.length && (
                      <Clock size={12} className="text-[#555555] shrink-0" />
                    )}
                  </button>
                ))
              )}
            </div>

            {/* Footer shortcuts */}
            <div className="px-4 py-2 border-t border-white/10 flex gap-4 text-[10px] text-[#555555] font-industrial uppercase tracking-widest">
              <span>↑↓ Navigate</span><span>↵ Select</span><span>Esc Close</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

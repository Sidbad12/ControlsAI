// InputBar.tsx — Message input with Lucide icons, save indicator, disabled upload tooltip
import { useRef, useEffect, useState } from 'react';
import { Send, Upload, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

interface InputBarProps {
  input    : string;
  loading  : boolean;
  mode     : 'qa' | 'flowchart';
  saveState: 'idle' | 'saving' | 'saved' | 'error';
  onChange : (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onSubmit : () => void;
}

export default function InputBar({ input, loading, mode, saveState, onChange, onKeyDown, onSubmit }: InputBarProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const ta = ref.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`;
  }, [input]);

  const placeholder = mode === 'flowchart'
    ? 'Paste Mermaid flowchart here (graph TD ...)  →  Ctrl+Enter to generate SCL'
    : 'Ask about S7-1200 programming, errors, or logic…  →  Ctrl+Enter to send';

  return (
    <footer className="border-t border-[#C8D8F0]/20 bg-[#fcf9f8] px-6 py-4">
      <div className="max-w-4xl mx-auto">

        {/* Textarea container */}
        <div className="relative bg-[#eae7e7] border-none focus-within:ring-2 focus-within:ring-[#0050C0]/40 transition-shadow">
          <textarea
            ref={ref}
            value={input}
            onChange={onChange}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            disabled={loading}
            rows={3}
            className="w-full bg-transparent px-5 py-4 pr-28 text-sm text-[#1b1c1c] placeholder-[#757681] resize-none focus:outline-none disabled:opacity-60 leading-relaxed"
            style={{ minHeight: '80px', maxHeight: '200px' }}
          />

          {/* Action buttons */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            {/* Upload — disabled, coming soon */}
            <div className="relative group">
              <button
                disabled
                className="p-2 text-[#c5c6d2] cursor-not-allowed"
                title="File upload — coming in v1.2"
              >
                <Upload size={18} />
              </button>
              <div className="absolute bottom-full right-0 mb-1.5 whitespace-nowrap bg-[#001540] text-white text-[10px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-industrial uppercase tracking-wider">
                Coming in v1.2
              </div>
            </div>

            {/* Send */}
            <button
              onClick={onSubmit}
              disabled={loading || !input.trim()}
              className="bg-[#0050C0] text-white p-2.5 hover:bg-[#003080] transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center"
              title="Send (Ctrl+Enter)"
            >
              {loading
                ? <Loader2 size={18} className="animate-spin" />
                : <Send size={18} />
              }
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between mt-2 px-1">
          <div className="flex gap-4 text-[10px] text-[#757681] font-industrial uppercase tracking-widest">
            <span>Ctrl+Enter Send</span>
            <span>·</span>
            <span>Ctrl+K Search</span>
            <span>·</span>
            <span>Ctrl+N New Chat</span>
          </div>

          {/* Save indicator */}
          <div className="flex items-center gap-1.5 text-[10px] transition-all">
            {saveState === 'saving' && (
              <span className="flex items-center gap-1 text-[#999999]">
                <Loader2 size={11} className="animate-spin" /> Saving…
              </span>
            )}
            {saveState === 'saved' && (
              <span className="flex items-center gap-1 text-emerald-500">
                <CheckCircle2 size={11} /> Saved
              </span>
            )}
            {saveState === 'error' && (
              <span className="flex items-center gap-1 text-red-400">
                <AlertCircle size={11} /> Failed to save
              </span>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

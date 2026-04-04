// components/ChatArea.tsx — Scrollable message list with empty state.
import { useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import type { Session } from '../types';
import MessageBubble from './MessageBubble';
import { msgVariants } from '../styles';

interface ChatAreaProps {
  session     : Session;
  loading     : boolean;
  onImageClick: (url: string) => void;
  onPdfClick  : (url: string, pages: number[]) => void;
}

export default function ChatArea({ session, loading, onImageClick, onPdfClick }: ChatAreaProps) {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session.messages, loading]);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 relative">
      <div className="max-w-4xl mx-auto w-full">

        {/* Empty state */}
        {session.messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full min-h-[60vh]">
            <h2 className="text-3xl font-industrial font-[500] text-[#001540] tracking-widest uppercase mt-[-10vh]">
               {session.mode === 'qa' ? 'How can I help you today?' : 'Paste a Mermaid flowchart to begin.'}
            </h2>
          </div>
        )}

        {/* Message list */}
        <AnimatePresence initial={false}>
          {session.messages.map((m, i) => (
            <MessageBubble
              key={`${session.id}-${i}`}
              m={m}
              sessionId={session.id}
              index={i}
              onImageClick={onImageClick}
              onPdfClick={onPdfClick}
            />
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        {loading && (
          <motion.div
            key="loading"
            variants={msgVariants}
            initial="hidden"
            animate="visible"
            className="flex items-center gap-6 max-w-4xl mx-auto w-full mb-12"
          >
            <div className="w-10 h-10 shrink-0 bg-[#0050C0]/50 rounded-sm flex items-center justify-center text-white">
               <span className="material-symbols-outlined animate-pulse">memory</span>
            </div>
            <div className="flex-1 flex items-center gap-3">
               <svg className="animate-spin h-5 w-5 text-[#0050C0]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
               <span className="text-sm font-工业 text-[#0050C0] uppercase tracking-widest font-industrial animate-pulse">Querying Knowledge Base...</span>
            </div>
          </motion.div>
        )}

        <div ref={chatEndRef} />
      </div>
    </div>
  );
}

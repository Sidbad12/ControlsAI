// components/MessageBubble.tsx — Precision Architect Message layout.
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion } from 'framer-motion';

import type { Message } from '../types';
import { msgVariants } from '../styles';
import { API_BASE } from '../config';

// ── Markdown code renderers ──────────────────────────────────────────────────
function CodeBlock({ className, children }: { className?: string; children: React.ReactNode }) {
  const match = /language-(\w+)/.exec(className || '');
  let lang = match ? match[1].toLowerCase() : 'text';
  if (['scl', 'st', 'ladder'].includes(lang)) lang = 'pascal';
  return (
    <div className="bg-[#0D1117] rounded-sm overflow-hidden relative group my-4">
      <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none"></div>
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
        <span className="text-[10px] font-code text-[#999999] uppercase">{lang}</span>
      </div>
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={lang}
        PreTag="div"
        wrapLongLines={true}
        customStyle={{
          margin: 0, padding: '1.5rem', background: 'transparent',
          fontFamily: "'JetBrains Mono', monospace", fontSize: '12px'
        }}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  );
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-[13px] bg-black/10 text-[#0050C0] px-1.5 py-0.5 rounded-sm">
      {children}
    </code>
  );
}

// ── MessageBubble ────────────────────────────────────────────────────────────
interface Props {
  m           : Message;
  sessionId   : string;
  index       : number;
  onImageClick: (url: string) => void;
  onPdfClick  : (url: string, pages: number[]) => void;
}

export default function MessageBubble({ m, sessionId, index, onImageClick, onPdfClick }: Props) {
  const isUser = m.role === 'user';

  if (isUser) {
    return (
      <motion.div
        key={`${sessionId}-${index}`}
        variants={msgVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto flex gap-6 w-full mb-12"
      >
        <div className="w-10 h-10 shrink-0 bg-surface-container-high rounded-sm flex flex-col items-center justify-center text-primary-container">
          <span className="material-symbols-outlined text-sm pt-1">person</span>
        </div>
        <div className="flex-1">
          <h3 className="text-xs font-bold uppercase tracking-widest text-outline mb-2">Technical Engineer</h3>
          <div className="text-lg font-headline font-medium leading-relaxed">
            {m.content}
          </div>
        </div>
      </motion.div>
    );
  }

  // Assistant Message
  return (
    <motion.div
      key={`${sessionId}-${index}`}
      variants={msgVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto flex gap-6 w-full mb-12"
    >
      <div className="w-10 h-10 shrink-0 bg-[#0050C0] rounded-sm flex items-center justify-center text-white">
        <span className="material-symbols-outlined">memory</span>
      </div>
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#0050C0]">CONTROLSAI Assistant</h3>
          <span className="text-[10px] font-industrial text-outline tracking-widest">VERIFIED LOGIC</span>
        </div>
        <div className="p-6 bg-surface-container-lowest rounded-sm border-l-4 border-[#0050C0] shadow-[0px_20px_50px_rgba(0,21,64,0.06)]">
          <div className="text-on-surface leading-relaxed mb-6 font-body text-[15px]">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  return !inline
                    ? <CodeBlock className={className}>{children}</CodeBlock>
                    : <InlineCode>{children}</InlineCode>;
                },
                p({ children }) {
                  return <p className="mb-4 text-[#2A2A2A]">{children}</p>;
                },
                ul({ children }) {
                  return <ul className="mb-4 list-disc pl-6 space-y-1 text-[#2A2A2A]">{children}</ul>;
                },
                ol({ children }) {
                  return <ol className="mb-4 list-decimal pl-6 space-y-1 text-[#2A2A2A]">{children}</ol>;
                },
                h3({ children }) {
                  return <h3 className="text-lg font-headline font-bold text-primary mt-6 mb-3">{children}</h3>;
                }
              }}
            >
              {m.content.replace(/\[Source \d+\s*\|[\s\S]*?Pages\s*\[.*?\]\]\s*/g, '')}
            </ReactMarkdown>
          </div>

          {/* Source chips */}
          {m.sources && m.sources.length > 0 && (
            <div className="mt-4 pt-4 border-t border-[#EAEAEA] flex flex-wrap gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#999999] w-full mb-1">Sources</span>
              {m.sources.map((src, si) =>
                src.pdf_url ? (
                  <button key={si}
                    onClick={() => onPdfClick(`${API_BASE}${src.pdf_url}`, src.pages || [])}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#0050C0]/5 hover:bg-[#0050C0]/10 border border-[#0050C0]/20 text-[#0050C0] transition-colors text-[11px] font-medium"
                    title="Open PDF"
                  >
                    <span className="material-symbols-outlined text-[14px]">article</span>
                    {src.section?.slice(0, 26)} · p.{src.pages?.join(',')}
                  </button>
                ) : (
                  <span key={si} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-surface text-outline border border-[#EAEAEA] text-[11px] font-medium">
                    {src.section?.slice(0, 28)} · p.{src.pages?.join(',')}
                  </span>
                )
              )}
            </div>
          )}

          {/* Diagram images */}
          {m.images && m.images.length > 0 && (
            <div className="mt-6 pt-4 border-t border-[#EAEAEA] grid grid-cols-2 gap-4">
               {m.images.map((img, ii) => (
                  <div key={ii} className="bg-white p-2 border border-[#C8D8F0]/40 rounded-sm group hover:border-[#0050C0] transition-colors cursor-pointer" onClick={() => onImageClick(`${API_BASE}${img.image_url}`)}>
                    <img
                      src={`${API_BASE}${img.image_url}`}
                      alt={img.caption || 'Diagram'}
                      className="w-full h-32 object-cover mb-2 grayscale-[50%] group-hover:grayscale-0 transition-all rounded-sm"
                    />
                    {(img.caption || img.explanation) && (
                      <span className="text-[10px] font-medium text-primary block truncate">
                        {img.caption || img.explanation}
                      </span>
                    )}
                  </div>
               ))}
            </div>
          )}
          
          {m.latency && (
            <div className="text-right mt-4 text-[10px] font-industrial tracking-widest text-[#999999] uppercase">
              {m.latency}ms
            </div>
          )}

        </div>
      </div>
    </motion.div>
  );
}

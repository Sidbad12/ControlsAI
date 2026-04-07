// LandingPage.tsx — Precision Architect Landing Page
// Animated with Framer Motion + Lucide React icons + moving grid background

import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, MessageSquare, GitBranch, HardHat, Clock,
  Trash2, Pencil, PanelLeftClose, PanelLeftOpen,
  Search, Settings2, Tag, ChevronDown, ChevronUp, ChevronRight,
  Bell, History, Cpu, Shield, BookOpen, Server, CheckCircle,
  ArrowRight, Zap, Lock, BarChart3, ArrowLeft, ExternalLink
} from 'lucide-react';

interface LandingPageProps {
  user: { name: string; email: string; lastLogin?: string } | null;
  isLoggedIn: boolean;
  onLogout: () => void;
  onStartChat: () => void;
  onStartFlowchart: () => void;
  onLogin: () => void;
  onPrivacy: () => void;
  onTerms: () => void;
  uiMode: 'normal' | 'tui';
  onToggleMode: () => void;
}

// ── Animation Variants ────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as any },
  }) as any,
} as any;

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, delay },
  }),
};

const slideRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as any, delay: 0.3 } } as any,
} as any;

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as any } } as any,
} as any;

// ── Code lines data ───────────────────────────────────────────────────────────
const codeLines = [
  { n: '01', text: 'FUNCTION_BLOCK "ControlLogic"', color: '#C8D8F0' },
  { n: '02', text: 'VAR_INPUT', color: '#0050C0', italic: true },
  { n: '03', text: '    i_Start : BOOL;', color: '#fff' },
  { n: '04', text: '    i_EStop : BOOL;', color: '#fff' },
  { n: '05', text: 'END_VAR', color: '#0050C0', italic: true },
  { n: '06', text: 'REGION Logic_Processing', color: '#EAEAEA' },
  { n: '07', text: '    IF i_Start AND NOT i_EStop THEN', color: '#0050C0' },
  { n: '08', text: '        #q_MotorRun := TRUE;', color: '#6b8add' },
  { n: '09', text: '        #Status := 16#F001; // OK', color: '#fff', highlight: true },
  { n: '10', text: '    ELSE', color: '#0050C0' },
  { n: '11', text: '        #q_MotorRun := FALSE;', color: '#ba1a1a' },
  { n: '12', text: '    END_IF;', color: '#0050C0' },
  { n: '13', text: 'END_REGION', color: '#EAEAEA' },
];

const features = [
  { icon: Cpu, title: 'RAG-Powered Q&A', wide: true, desc: 'Semantic search over Siemens S7-1200 Function Manual, System Manual, and Error Codes. Every answer cites the exact section and page. Powered by FAISS + BM25 hybrid retrieval with cross-encoder reranking.' },
  { icon: GitBranch, title: 'Flowchart → SCL', wide: false, desc: 'Paste a Mermaid process diagram. Get a runnable IEC 61131-3 SCL Function Block — REGION-structured, S7-Optimized, ready for TIA Portal.' },
  { icon: Shield, title: 'Safety Checker', wide: false, desc: 'Automatic flagging of missing interlocks, uninitialized outputs, and SIL compliance gaps before code leaves the terminal.' },
  { icon: BookOpen, title: 'PDF Citation Engine', wide: false, desc: 'Every Q&A response links directly to the source manual page. Open PDFs inline — no switching between tools.' },
  { icon: BarChart3, title: 'Version Targeting', wide: false, desc: 'Filter answers by firmware version — TIA V17, V18, V19, and S7-1200 CPU generations — so you always get version-accurate code.' },
  { icon: Lock, title: 'Zero Cloud Exposure', wide: false, desc: 'Session memory stored locally in IndexedDB. Queries processed on-demand. Your PLC logic never leaves your machine.' },
];

const badges = ['TIA_V19_READY', 'STUDIO_5000_L8', 'TWINCAT_3.1', 'CODESYS_V3'];
const checks = ['Memory Management Optimization', 'Cycle Time Calculation', 'Structured Text Linting'];

// ── Component ─────────────────────────────────────────────────────────────────
export default function LandingPage({
  user, isLoggedIn, onLogout, onStartChat, onStartFlowchart,
  onLogin, onPrivacy, onTerms, uiMode, onToggleMode
}: LandingPageProps) {
  if (uiMode === 'tui') {
    return (
      <div className="min-h-screen bg-[#1c1917] text-[#d4cfc8] p-8 flex flex-col gap-12 overflow-x-hidden font-mono selection:bg-[#c4a96b] selection:text-[#1c1917]">
        {/* Header */}
        <motion.header
          initial="hidden" animate="visible" variants={fadeIn}
          className="flex justify-between items-center shrink-0"
        >
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <div className="text-[#7a9eb5] font-bold text-xl tracking-tighter uppercase leading-none">CONTROLSAI</div>
              <div className="text-[#7a756e] text-[9px] uppercase tracking-[0.3em] font-medium mt-1">V1.0</div>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <button
              onClick={onToggleMode}
              className="border border-[#6a9e7f] text-[#6a9e7f] px-3 py-1.5 text-[11px] font-bold uppercase hover:bg-[#6a9e7f] hover:text-[#1c1917] transition-all"
            >
              [ CLASSIC_VIEW ]
            </button>
            {isLoggedIn ? (
              <>
                <button onClick={onStartChat} className="border border-[#7a9eb5] text-[#7a9eb5] px-3 py-1.5 text-[11px] font-bold uppercase hover:bg-[#7a9eb5] hover:text-[#1c1917] transition-all">
                  [ RETURN_TO_TERMINAL ]
                </button>
                <button onClick={onLogout} className="border border-[#2e2b28] text-[#d4cfc8] px-3 py-1.5 text-[11px] font-bold uppercase hover:bg-[#2e2b28] transition-all">
                  [ SIGN_OUT ]
                </button>
                {user && (
                  <div
                    className="w-8 h-8 rounded-sm border border-[#c4a96b] flex items-center justify-center text-[#c4a96b] text-[10px] font-bold hover:bg-[#c4a96b]/10 transition-colors shrink-0"
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </>
            ) : (
              <>
                <button onClick={onLogin} className="border border-[#2e2b28] text-[#d4cfc8] px-3 py-1.5 text-[11px] font-bold uppercase hover:bg-[#2e2b28] transition-all">
                  [ SIGN_IN ]
                </button>
                <button onClick={onStartChat} className="border border-[#7a9eb5] text-[#7a9eb5] px-3 py-1.5 text-[11px] font-bold uppercase hover:bg-[#7a9eb5] hover:text-[#1c1917] transition-all">
                  [ REQUEST_ACCESS ]
                </button>
              </>
            )}
          </div>
        </motion.header>

        {/* Hero */}
        <motion.section
          initial="hidden" animate="visible" variants={staggerContainer}
          className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-24 pb-20"
        >
          <div className="flex flex-col gap-8">
            <motion.div variants={fadeUp} className="flex items-center gap-3">
              <span className="text-[#c4a96b] text-[10px] font-bold border border-[#c4a96b] px-2 py-0.5 uppercase tracking-widest">SYSTEM_STATUS: OK_ONLINE</span>
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-6xl md:text-7xl font-bold leading-none tracking-tighter">THE PLC<br /><span className="text-[#7a9eb5]">ENGINEER'S</span><br />SECOND BRAIN.</motion.h1>
            <motion.p variants={fadeUp} className="text-[#7a756e] text-lg leading-relaxed max-w-lg">Bridge the gap between conceptual flowcharts and production logic. An AI architect designed for industrial precision.</motion.p>
            <motion.div variants={fadeUp} className="flex flex-col md:flex-row gap-4 pt-4">
              <button onClick={onStartChat} className="border border-[#7a9eb5] text-[#7a9eb5] text-lg px-8 py-4 uppercase font-bold hover:bg-[#7a9eb5] hover:text-[#1c1917] transition-all flex items-center justify-center gap-3 active:scale-95">
                <ChevronRight size={20} /> START_Q&A_SESSION
              </button>
              <button onClick={onStartFlowchart} className="border border-[#2e2b28] text-[#d4cfc8] text-lg px-8 py-4 uppercase font-bold hover:bg-[#2e2b28] transition-all flex items-center justify-center gap-3 active:scale-95">
                <ChevronRight size={20} /> DESIGN_LOGIC_BLOCK
              </button>
            </motion.div>
          </div>
          <motion.div
            variants={slideRight}
            className="border border-[#2e2b28] bg-[#252220] p-6 relative flex flex-col min-h-[300px] shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
          >
            <div className="absolute -top-3 left-6 bg-[#1c1917] px-2 text-[#b87070] font-bold text-[10px] uppercase tracking-widest">Active_Compilation_Window</div>
            <div className="text-[12px] leading-relaxed text-[#7a756e] overflow-hidden">
              <pre>
                {codeLines.map((line, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.05 }}
                    key={line.n}
                  >
                    <span className="text-[#4a4640] mr-4">{line.n}</span>
                    <span style={{ color: line.highlight ? '#c4a96b' : '#7a756e' }}>{line.text}</span>
                  </motion.div>
                ))}
              </pre>
            </div>
            <div className="mt-auto border-t border-[#2e2b28] pt-4 flex justify-between items-center text-[10px]">
              <span className="text-[#7a9eb5]">COMPILATION COMPLETE</span>
              <span className="text-[#4a4640]">LOC: 13 // CHECKSUM: 0x8A4B</span>
            </div>
          </motion.div>
        </motion.section>

        {/* Features */}
        <motion.section
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="max-w-6xl mx-auto w-full flex flex-col gap-8 pt-20"
        >
          <div className="flex items-center gap-4">
            <motion.h2 variants={fadeUp} className="text-3xl font-bold tracking-tight uppercase">ENGINEERED_SYSTEMS_CORE</motion.h2>
            <div className="h-[1px] flex-1 bg-[#2e2b28]"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                variants={cardVariant}
                whileHover={{ borderColor: '#7a9eb5', y: -5 }}
                className="border border-[#2e2b28] bg-[#252220] p-8 flex flex-col gap-4 transition-all"
              >
                <div className="text-[#7a9eb5] flex justify-between uppercase font-bold text-[11px]">
                  <span>{f.title}</span>
                  <span className="text-[#4a4640]">[{String(i + 1).padStart(2, '0')}]</span>
                </div>
                <p className="text-[#7a756e] text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Built by Engineers (Industrial Variant) */}
        <section className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center pt-32">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="border border-[#2e2b28] bg-[#0d1117] p-8 font-mono text-xs text-[#7a9eb5] leading-relaxed space-y-1 shadow-2xl"
          >
            <div className="text-[#c4a96b]">FUNCTION_BLOCK "FB_Synthesis_Core"</div>
            <div>{'  '}i_Command_Vector : Array[0..1024] of Byte;</div>
            <div className="text-[#c4a96b]">REGION Logic_Verification</div>
            <div className="text-[#4a4640]">{'  '}// Status: Integrity Check in Progress...</div>
            <div>[ OK ] System Boundary Validation</div>
            <div>[ OK ] Memory Offset Calculation</div>
            <div>[ !! ] Pending SCL Synthesis</div>
            <div className="text-[#c4a96b]">END_REGION</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-6"
          >
            <h2 className="text-4xl font-bold uppercase tracking-tighter leading-none">BUILT_FOR_PRECISION<br /><span className="text-[#7a9eb5]">DOMAIN_SPECIFIC_CORE</span></h2>
            <p className="text-[#7a756e] leading-relaxed">The high stakes of industrial automation demand deterministic output. CONTROLSAI respects the physical constraints of industrial hardware, ensuring your PLC logic is safe, structured, and production-ready.</p>
            <ul className="grid grid-cols-1 gap-4">
              {checks.map((c, i) => (
                <motion.li
                  key={c}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider text-[#d4cfc8]"
                >
                  <div className="w-1.5 h-1.5 bg-[#6a9e7f] rounded-full"></div>
                  {c}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </section>

        {/* CTA Banner (Industrial Variant) */}
        <motion.section
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-4xl mx-auto w-full text-center pt-32 pb-20"
        >
          <motion.h2 variants={fadeUp} className="text-5xl font-bold uppercase tracking-tighter mb-6">READY_FOR_SYNTHESIS?</motion.h2>
          <motion.p variants={fadeUp} className="text-[#7a756e] mb-10">Access the CONTROLSAI core system and architect industrial logic with machine precision.</motion.p>
          <motion.div variants={fadeUp} className="flex flex-col md:flex-row justify-center gap-4">
            <input
              className="bg-[#252220] border border-[#2e2b28] px-6 py-4 w-full md:w-96 text-[#d4cfc8] font-mono text-xs focus:outline-none focus:border-[#7a9eb5] transition-all"
              placeholder="ENTER_CORPORATE_CREDENTIALS..."
            />
            <button
              onClick={onStartChat}
              className="bg-[#7a9eb5] text-[#1c1917] px-10 py-4 font-bold uppercase tracking-widest hover:bg-[#d4cfc8] transition-all active:scale-95"
            >
              [ REQUEST_ACCESS ] {/* ok */}
            </button>
          </motion.div>
        </motion.section>

        {/* Footer */}
        <footer className="mt-auto pt-12 border-t border-[#2e2b28] flex justify-between items-center text-[10px] text-[#4a4640] uppercase tracking-widest">
          <div>@2026_KURO // INDUSTRIAL_LOGIC_SYNTHESIS</div>
          <div className="flex gap-8">
            <button onClick={onTerms} className="hover:text-[#d4cfc8]">TERMS_OF_SERVICE</button>
            <button onClick={onPrivacy} className="hover:text-[#d4cfc8]">PRIVACY_POLICY</button>
          </div>
          <div className="text-[#7a756e]">AWAITING_COMMAND<span className="animate-pulse ml-2 text-white">_</span></div>
        </footer>
      </div>
    );
  }

  return (
    <div className="bg-[#001540] text-white min-h-screen overflow-x-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Moving Grid Background ─────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0 grid-moving" />

      {/* ── Blue ambient glow ──────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full bg-[#0050C0] opacity-5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#003080] opacity-8 blur-[80px]" />
      </div>

      {/* ── Top NavBar ─────────────────────────────────────────────────── */}
      <motion.header
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        custom={0}
        className="relative z-50 bg-[#001540]/80 backdrop-blur-md border-b border-[#C8D8F0]/10 sticky top-0"
      >
        <nav className="flex justify-between items-center w-full px-6 py-3">
          <div className="flex items-center gap-8">
            <div className="flex flex-col">
              <motion.span
                variants={fadeUp}
                custom={0.1}
                className="text-xl font-bold text-white tracking-widest uppercase font-industrial leading-none"
              >
                CONTROLSAI
              </motion.span>
              <motion.span
                variants={fadeUp}
                custom={0.2}
                className="text-[9px] text-[#C8D8F0]/60 tracking-[0.3em] font-industrial mt-1"
              >
                V1.0
              </motion.span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.03, backgroundColor: 'rgba(122, 158, 181, 0.1)' }}
              onClick={onToggleMode}
              className="border border-[#7a9eb5]/30 text-[#7a9eb5] px-4 py-1.5 text-xs font-industrial uppercase tracking-wider transition-all hover:bg-[#7a9eb5]/5"
            >
              Terminal View
            </motion.button>
            {isLoggedIn ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.03, backgroundColor: '#003080' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onStartChat}
                  className="bg-[#0050C0] text-white px-4 py-1.5 text-xs font-industrial uppercase tracking-wider transition-colors"
                >
                  Return to Terminal
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.1)' }}
                  onClick={onLogout}
                  className="border border-white/20 text-white px-4 py-1.5 text-xs font-industrial uppercase tracking-wider transition-all hover:bg-white/5"
                >
                  Sign Out
                </motion.button>
                {user && (
                  <div
                    className="w-8 h-8 rounded-full bg-[#0050C0] flex items-center justify-center text-white text-xs border border-white/20 hover:border-white/50 shrink-0 font-bold cursor-help group relative transition-colors"
                  >
                    {user.name.charAt(0).toUpperCase()}
                    <div className="absolute top-10 right-0 bg-[#001540] border border-[#0050C0] p-3 shadow-[0_10px_40px_rgba(0,0,0,0.5)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 text-left rounded-sm">
                      <p className="text-white text-xs font-bold font-industrial uppercase tracking-widest">{user.email}</p>
                      <p className="text-[#999999] text-[10px] mt-1.5 uppercase font-medium">Last Auth: {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Just now'}</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.1)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onLogin}
                  className="border border-white/20 text-white px-4 py-1.5 text-xs font-industrial uppercase tracking-wider transition-all"
                >
                  Sign In
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03, backgroundColor: '#003080' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onStartChat}
                  className="bg-[#0050C0] text-white px-4 py-1.5 text-xs font-industrial uppercase tracking-wider transition-colors"
                >
                  Request Access
                </motion.button>
              </>
            )}
          </div>
        </nav>
      </motion.header>

      {/* ── Hero Section ───────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          {/* Badge */}
          <motion.div
            initial="hidden" animate="visible" variants={fadeUp} custom={0.1}
            className="inline-flex items-center px-3 py-1 bg-[#003080] border-l-4 border-[#0050C0] mb-6"
            style={{ animation: 'glow-pulse 3s ease-in-out infinite' }}
          >
            <Zap size={12} className="mr-2 text-[#0050C0]" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white">System Status: Online [Terminal 01-A]</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial="hidden" animate="visible" variants={staggerContainer}
            className="text-6xl md:text-8xl font-bold leading-tight mb-8 font-headline"
          >
            <motion.span variants={fadeUp} custom={0.15} className="block">The PLC</motion.span>
            <motion.span variants={fadeUp} custom={0.25} className="block text-[#0050C0]">Engineer's</motion.span>
            <motion.span variants={fadeUp} custom={0.35} className="block">Second Brain.</motion.span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial="hidden" animate="visible" variants={fadeUp} custom={0.45}
            className="text-[#C8D8F0] text-lg max-w-lg mb-10 leading-relaxed font-medium"
          >
            Bridge the gap between conceptual flowcharts and production-ready SCL.
            An AI architect designed for industrial precision, safety, and deterministic logic.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial="hidden" animate="visible" variants={fadeUp} custom={0.55}
            className="flex flex-wrap gap-4"
          >
            <motion.button
              onClick={onStartChat}
              whileHover={{ scale: 1.03, backgroundColor: '#003080' }}
              whileTap={{ scale: 0.97 }}
              className="bg-[#0050C0] text-white px-8 py-4 font-industrial uppercase tracking-[0.1em] text-lg transition-all flex items-center gap-3 group"
            >
              <MessageSquare size={20} />
              Start Q&amp;A Chat
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <motion.button
              onClick={onStartFlowchart}
              whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.97 }}
              className="border border-white/20 text-white px-8 py-4 font-industrial uppercase tracking-[0.1em] text-lg transition-all flex items-center gap-3"
            >
              <GitBranch size={20} />
              Flowchart → SCL Code
            </motion.button>
          </motion.div>

          {/* Badges */}
          <motion.div
            initial="hidden" animate="visible" variants={fadeUp} custom={0.65}
            className="mt-16 flex flex-wrap gap-3 items-center"
          >
            <span className="text-[10px] uppercase tracking-widest text-[#999999] block w-full mb-2">Compatible Environments:</span>
            {badges.map((b, i) => (
              <motion.div
                key={b}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 0.6, scale: 1 }}
                transition={{ delay: 0.7 + i * 0.05 }}
                whileHover={{ opacity: 1 }}
                className="px-2 py-1 bg-white/5 border border-white/10 flex items-center gap-2 cursor-default"
              >
                <span className="text-[10px] font-mono">{b}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ── Code Panel ─────────────────────────────────────────────── */}
        <motion.div
          initial="hidden" animate="visible" variants={slideRight}
          className="relative z-10 lg:pl-10"
        >
          <motion.div
            whileHover={{ y: -4, boxShadow: '0 30px 60px rgba(0,80,192,0.2)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="rounded-lg overflow-hidden shadow-2xl border border-[#C8D8F0]/10"
            style={{ background: 'rgba(0,48,128,0.4)', backdropFilter: 'blur(20px)' }}
          >
            {/* Window chrome */}
            <div className="bg-[#001540] px-4 py-2 border-b border-white/10 flex justify-between items-center">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
              </div>
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">logic_fragment_08.scl</span>
            </div>

            {/* Code lines */}
            <div className="p-6 font-mono text-sm leading-relaxed">
              {codeLines.map(({ n, text, color, italic, highlight }, i) => (
                <motion.div
                  key={n}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.05, duration: 0.3 }}
                  className={`flex ${highlight ? 'bg-[#0050C0]/20 rounded' : ''}`}
                >
                  <span
                    className="mr-4 select-none w-6 text-right"
                    style={{ color: highlight ? '#0050C0' : '#ffffff33', fontWeight: highlight ? 'bold' : undefined }}
                  >
                    {n}
                  </span>
                  <span style={{ color, fontStyle: italic ? 'italic' : undefined }}>{text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Glow behind panel */}
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#0050C0] opacity-10 blur-[100px]" />
        </motion.div>
      </section>

      {/* ── Features Bento Grid ────────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-industrial text-4xl uppercase tracking-tighter mb-12"
        >
          Engineered Modules
        </motion.h2>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          {features.map(({ icon: Icon, title, wide, desc }) => (
            <motion.div
              key={title}
              variants={cardVariant}
              whileHover={{ borderColor: 'rgba(0,80,192,0.6)', y: -2 }}
              className={`${wide ? 'md:col-span-2' : ''} bg-white/5 p-8 border border-white/10 transition-colors cursor-default`}
            >
              <Icon size={36} className="text-[#0050C0] mb-4" />
              <h3 className="font-industrial text-2xl uppercase mb-3">{title}</h3>
              <p className="text-[#999999] text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}

          {/* Flowchart card */}
          <motion.div
            variants={cardVariant}
            whileHover={{ borderColor: 'rgba(0,80,192,0.6)', y: -2 }}
            onClick={onStartFlowchart}
            className="bg-white/5 p-8 border border-white/10 transition-all cursor-pointer group"
          >
            <GitBranch size={36} className="text-[#0050C0] mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-industrial text-2xl uppercase mb-3">Logic Designer</h3>
            <p className="text-[#999999] text-sm leading-relaxed mb-4">Visual flowchart to SCL in seconds.</p>
            <span className="text-[#0050C0] text-xs font-industrial uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
              Open Designer <ArrowRight size={12} />
            </span>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Built by Engineers ────────────────────────────────────────── */}
      <section className="relative z-10 bg-[#EAEAEA] py-32 text-[#001540]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Code preview block */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as any }}
            className="relative order-2 lg:order-1"
          >
            <div className="shadow-2xl overflow-hidden border border-[#002060]/20 bg-white">
              <div className="w-full bg-[#001540] p-6 font-mono text-xs text-[#C8D8F0] leading-relaxed space-y-1">
                <div className="text-[#0050C0]">FUNCTION_BLOCK "FB_PressureValve"</div>
                <div>{'  '}i_Pressure_Actual : Real;</div>
                <div className="text-[#0050C0]">REGION Safety_Interlocks</div>
                <div className="text-[#999999]">{'  '}// Priority 0: Emergency Overrides</div>
                <div><span className="text-[#0050C0]">IF</span> i_Emergency_Stop <span className="text-[#0050C0]">THEN</span></div>
                <div>{'    '}q_Valve_Output := 0.0;</div>
                <div>{'    '}q_Status_Alarm := TRUE;</div>
                <div><span className="text-[#0050C0]">{'    '}RETURN;</span></div>
                <div className="text-[#0050C0]">END_IF;</div>
                <div className="text-[#0050C0]">END_REGION</div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 bg-[#0050C0] text-white p-6 font-industrial uppercase tracking-widest text-xl">
              Precision. Output.
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as any, delay: 0.15 }}
            className="order-1 lg:order-2"
          >
            <h2 className="font-industrial text-5xl md:text-6xl uppercase tracking-tighter mb-8 leading-none">
              Built by Engineers. <br />
              For Engineers.
            </h2>
            <p className="text-[#2A2A2A] text-lg mb-8 font-medium leading-relaxed">
              We understand the high stakes of industrial automation. One wrong semi-colon can cost millions in downtime. CONTROLSAI isn't just an LLM wrapper — it's a domain-specific logic engine designed to respect the physical constraints of industrial hardware.
            </p>
            <ul className="space-y-4 mb-10">
              {checks.map((item) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3 font-semibold text-sm uppercase tracking-wide"
                >
                  <CheckCircle size={20} className="text-[#0050C0] shrink-0" />
                  {item}
                </motion.li>
              ))}
            </ul>
            <motion.a
              href="https://drive.google.com/drive/folders/1qiOnHAFP0VDGicxFJIOggY2Ys9nrd6N8?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ x: 4 }}
              className="inline-flex items-center gap-2 font-industrial uppercase text-lg border-b-2 border-[#0050C0] pb-1 hover:text-[#0050C0] transition-colors"
            >
              Explore Technical Documentation <ExternalLink size={16} />
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────────────────── */}
      <section className="relative z-10 py-24 max-w-5xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-industrial text-5xl uppercase mb-8"
        >
          Ready to evolve your logic?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-[#999999] mb-12 max-w-xl mx-auto"
        >
          Get early access to the CONTROLSAI Terminal and start architecting industrial systems with the speed of thought.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-col md:flex-row justify-center gap-4"
        >
          <input
            className="bg-white/5 border border-white/10 px-6 py-4 w-full md:w-96 text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-[#0050C0] focus:border-[#0050C0] transition-all"
            placeholder="Enter corporate email..."
            type="email"
          />
          <motion.button
            onClick={onStartChat}
            whileHover={{ scale: 1.03, backgroundColor: '#003080' }}
            whileTap={{ scale: 0.97 }}
            className="bg-[#0050C0] text-white px-8 py-4 font-industrial uppercase tracking-widest text-lg transition-all"
          >
            {isLoggedIn ? 'Return to Terminal' : 'Request Access'}
          </motion.button>
        </motion.div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="relative z-10 bg-[#001540] border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-8">
          <div className="mb-6 md:mb-0">
            <p className="text-[#999999] text-xs font-medium uppercase tracking-widest">@2026 KURO</p>
          </div>
          <div className="flex gap-8">
            <button onClick={onTerms} className="text-[#999999] hover:text-[#0050C0] text-xs font-medium uppercase tracking-widest transition-colors">Terms of Service</button>
            <button onClick={onPrivacy} className="text-[#999999] hover:text-[#0050C0] text-xs font-medium uppercase tracking-widest transition-colors">Privacy Policy</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

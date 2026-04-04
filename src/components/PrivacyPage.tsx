// PrivacyPage.tsx — CONTROLSAI Privacy Policy (2026)
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Database, Lock, AlertTriangle } from 'lucide-react';

interface Props { onBack: () => void; }

export default function PrivacyPage({ onBack }: Props) {
  return (
    <div className="min-h-screen bg-[#001540] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="fixed inset-0 pointer-events-none grid-moving opacity-30" />

      {/* Nav */}
      <header className="sticky top-0 bg-[#001540]/90 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center gap-4 z-10">
        <button onClick={onBack} className="flex items-center gap-2 text-[#999999] hover:text-white transition-colors text-sm">
          <ArrowLeft size={16} /> Back
        </button>
        <span className="text-[10px] text-[#999999] uppercase tracking-widest">CONTROLSAI · Legal Documents</span>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-3xl mx-auto px-6 py-16"
      >
        <div className="mb-10">
          <h1 className="text-5xl font-industrial uppercase tracking-tighter mb-3">Privacy Policy</h1>
          <p className="text-[#999999] text-sm">Effective: 1 January 2026 · Last updated: 1 April 2026</p>
        </div>

        {[
          {
            icon: Database,
            title: 'What We Store',
            body: `CONTROLSAI stores all session data — including your queries, AI responses, session titles, and conversation history — locally in your browser's IndexedDB database. Nothing is transmitted to our servers. Your engineering logic, proprietary process descriptions, and PLC configurations never leave your machine. When you clear your browser data, all CONTROLSAI sessions are permanently deleted.`,
          },
          {
            icon: Shield,
            title: 'What We Do Not Collect',
            body: `We do not collect, transmit, or store: personally identifiable information (PII), IP addresses, usage telemetry, or any content of your conversations. The CONTROLSAI backend receives your query text solely to generate a response; this text is not logged or persisted on any server.`,
          },
          {
            icon: Lock,
            title: 'Authentication',
            body: `If you choose to create an account (email/password or Google Sign-In), your authentication credentials are managed by Firebase Authentication (Google). We receive a session token only. We do not store passwords. Account creation is optional — the full CONTROLSAI feature set is available without signing in.`,
          },
          {
            icon: AlertTriangle,
            title: 'AI Output Disclaimer',
            body: `CONTROLSAI uses a large language model (LLM) to generate Structured Control Language (SCL) code and answer engineering questions. AI-generated outputs are for reference and learning purposes only. Generated code must be reviewed, tested, and validated by a qualified automation engineer before deployment to any industrial system. CONTROLSAI Ltd. accepts no liability for damages arising from use of AI-generated logic in production environments.`,
          },
          {
            icon: Shield,
            title: 'Third-Party Services',
            body: `CONTROLSAI uses the following third-party services: Groq API (LLM inference — only your query text is sent); Google Fonts (typography assets, no user data sent); Firebase Authentication (optional, for account management only). We do not use advertising networks, tracking pixels, or analytics SDKs.`,
          },
          {
            icon: Database,
            title: 'Your Rights',
            body: `You can delete all your local data at any time by clearing your browser's IndexedDB for controlsai.io, or by using the "Clear All Sessions" option within the application. If you have an account, you may request account deletion by emailing privacy@controlsai.io.`,
          },
          {
            icon: Lock,
            title: 'Contact',
            body: `For privacy-related inquiries: privacy@controlsai.io\nCONTROLSAI Industrial Systems, 2026.\nRegistered in England & Wales.`,
          },
        ].map(({ icon: Icon, title, body }) => (
          <section key={title} className="mb-10 pb-10 border-b border-white/10 last:border-0">
            <div className="flex items-center gap-3 mb-4">
              <Icon size={20} className="text-[#0050C0] shrink-0" />
              <h2 className="text-xl font-headline font-bold">{title}</h2>
            </div>
            <p className="text-[#C8D8F0] text-sm leading-relaxed whitespace-pre-line">{body}</p>
          </section>
        ))}
      </motion.main>
    </div>
  );
}

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
            body: `CONTROLSAI stores all session data — including your queries, AI responses, session titles, and conversation history — securely in Google Firebase Firestore. Your engineering logic, proprietary process descriptions, and PLC configurations are strictly isolated under your personal user account. Based on mandatory Firestore Security Rules, no other users or unauthorized parties can read your session history.`,
          },
          {
            icon: Shield,
            title: 'Telemetry & Data Usage',
            body: `We do not collect, transmit, or store: personally identifiable information (PII) beyond your Google account email, advertising telemetry, or IP logs. The CONTROLSAI backend securely transmits your query text to our LLM inference engine solely to generate responses, after which it is stored in your private, isolated Firestore session history.`,
          },
          {
            icon: Lock,
            title: 'Authentication & Access',
            body: `Access to CONTROLSAI is strictly governed by a zero-trust Domain Whitelist. Authentication credentials are managed securely by Firebase Authentication (Google Sign-In). We do not store passwords. After signing in, your account is placed in a lockdown state and must be explicitly approved by a Domain Administrator before you gain access to the terminal.`,
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
            body: `You maintain complete ownership of your session data. You can delete all your session history at any time by using the "Clear All Sessions" option within the application, which permanently purges the data from our Firestore database. You may request full account and data deletion by emailing privacy@controlsai.io.`,
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

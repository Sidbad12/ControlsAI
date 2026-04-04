// TermsPage.tsx — CONTROLSAI Terms of Service (2026)
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, AlertTriangle, CheckCircle, Scale } from 'lucide-react';

interface Props { onBack: () => void; }

export default function TermsPage({ onBack }: Props) {
  return (
    <div className="min-h-screen bg-[#001540] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="fixed inset-0 pointer-events-none grid-moving opacity-30" />

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
          <h1 className="text-5xl font-industrial uppercase tracking-tighter mb-3">Terms of Service</h1>
          <p className="text-[#999999] text-sm">Effective: 1 January 2026 · Last updated: 1 April 2026</p>
        </div>

        {[
          {
            icon: FileText,
            title: '1. Acceptance of Terms',
            body: `By accessing or using CONTROLSAI ("the Service"), you agree to these Terms of Service. If you are using CONTROLSAI on behalf of an organisation, you represent that you have authority to bind that organisation to these terms. These terms apply in addition to any separate agreement your organisation has with CONTROLSAI Industrial Systems Ltd.`,
          },
          {
            icon: CheckCircle,
            title: '2. What CONTROLSAI Provides',
            body: `CONTROLSAI is an AI-assisted engineering tool that provides:\n
• Retrieval-Augmented Q&A over Siemens S7-1200 programming manuals\n
• Automated conversion of process flowcharts (Mermaid syntax) to Structured Control Language (SCL) Function Blocks\n
• Safety flag detection for common PLC logic errors\n
• Version-specific guidance for TIA Portal V17, V18, and V19\n
• Locally-stored, persistent session memory\n\n
CONTROLSAI is an assistive tool only. All outputs are AI-generated and require validation by a qualified engineer before use.`,
          },
          {
            icon: AlertTriangle,
            title: '3. Critical Safety Notice',
            body: `CONTROLSAI OUTPUTS ARE NOT CERTIFIED FOR DIRECT DEPLOYMENT IN SAFETY-CRITICAL SYSTEMS.\n\nAI-generated SCL code, safety recommendations, and fault diagnoses are reference materials only. You must:\n
• Review all generated code with a qualified automation engineer\n
• Test all logic in a simulation environment (e.g. PLCSIM) before hardware deployment\n
• Ensure compliance with IEC 61131-3, IEC 61511, and relevant local regulations\n
• Never use AI-generated interlocks as the sole safety mechanism in SIL-rated systems\n\nCONTROLSAI Ltd. accepts no liability for plant damage, personal injury, or equipment failure resulting from the use of AI-generated content.`,
          },
          {
            icon: Scale,
            title: '4. Intellectual Property',
            body: `You retain full ownership of all content you input into CONTROLSAI, including process descriptions, flowcharts, and queries. You retain ownership of all SCL code generated using your inputs.\n\nThe CONTROLSAI platform, design system, and underlying RAG pipeline are proprietary to CONTROLSAI Industrial Systems Ltd. You may not reverse-engineer, copy, or redistribute the platform or its components.`,
          },
          {
            icon: CheckCircle,
            title: '5. Acceptable Use',
            body: `You agree not to use CONTROLSAI to:\n
• Attempt to extract or reverse-engineer the underlying Siemens documentation database\n
• Input content that constitutes trade secrets of third parties without authorisation\n
• Circumvent any rate limiting or access controls\n
• Use the service for any purpose that violates applicable law\n\nAbuse of the service may result in account suspension.`,
          },
          {
            icon: FileText,
            title: '6. Service Availability',
            body: `CONTROLSAI is provided "as is." We make no guarantee of uptime, response accuracy, or availability. The AI inference layer is subject to the availability of third-party providers (Groq). We reserve the right to modify or discontinue the service at any time with reasonable notice.`,
          },
          {
            icon: Scale,
            title: '7. Governing Law',
            body: `These terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.\n\nFor legal inquiries: legal@controlsai.io\nCONTROLSAI Industrial Systems Ltd., London, UK, 2026.`,
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

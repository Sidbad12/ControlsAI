import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { motion } from 'framer-motion';

interface Props {
  pdfUrl: string;
  initialPage: number;
  onClose: () => void;
}

export default function PdfViewerModal({ pdfUrl, initialPage, onClose }: Props) {
  // Memoize the plugin instance to prevent infinite re-render loops in React 18 Strict Mode
  const defaultLayoutPluginInstance = React.useMemo(() => defaultLayoutPlugin(), []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-[#001030]/85 flex flex-col items-center p-5"
    >
      <div className="w-full max-w-[1200px] flex justify-end mb-3">
        <button
          onClick={onClose}
          className="bg-white/10 text-white border border-white/20 px-4 py-2 rounded-lg cursor-pointer font-body font-medium text-sm flex items-center gap-1.5 hover:bg-white/20 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">close</span> Close PDF
        </button>
      </div>

      <div className="w-full max-w-[1200px] flex-1 bg-white rounded-xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
        {/* Using pdfjs-dist 3.4.120 standard worker */}
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          <Viewer
            fileUrl={pdfUrl}
            plugins={[defaultLayoutPluginInstance]}
            initialPage={initialPage}
          />
        </Worker>
      </div>
    </motion.div>
  );
}

import { Instagram, FileText } from "lucide-react";
import { businessConfig } from "../config/business";

export function Footer({ onDownloadPdf }) {
  const { social } = businessConfig;

  return (
    <footer className="px-6 pb-8 space-y-4">
      <a 
        href={social.instagram} 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-orange-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
      >
        <Instagram size={20} />
        <span>Наш Instagram</span>
      </a>

      <button 
        onClick={onDownloadPdf}
        className="w-full py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-neutral-300 font-medium flex items-center justify-center gap-2 active:scale-95 transition-transform hover:bg-neutral-700"
      >
        <FileText size={20} />
        <span>Скачать меню (PDF)</span>
      </button>
      
      <div className="text-center pt-4">
        <p className="text-xs text-neutral-500">© 2025 {businessConfig.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}

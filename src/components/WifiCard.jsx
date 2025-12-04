import { Wifi, Copy, Check } from "lucide-react";
import { useState } from "react";
import { businessConfig } from "../config/business";
import { motion } from "framer-motion";

export function WifiCard({ onCopy }) {
  const { theme, wifi } = businessConfig;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(wifi.password);
    setCopied(true);
    onCopy();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-2xl ${theme.cardBg} border ${theme.border} shadow-lg mb-8 relative overflow-hidden`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${theme.accent} bg-opacity-20 text-amber-500`}>
            <Wifi size={20} />
          </div>
          <div>
            <p className="text-xs text-neutral-400 font-medium">Wi-Fi Guest</p>
            <p className={`font-bold ${theme.text}`}>{wifi.network}</p>
          </div>
        </div>
        
        <button 
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-700/50 hover:bg-neutral-700 transition-colors border border-neutral-600"
        >
          <span className="text-sm font-mono text-neutral-300">{wifi.password}</span>
          {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-neutral-400" />}
        </button>
      </div>
    </motion.div>
  );
}

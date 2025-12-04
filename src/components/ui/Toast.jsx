import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

export function Toast({ message, isVisible, onClose, type = "success" }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-full bg-neutral-800/90 backdrop-blur-md border border-neutral-700 shadow-2xl text-white"
        >
          {type === "success" ? (
            <CheckCircle size={20} className="text-green-500" />
          ) : (
            <XCircle size={20} className="text-red-500" />
          )}
          <span className="font-medium text-sm">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

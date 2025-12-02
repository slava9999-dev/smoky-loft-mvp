import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { businessConfig } from "../config/business";

export function ServiceCard({ service, onAdd }) {
  const { theme } = businessConfig;
  
  return (
    <motion.div 
      whileTap={{ scale: 0.98 }}
      className={`${theme.cardBg} rounded-xl overflow-hidden shadow-lg border ${theme.border} relative`}
    >
      <div className="h-32 w-full overflow-hidden">
        <img 
          src={service.image} 
          alt={service.title} 
          className="w-full h-full object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className={`font-bold text-lg ${theme.text}`}>{service.title}</h3>
          <span className={`font-medium ${theme.accent} text-white px-2 py-0.5 rounded text-sm`}>
            {service.price} {businessConfig.currency}
          </span>
        </div>
        <p className="text-neutral-400 text-sm mb-4 line-clamp-2">
          {service.description}
        </p>
        <button 
          onClick={() => onAdd(service)}
          className={`w-full py-2 rounded-lg font-medium flex items-center justify-center gap-2 bg-neutral-700 text-white hover:bg-neutral-600 transition-colors`}
        >
          <Plus size={18} />
          Добавить
        </button>
      </div>
    </motion.div>
  );
}

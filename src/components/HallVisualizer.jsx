import { motion } from 'framer-motion';
import { businessConfig } from '../config/business';
import { Armchair, Sofa, Crown, GlassWater } from 'lucide-react';

export function HallVisualizer({ selectedTableId, onSelectTable }) {
  const { hall, theme } = businessConfig;

  const getTableIcon = (type) => {
    switch (type) {
      case 'vip': return <Crown size={24} />;
      case 'sofa': return <Sofa size={24} />;
      case 'bar': return <GlassWater size={20} />;
      default: return <Armchair size={24} />;
    }
  };

  return (
    <div className="relative w-full aspect-[4/3] bg-neutral-800/50 rounded-xl border border-neutral-700 overflow-hidden mb-6">
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #f59e0b 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
      />
      
      {/* Entry/Exit (Visual only) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 px-4 py-1 bg-neutral-900 border-t border-x border-neutral-700 rounded-t-lg text-[10px] text-neutral-500 uppercase tracking-widest">
        Вход
      </div>

      {hall.tables.map((table) => {
        const isSelected = selectedTableId === table.id;
        
        return (
          <motion.button
            key={table.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", delay: table.id * 0.1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectTable(table.id)}
            style={{ 
              left: `${table.x}%`, 
              top: `${table.y}%` 
            }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-1 transition-colors z-10
              ${isSelected ? 'text-amber-400 z-20' : 'text-neutral-400 hover:text-neutral-200'}
            `}
          >
            <div className={`
              relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all shadow-lg
              ${isSelected 
                ? 'bg-amber-900/40 border-amber-500 shadow-amber-900/20' 
                : 'bg-neutral-900 border-neutral-600 shadow-black/40'
              }
            `}>
              {getTableIcon(table.type)}
              {isSelected && (
                <motion.div 
                  layoutId="selection-ring"
                  className="absolute inset-0 rounded-full border-2 border-amber-400 opacity-50"
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1.4, opacity: [0, 0.5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
              )}
            </div>
            
            <div className={`
              text-xs font-bold px-2 py-0.5 rounded-full backdrop-blur-md transition-colors
              ${isSelected ? 'bg-amber-500 text-black' : 'bg-neutral-900/80 text-neutral-400'}
            `}>
              {table.label}
            </div>
            
            <span className="text-[10px] opacity-60 font-mono tracking-tighter">
              {table.seats} чел
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

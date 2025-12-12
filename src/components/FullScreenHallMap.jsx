import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ZoomIn, ZoomOut, Crown, Sofa, Armchair, Wine, 
  Users, Sparkles, MapPin, RotateCcw
} from 'lucide-react';
import { businessConfig } from '../config/business';

// =============================================================================
// 🗺️ ПОЛНОЭКРАННАЯ/ВСТРАИВАЕМАЯ КРАСИВАЯ СХЕМА ЗАЛА
// =============================================================================
export function FullScreenHallMap({ 
  isOpen, 
  onClose, 
  tables, 
  selectedTableId, 
  bookedTableIds = [],
  onSelectTable,
  embedded = false // Новый prop для встраивания
}) {
  const [zoom, setZoom] = useState(1);
  const [selectedInfo, setSelectedInfo] = useState(null);

  const { hall } = businessConfig;

  // Типы столов с настройками
  const tableTypes = {
    vip: { 
      icon: Crown, 
      color: 'amber',
      gradient: 'from-amber-600 to-yellow-500',
      size: { w: embedded ? 110 : 90, h: embedded ? 70 : 55 },
      label: 'VIP Lounge'
    },
    sofa: { 
      icon: Sofa, 
      color: 'orange',
      gradient: 'from-orange-600 to-orange-500',
      size: { w: embedded ? 90 : 70, h: embedded ? 55 : 45 },
      label: 'Диван'
    },
    window: { 
      icon: Armchair, 
      color: 'emerald',
      gradient: 'from-emerald-600 to-emerald-500',
      size: { w: embedded ? 70 : 55, h: embedded ? 70 : 55 },
      label: 'У окна'
    },
    bar: { 
      icon: Wine, 
      color: 'rose',
      gradient: 'from-rose-600 to-pink-500',
      size: { w: embedded ? 45 : 35, h: embedded ? 75 : 60 },
      label: 'Бар'
    },
  };

  const getTableStatus = (tableId) => {
    if (bookedTableIds.includes(tableId)) return 'booked';
    if (selectedTableId === tableId) return 'selected';
    return 'free';
  };

  const handleTableClick = (table) => {
    if (bookedTableIds.includes(table.id)) {
      setSelectedInfo({ ...table, status: 'booked' });
      return;
    }
    onSelectTable(table.id);
    setSelectedInfo({ ...table, status: 'selected' });
  };

  if (!isOpen) return null;

  // Контейнер: fixed для мобильных, relative для embedded
  const containerClass = embedded 
    ? "relative w-full h-[500px] rounded-2xl overflow-hidden"
    : "fixed inset-0 z-[100]";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`${containerClass} bg-black`}
      >
        {/* Фон с градиентом */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 30% 20%, rgba(180, 120, 60, 0.15) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 80%, rgba(255, 100, 50, 0.1) 0%, transparent 40%),
              linear-gradient(180deg, #0f0d0b 0%, #1a1614 40%, #0d0b09 100%)
            `
          }}
        />

        {/* Header - только для мобильного fullscreen */}
        {!embedded && (
          <div className="absolute top-0 left-0 right-0 z-20 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <MapPin size={20} className="text-amber-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Схема зала</h2>
                <p className="text-xs text-neutral-400">Нажмите на столик для выбора</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-3 rounded-xl bg-neutral-800/80 backdrop-blur-sm border border-neutral-700 text-white"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Zoom Controls */}
        <div className="absolute bottom-24 right-4 z-20 flex flex-col gap-2">
          <button
            onClick={() => setZoom(Math.min(zoom + 0.2, 2))}
            className="p-3 rounded-xl bg-neutral-800/80 backdrop-blur-sm border border-neutral-700 text-white"
          >
            <ZoomIn size={18} />
          </button>
          <button
            onClick={() => setZoom(Math.max(zoom - 0.2, 0.6))}
            className="p-3 rounded-xl bg-neutral-800/80 backdrop-blur-sm border border-neutral-700 text-white"
          >
            <ZoomOut size={18} />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="p-3 rounded-xl bg-neutral-800/80 backdrop-blur-sm border border-neutral-700 text-neutral-400"
          >
            <RotateCcw size={18} />
          </button>
        </div>

        {/* Main Hall Map */}
        <div className={`absolute inset-0 ${embedded ? 'pt-4 pb-20 px-4' : 'pt-20 pb-32 px-4'} overflow-auto`}>
          <motion.div
            className="relative w-full h-full flex items-center justify-center"
            style={{ 
              transform: `scale(${zoom})`,
              transformOrigin: 'center center',
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Пол зала */}
            <div 
              className="relative rounded-3xl overflow-hidden border border-amber-900/30"
              style={{
                width: embedded ? '600px' : '100%',
                maxWidth: embedded ? '600px' : '400px',
                aspectRatio: embedded ? '4/3' : '3/4',
                background: `
                  repeating-linear-gradient(
                    90deg,
                    rgba(139, 90, 43, 0.03) 0px,
                    rgba(100, 60, 30, 0.05) 30px,
                    rgba(139, 90, 43, 0.03) 60px
                  ),
                  linear-gradient(180deg, rgba(30, 25, 20, 0.9) 0%, rgba(20, 17, 14, 0.95) 100%)
                `,
                boxShadow: 'inset 0 0 100px rgba(0,0,0,0.5), 0 0 60px rgba(180, 130, 80, 0.1)',
              }}
            >
              {/* Стены */}
              <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-neutral-900 to-transparent">
                <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-amber-600/40 to-transparent" />
              </div>

              {/* Барная зона справа */}
              <div 
                className="absolute right-2 top-[15%] bottom-[25%] w-10 rounded-2xl flex flex-col items-center justify-center gap-2"
                style={{
                  background: 'linear-gradient(180deg, rgba(180, 130, 80, 0.2) 0%, rgba(140, 100, 60, 0.15) 100%)',
                  border: '1px solid rgba(180, 130, 80, 0.3)',
                }}
              >
                <Wine size={14} className="text-amber-600/60" />
                <span 
                  className="text-[8px] text-amber-600/60 font-bold tracking-widest"
                  style={{ writingMode: 'vertical-rl' }}
                >
                  BAR
                </span>
              </div>

              {/* Столы */}
              {tables.map((table) => {
                const config = tableTypes[table.type] || tableTypes.window;
                const status = getTableStatus(table.id);
                const Icon = config.icon;
                const isBooked = status === 'booked';
                const isSelected = status === 'selected';

                return (
                  <motion.button
                    key={table.id}
                    className="absolute flex flex-col items-center justify-center rounded-xl transition-all"
                    style={{
                      left: `${table.x}%`,
                      top: `${table.y}%`,
                      width: config.size.w,
                      height: config.size.h,
                      transform: 'translate(-50%, -50%)',
                      background: isBooked 
                        ? 'linear-gradient(145deg, #4a1515 0%, #2d0f0f 100%)'
                        : isSelected
                          ? `linear-gradient(145deg, var(--tw-gradient-stops))`
                          : 'linear-gradient(145deg, #3d3530 0%, #2a2420 100%)',
                      border: `2px solid ${
                        isBooked ? '#991b1b' : isSelected ? '#fbbf24' : '#5a4a3a'
                      }`,
                      boxShadow: isSelected 
                        ? '0 0 30px rgba(251, 191, 36, 0.4), 0 4px 20px rgba(0,0,0,0.3)'
                        : '0 4px 15px rgba(0,0,0,0.3)',
                      opacity: isBooked ? 0.7 : 1,
                    }}
                    onClick={() => handleTableClick(table)}
                    whileTap={{ scale: 0.95 }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: table.id * 0.05 }}
                  >
                    {/* VIP Badge */}
                    {table.type === 'vip' && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full">
                        <span className="text-[7px] font-bold text-black">VIP</span>
                      </div>
                    )}

                    {/* Icon */}
                    <Icon 
                      size={table.type === 'vip' ? 22 : 18} 
                      className={
                        isBooked ? 'text-red-400/70' : 
                        isSelected ? 'text-white' : 
                        'text-neutral-400/80'
                      }
                    />

                    {/* Label */}
                    <span className={`text-[9px] font-bold mt-1 ${
                      isBooked ? 'text-red-400/70' : 
                      isSelected ? 'text-white' : 
                      'text-neutral-400'
                    }`}>
                      {table.label.split(' ')[0]}
                    </span>

                    {/* Seats */}
                    <div className={`flex items-center gap-0.5 text-[8px] ${
                      isBooked ? 'text-red-400/60' : 'text-neutral-500'
                    }`}>
                      <Users size={8} />
                      <span>{table.seats}</span>
                    </div>

                    {/* Status indicator */}
                    <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center border-2 border-neutral-900 ${
                      isBooked ? 'bg-red-500' : 
                      isSelected ? 'bg-amber-500' : 
                      'bg-emerald-500'
                    }`}>
                      {isBooked && <X size={8} className="text-white" strokeWidth={3} />}
                      {isSelected && <Sparkles size={8} className="text-black" />}
                      {!isBooked && !isSelected && (
                        <motion.div 
                          className="w-1.5 h-1.5 bg-white rounded-full"
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}
                    </div>

                    {/* Selection ring */}
                    {isSelected && (
                      <motion.div
                        className="absolute inset-0 rounded-xl border-2 border-amber-400"
                        animate={{ scale: [1, 1.1, 1], opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                  </motion.button>
                );
              })}

              {/* Вход */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-3">
                <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
                <span className="text-[9px] text-neutral-500 font-bold tracking-[0.2em]">ВХОД</span>
                <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Panel - Selected Info */}
        <div className={`absolute bottom-0 left-0 right-0 z-20 ${embedded ? 'p-3' : 'p-4'} bg-gradient-to-t from-black via-black/95 to-transparent`}>
          {/* Legend */}
          <div className={`flex items-center justify-center gap-6 ${embedded ? '' : 'mb-4'}`}>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-neutral-400">Свободен</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-xs text-neutral-400">Выбран</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-xs text-neutral-400">Занят</span>
            </div>
          </div>

          {/* Confirm Button - только для мобильного fullscreen */}
          {!embedded && (
            <button
              onClick={onClose}
              disabled={!selectedTableId}
              className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
                selectedTableId 
                  ? 'bg-amber-600 hover:bg-amber-500 shadow-lg shadow-amber-900/30' 
                  : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
              }`}
            >
              {selectedTableId ? (
                <>
                  <Sparkles size={18} />
                  Подтвердить выбор
                </>
              ) : (
                'Выберите столик'
              )}
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

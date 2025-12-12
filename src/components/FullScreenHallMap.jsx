import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ZoomIn, ZoomOut, Crown, Sofa, Armchair, Wine, 
  Users, Sparkles, MapPin, RotateCcw, Clock, UserCheck
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
  bookings = [], // Информация о бронированиях с временем
  onSelectTable,
  embedded = false
}) {
  const [zoom, setZoom] = useState(1);
  const [selectedInfo, setSelectedInfo] = useState(null);

  // Функция получения брони для стола
  const getBookingForTable = (tableId) => {
    return bookings.find(b => b.tableId === tableId);
  };

  const { hall } = businessConfig;

  // Размеры для десктопа - широкая схема
  const isDesktopView = !embedded && typeof window !== 'undefined' && window.innerWidth >= 768;

  // Типы столов с настройками
  const getTableSize = (type) => {
    const sizes = {
      vip: { 
        mobile: { w: 90, h: 55 },
        desktop: { w: 140, h: 85 }
      },
      sofa: { 
        mobile: { w: 70, h: 45 },
        desktop: { w: 110, h: 70 }
      },
      window: { 
        mobile: { w: 55, h: 55 },
        desktop: { w: 85, h: 85 }
      },
      bar: { 
        mobile: { w: 35, h: 60 },
        desktop: { w: 55, h: 90 }
      },
    };
    return isDesktopView ? sizes[type]?.desktop : sizes[type]?.mobile || sizes.window.mobile;
  };

  const tableTypes = {
    vip: { 
      icon: Crown, 
      color: 'amber',
      gradient: 'from-amber-600 to-yellow-500',
      label: 'VIP Lounge'
    },
    sofa: { 
      icon: Sofa, 
      color: 'orange',
      gradient: 'from-orange-600 to-orange-500',
      label: 'Диван'
    },
    window: { 
      icon: Armchair, 
      color: 'emerald',
      gradient: 'from-emerald-600 to-emerald-500',
      label: 'У окна'
    },
    bar: { 
      icon: Wine, 
      color: 'rose',
      gradient: 'from-rose-600 to-pink-500',
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
        className={`${containerClass} bg-black overflow-hidden`}
      >
        {/* Premium Background с УСИЛЕННОЙ атмосферой */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 20% 30%, rgba(220, 150, 80, 0.35) 0%, transparent 40%),
              radial-gradient(ellipse at 80% 20%, rgba(255, 180, 80, 0.25) 0%, transparent 35%),
              radial-gradient(ellipse at 50% 80%, rgba(250, 140, 70, 0.20) 0%, transparent 50%),
              radial-gradient(ellipse at 10% 90%, rgba(200, 120, 60, 0.25) 0%, transparent 40%),
              radial-gradient(ellipse at 90% 70%, rgba(255, 160, 50, 0.15) 0%, transparent 45%),
              linear-gradient(180deg, #1a1210 0%, #251a14 30%, #2a1e18 60%, #1a1410 100%)
            `
          }}
        />

        {/* Усиленные частицы дыма - больше и ярче */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${120 + i * 60}px`,
                height: `${120 + i * 60}px`,
                left: `${5 + i * 9}%`,
                top: `${15 + (i % 4) * 22}%`,
                background: `radial-gradient(circle, rgba(255, 180, 100, 0.4) 0%, rgba(220, 150, 80, 0.2) 40%, transparent 70%)`,
                filter: 'blur(50px)',
              }}
              animate={{
                y: [0, -40, 0],
                x: [0, i % 2 === 0 ? 25 : -25, 0],
                scale: [1, 1.3, 1],
                opacity: [0.25, 0.45, 0.25],
              }}
              transition={{
                duration: 7 + i * 1.5,
                repeat: Infinity,
                delay: i * 0.4,
              }}
            />
          ))}
        </div>

        {/* Больше декоративных огоньков */}
        <div className="absolute top-10 left-10 w-6 h-6 rounded-full bg-amber-500/40 blur-md animate-pulse" />
        <div className="absolute top-20 right-20 w-5 h-5 rounded-full bg-orange-500/50 blur-md animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-40 left-20 w-7 h-7 rounded-full bg-amber-600/30 blur-lg animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 right-12 w-4 h-4 rounded-full bg-yellow-500/40 blur-sm animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-1/4 left-1/4 w-5 h-5 rounded-full bg-orange-600/35 blur-md animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Header - только для fullscreen */}
        {!embedded && (
          <div className="absolute top-0 left-0 right-0 z-20 p-4 md:p-6 flex items-center justify-between bg-gradient-to-b from-black/90 via-black/50 to-transparent">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/30 to-orange-600/20 flex items-center justify-center border border-amber-500/30 shadow-lg shadow-amber-900/20">
                <MapPin size={24} className="text-amber-400" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Smoky Loft</h2>
                <p className="text-sm text-amber-400/80">Выберите свой столик</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-3 md:p-4 rounded-xl bg-neutral-800/80 backdrop-blur-sm border border-neutral-700 text-white hover:bg-neutral-700 transition-colors"
            >
              <X size={22} />
            </button>
          </div>
        )}

        {/* Zoom Controls */}
        <div className={`absolute ${embedded ? 'bottom-24 right-4' : 'bottom-32 right-6'} z-20 flex flex-col gap-2`}>
          <button
            onClick={() => setZoom(Math.min(zoom + 0.2, 2))}
            className="p-3 rounded-xl bg-neutral-800/80 backdrop-blur-sm border border-neutral-700 text-white hover:bg-neutral-700 transition-colors"
          >
            <ZoomIn size={18} />
          </button>
          <button
            onClick={() => setZoom(Math.max(zoom - 0.2, 0.6))}
            className="p-3 rounded-xl bg-neutral-800/80 backdrop-blur-sm border border-neutral-700 text-white hover:bg-neutral-700 transition-colors"
          >
            <ZoomOut size={18} />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="p-3 rounded-xl bg-neutral-800/80 backdrop-blur-sm border border-neutral-700 text-neutral-400 hover:bg-neutral-700 transition-colors"
          >
            <RotateCcw size={18} />
          </button>
        </div>

        {/* Main Hall Map */}
        <div className={`absolute inset-0 ${embedded ? 'pt-4 pb-20 px-4' : 'pt-24 pb-28 px-4 md:px-10'} overflow-auto flex items-center justify-center`}>
          <motion.div
            className="relative w-full h-full flex items-center justify-center"
            style={{ 
              transform: `scale(${zoom})`,
              transformOrigin: 'center center',
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Пол зала - ШИРОКИЙ для десктопа */}
            <div 
              className="relative rounded-3xl overflow-hidden border-2 border-amber-800/40"
              style={{
                width: isDesktopView ? '95vw' : (embedded ? '600px' : '100%'),
                maxWidth: isDesktopView ? '1200px' : (embedded ? '600px' : '400px'),
                height: isDesktopView ? '70vh' : 'auto',
                maxHeight: isDesktopView ? '700px' : 'none',
                aspectRatio: isDesktopView ? 'auto' : (embedded ? '4/3' : '3/4'),
                background: `
                  repeating-linear-gradient(
                    90deg,
                    rgba(139, 90, 43, 0.04) 0px,
                    rgba(100, 60, 30, 0.06) 40px,
                    rgba(139, 90, 43, 0.04) 80px
                  ),
                  repeating-linear-gradient(
                    0deg,
                    rgba(80, 50, 25, 0.03) 0px,
                    rgba(60, 35, 20, 0.05) 40px,
                    rgba(80, 50, 25, 0.03) 80px
                  ),
                  linear-gradient(135deg, rgba(40, 30, 22, 0.95) 0%, rgba(25, 20, 15, 0.98) 50%, rgba(35, 28, 20, 0.95) 100%)
                `,
                boxShadow: 'inset 0 0 150px rgba(0,0,0,0.6), 0 0 80px rgba(180, 130, 80, 0.15)',
              }}
            >
              {/* Стены */}
              <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-neutral-900/90 to-transparent">
                <div className="absolute bottom-0 left-16 right-16 h-px bg-gradient-to-r from-transparent via-amber-600/50 to-transparent" />
                {/* Декоративные лампы */}
                {isDesktopView && (
                  <>
                    <motion.div 
                      className="absolute top-4 left-[20%] w-8 h-8 rounded-full bg-amber-500/30 blur-lg"
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <motion.div 
                      className="absolute top-4 left-[50%] w-10 h-10 rounded-full bg-orange-500/40 blur-lg"
                      animate={{ opacity: [0.4, 0.7, 0.4] }}
                      transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                    />
                    <motion.div 
                      className="absolute top-4 left-[80%] w-8 h-8 rounded-full bg-amber-500/30 blur-lg"
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
                    />
                  </>
                )}
              </div>

              {/* Неоновая надпись LOUNGE */}
              {isDesktopView && (
                <div className="absolute top-16 left-1/2 -translate-x-1/2">
                  <motion.div
                    className="text-3xl md:text-4xl font-bold tracking-[0.3em]"
                    style={{
                      color: '#fbbf24',
                      textShadow: '0 0 10px #fbbf24, 0 0 20px #f59e0b, 0 0 40px #d97706, 0 0 80px #b45309',
                    }}
                    animate={{ 
                      textShadow: [
                        '0 0 10px #fbbf24, 0 0 20px #f59e0b, 0 0 40px #d97706, 0 0 60px #b45309',
                        '0 0 15px #fbbf24, 0 0 30px #f59e0b, 0 0 50px #d97706, 0 0 80px #b45309',
                        '0 0 10px #fbbf24, 0 0 20px #f59e0b, 0 0 40px #d97706, 0 0 60px #b45309',
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    LOUNGE
                  </motion.div>
                </div>
              )}

              {/* Барная зона справа */}
              <div 
                className={`absolute right-4 ${isDesktopView ? 'top-[20%] bottom-[15%] w-16' : 'top-[15%] bottom-[25%] w-10'} rounded-2xl flex flex-col items-center justify-center gap-2`}
                style={{
                  background: 'linear-gradient(180deg, rgba(180, 130, 80, 0.25) 0%, rgba(140, 100, 60, 0.2) 100%)',
                  border: '1px solid rgba(180, 130, 80, 0.4)',
                  boxShadow: 'inset 0 0 30px rgba(0,0,0,0.3)',
                }}
              >
                <Wine size={isDesktopView ? 20 : 14} className="text-amber-500/70" />
                <span 
                  className={`${isDesktopView ? 'text-xs' : 'text-[8px]'} text-amber-500/70 font-bold tracking-widest`}
                  style={{ writingMode: 'vertical-rl' }}
                >
                  BAR
                </span>
              </div>

              {/* Столы */}
              {tables.map((table) => {
                const config = tableTypes[table.type] || tableTypes.window;
                const status = getTableStatus(table.id);
                const tableSize = getTableSize(table.type);
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
                      width: tableSize.w,
                      height: tableSize.h,
                      transform: 'translate(-50%, -50%)',
                      background: isBooked 
                        ? 'linear-gradient(145deg, #4a1515 0%, #2d0f0f 100%)'
                        : isSelected
                          ? `linear-gradient(145deg, #5a4520 0%, #3d3018 100%)`
                          : 'linear-gradient(145deg, #3d3530 0%, #2a2420 100%)',
                      border: `${isDesktopView ? '3px' : '2px'} solid ${
                        isBooked ? '#991b1b' : isSelected ? '#fbbf24' : '#5a4a3a'
                      }`,
                      boxShadow: isSelected 
                        ? '0 0 40px rgba(251, 191, 36, 0.5), 0 6px 25px rgba(0,0,0,0.4)'
                        : '0 4px 15px rgba(0,0,0,0.3)',
                      opacity: isBooked ? 0.7 : 1,
                    }}
                    onClick={() => handleTableClick(table)}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(251, 191, 36, 0.3)' }}
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
                      size={isDesktopView ? (table.type === 'vip' ? 32 : 26) : (table.type === 'vip' ? 22 : 18)} 
                      className={
                        isBooked ? 'text-red-400/70' : 
                        isSelected ? 'text-white' : 
                        'text-neutral-400/80'
                      }
                    />

                    {/* Label */}
                    <span className={`${isDesktopView ? 'text-sm' : 'text-[9px]'} font-bold mt-1 ${
                      isBooked ? 'text-red-400/70' : 
                      isSelected ? 'text-white' : 
                      'text-neutral-400'
                    }`}>
                      {table.label.split(' ')[0]}
                    </span>

                    {/* Seats или время брони */}
                    {isBooked ? (
                      // Время бронирования
                      (() => {
                        const booking = getBookingForTable(table.id);
                        return booking ? (
                          <div className={`flex items-center gap-1 ${isDesktopView ? 'text-xs' : 'text-[7px]'} text-red-400/80 bg-red-900/40 px-1.5 py-0.5 rounded-full`}>
                            <Clock size={isDesktopView ? 10 : 7} />
                            <span>{booking.time}</span>
                          </div>
                        ) : null;
                      })()
                    ) : (
                      <div className={`flex items-center gap-1 ${isDesktopView ? 'text-xs' : 'text-[8px]'} ${
                        isBooked ? 'text-red-400/60' : 'text-neutral-500'
                      }`}>
                        <Users size={isDesktopView ? 12 : 8} />
                        <span>{table.seats}</span>
                      </div>
                    )}

                    {/* Человечки для занятых столов */}
                    {isBooked && isDesktopView && (
                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-0.5">
                        {[...Array(Math.min(3, table.seats))].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                          >
                            <div 
                              className="w-5 h-5 rounded-full bg-red-900/60 border border-red-700/50 flex items-center justify-center"
                              style={{ marginLeft: i > 0 ? '-4px' : '0' }}
                            >
                              <UserCheck size={10} className="text-red-400" />
                            </div>
                          </motion.div>
                        ))}
                        {table.seats > 3 && (
                          <motion.div
                            className="w-5 h-5 rounded-full bg-red-900/80 border border-red-700/50 flex items-center justify-center text-[8px] text-red-300 font-bold"
                            style={{ marginLeft: '-4px' }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.8 }}
                          >
                            +{table.seats - 3}
                          </motion.div>
                        )}
                      </div>
                    )}

                    {/* Status indicator */}
                    <div className={`absolute ${isDesktopView ? '-top-2 -right-2 w-6 h-6' : '-top-1 -right-1 w-4 h-4'} rounded-full flex items-center justify-center border-2 border-neutral-900 ${
                      isBooked ? 'bg-red-500' : 
                      isSelected ? 'bg-amber-500' : 
                      'bg-emerald-500'
                    }`}>
                      {isBooked && <UserCheck size={isDesktopView ? 12 : 8} className="text-white" />}
                      {isSelected && <Sparkles size={isDesktopView ? 12 : 8} className="text-black" />}
                      {!isBooked && !isSelected && (
                        <motion.div 
                          className={`${isDesktopView ? 'w-2 h-2' : 'w-1.5 h-1.5'} bg-white rounded-full`}
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

        {/* Bottom Panel - Premium Design */}
        <div className={`absolute bottom-0 left-0 right-0 z-20 ${embedded ? 'p-3' : 'p-4 md:p-6'} bg-gradient-to-t from-black via-black/95 to-transparent`}>
          
          {/* Selected Table Info Card */}
          {selectedTableId && !embedded && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-amber-900/40 to-orange-900/30 border border-amber-500/30 backdrop-blur-sm"
            >
              {(() => {
                const selectedTable = tables.find(t => t.id === selectedTableId);
                if (!selectedTable) return null;
                const typeLabels = { vip: 'VIP Lounge', sofa: 'Диван', window: 'У окна', bar: 'Барная стойка' };
                const TypeIcon = { vip: Crown, sofa: Sofa, window: Armchair, bar: Wine }[selectedTable.type] || Armchair;
                
                return (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                        <TypeIcon size={28} className="text-amber-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{selectedTable.label}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm text-amber-400">{typeLabels[selectedTable.type]}</span>
                          <span className="text-neutral-500">•</span>
                          <span className="text-sm text-neutral-400 flex items-center gap-1">
                            <Users size={14} />
                            до {selectedTable.seats} гостей
                          </span>
                        </div>
                      </div>
                    </div>
                    {selectedTable.type === 'vip' && (
                      <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-xs font-bold">
                        PREMIUM
                      </div>
                    )}
                  </div>
                );
              })()}
            </motion.div>
          )}

          {/* Legend */}
          <div className={`flex items-center justify-center gap-4 md:gap-8 ${!embedded && selectedTableId ? '' : 'mb-4'}`}>
            <div className="flex items-center gap-2">
              <motion.div 
                className="w-3 h-3 rounded-full bg-emerald-500"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-xs md:text-sm text-neutral-400">Свободен</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500 shadow-lg shadow-amber-500/50" />
              <span className="text-xs md:text-sm text-neutral-400">Выбран</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-xs md:text-sm text-neutral-400">Занят</span>
            </div>
          </div>

          {/* Confirm Button - Premium */}
          {!embedded && (
            <motion.button
              onClick={onClose}
              disabled={!selectedTableId}
              className={`w-full mt-4 py-4 md:py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                selectedTableId 
                  ? 'bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 bg-[length:200%_100%] hover:bg-right text-white shadow-xl shadow-amber-900/40' 
                  : 'bg-neutral-800/80 text-neutral-500 cursor-not-allowed border border-neutral-700'
              }`}
              animate={selectedTableId ? { backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] } : {}}
              transition={{ duration: 3, repeat: Infinity }}
              whileHover={selectedTableId ? { scale: 1.02 } : {}}
              whileTap={selectedTableId ? { scale: 0.98 } : {}}
            >
              {selectedTableId ? (
                <>
                  <Sparkles size={22} className="animate-pulse" />
                  Забронировать столик
                </>
              ) : (
                <span className="flex items-center gap-2">
                  <motion.span
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    👆
                  </motion.span>
                  Выберите столик на схеме
                </span>
              )}
            </motion.button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

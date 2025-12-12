import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { businessConfig } from '../config/business';
import { getBookingsForDate } from '../services/bookingService';
import { Crown, Sofa, Armchair, Wine, Users, Clock, Calendar, X, Sparkles } from 'lucide-react';

export function HallVisualizer({ selectedTableId, onSelectTable, selectedDate }) {
  const { hall } = businessConfig;
  const [bookings, setBookings] = useState([]);
  const [hoveredTable, setHoveredTable] = useState(null);
  const containerRef = useRef(null);

  // Загружаем бронирования при изменении даты
  useEffect(() => {
    const dateBookings = getBookingsForDate(selectedDate || 'Сегодня');
    setBookings(dateBookings);
  }, [selectedDate]);

  // Проверяем, забронирован ли стол
  const isTableBooked = (tableId) => {
    return bookings.some(b => b.tableId === tableId);
  };

  // Получаем информацию о бронировании стола
  const getBookingInfo = (tableId) => {
    return bookings.find(b => b.tableId === tableId);
  };

  // Иконка по типу стола
  const getTableIcon = (type, size = 24) => {
    const icons = {
      vip: <Crown size={size} />,
      sofa: <Sofa size={size} />,
      bar: <Wine size={size} />,
      window: <Armchair size={size} />
    };
    return icons[type] || <Armchair size={size} />;
  };

  // Название типа стола
  const getTypeName = (type) => {
    const names = {
      vip: 'VIP Зона',
      sofa: 'Диванная зона',
      bar: 'Барная стойка',
      window: 'У окна'
    };
    return names[type] || 'Стандарт';
  };

  // Декоративные элементы зала
  const decorElements = [
    { type: 'plant', x: 5, y: 5, emoji: '🌿' },
    { type: 'plant', x: 95, y: 5, emoji: '🌴' },
    { type: 'plant', x: 5, y: 85, emoji: '🪴' },
    { type: 'lamp', x: 30, y: 5, emoji: '💡' },
    { type: 'lamp', x: 70, y: 5, emoji: '💡' },
    { type: 'hookah', x: 50, y: 30, emoji: '💨' },
  ];

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden mb-6 shadow-2xl border border-neutral-700/50"
      style={{
        background: `
          linear-gradient(135deg, #1a1614 0%, #2d2420 50%, #1a1614 100%)
        `
      }}
    >
      {/* Паркетный пол */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              90deg,
              transparent 0px,
              transparent 40px,
              rgba(139, 90, 43, 0.08) 40px,
              rgba(139, 90, 43, 0.08) 41px
            ),
            repeating-linear-gradient(
              0deg,
              transparent 0px,
              transparent 80px,
              rgba(139, 90, 43, 0.05) 80px,
              rgba(139, 90, 43, 0.05) 81px
            ),
            repeating-linear-gradient(
              90deg,
              rgba(101, 67, 33, 0.03) 0px,
              rgba(139, 90, 43, 0.05) 20px,
              rgba(101, 67, 33, 0.03) 40px
            )
          `
        }}
      />

      {/* Ambient освещение */}
      <div className="absolute top-0 left-1/3 w-48 h-48 bg-amber-500/8 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/3 w-56 h-56 bg-orange-500/6 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-600/5 rounded-full blur-3xl" />

      {/* Стены/границы */}
      <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-neutral-900 to-transparent" />
      <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-neutral-800/50 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-3 bg-gradient-to-l from-neutral-800/50 to-transparent" />

      {/* Декоративные элементы */}
      {decorElements.map((el, i) => (
        <div
          key={i}
          className="absolute opacity-30 text-lg pointer-events-none select-none"
          style={{ left: `${el.x}%`, top: `${el.y}%`, transform: 'translate(-50%, -50%)' }}
        >
          {el.emoji}
        </div>
      ))}

      {/* Барная зона справа */}
      <div className="absolute right-2 top-[15%] bottom-[25%] w-10 rounded-xl bg-gradient-to-b from-amber-900/40 via-amber-800/30 to-amber-900/40 border border-amber-700/30 flex flex-col items-center justify-center gap-1">
        <Wine size={14} className="text-amber-600/60" />
        <span className="text-[8px] text-amber-600/60 font-bold tracking-widest" style={{ writingMode: 'vertical-rl' }}>BAR</span>
      </div>

      {/* Заголовок зала */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-neutral-900/90 backdrop-blur-xl rounded-full border border-amber-900/30 shadow-lg">
        <Sparkles size={12} className="text-amber-500" />
        <span className="text-[10px] text-amber-400/80 font-bold tracking-widest uppercase">Smoky Loft</span>
        <Sparkles size={12} className="text-amber-500" />
      </div>

      {/* Столы */}
      {hall.tables.map((table) => {
        const isBooked = isTableBooked(table.id);
        const isSelected = selectedTableId === table.id;
        const booking = getBookingInfo(table.id);
        const isHovered = hoveredTable?.id === table.id;

        // Размеры стола по типу
        const getTableSize = () => {
          switch (table.type) {
            case 'vip': return 'w-20 h-20';
            case 'bar': return 'w-12 h-14';
            case 'sofa': return 'w-18 h-16';
            default: return 'w-14 h-14';
          }
        };

        return (
          <motion.button
            key={table.id}
            initial={{ scale: 0, opacity: 0, rotateY: -90 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 15, 
              delay: table.id * 0.1 
            }}
            whileHover={{ scale: isBooked ? 1.02 : 1.08, y: -3 }}
            whileTap={{ scale: isBooked ? 1 : 0.95 }}
            onClick={() => !isBooked && onSelectTable(table.id)}
            onMouseEnter={() => setHoveredTable(table)}
            onMouseLeave={() => setHoveredTable(null)}
            disabled={isBooked}
            style={{ 
              left: `${table.x}%`, 
              top: `${table.y}%` 
            }}
            className={`
              absolute -translate-x-1/2 -translate-y-1/2 
              flex flex-col items-center gap-1.5
              transition-all duration-300 z-10
              ${isBooked ? 'cursor-not-allowed' : 'cursor-pointer'}
              ${isSelected ? 'z-30' : isHovered ? 'z-20' : ''}
            `}
          >
            {/* Тень под столом */}
            <div 
              className={`
                absolute -bottom-2 left-1/2 -translate-x-1/2 
                w-16 h-4 rounded-full blur-md transition-all
                ${isSelected ? 'bg-amber-500/30' : 'bg-black/30'}
              `}
            />

            {/* Стол - 3D эффект */}
            <div className={`
              relative flex items-center justify-center 
              ${getTableSize()}
              rounded-2xl transition-all duration-300 
              ${isBooked 
                ? 'bg-gradient-to-br from-red-950 via-red-900 to-red-950 border-2 border-red-600/50 shadow-lg shadow-red-900/40' 
                : isSelected 
                  ? 'bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 border-2 border-amber-300 shadow-xl shadow-amber-500/50' 
                  : 'bg-gradient-to-br from-neutral-700 via-neutral-800 to-neutral-900 border-2 border-neutral-600 hover:border-amber-500/60 shadow-lg shadow-black/50'
              }
            `}>
              {/* Стеклянный блик */}
              <div className="absolute inset-1 rounded-xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              
              {/* Иконка */}
              <span className={`
                relative z-10 transition-all duration-300
                ${isBooked ? 'text-red-300' : isSelected ? 'text-white' : 'text-neutral-400'}
              `}>
                {getTableIcon(table.type)}
              </span>

              {/* Индикатор статуса */}
              <div className={`
                absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full 
                border-2 border-neutral-900 shadow-lg
                flex items-center justify-center
                ${isBooked ? 'bg-red-500' : 'bg-emerald-500'}
              `}>
                {isBooked ? (
                  <X size={10} className="text-white" strokeWidth={3} />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                )}
              </div>

              {/* Анимация выбора */}
              {isSelected && !isBooked && (
                <>
                  <motion.div 
                    className="absolute inset-0 rounded-2xl border-2 border-amber-300"
                    animate={{ 
                      scale: [1, 1.2, 1], 
                      opacity: [0.8, 0, 0.8] 
                    }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                  <motion.div 
                    className="absolute inset-0 rounded-2xl bg-amber-400/20"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  />
                </>
              )}
            </div>

            {/* Лейбл */}
            <div className={`
              px-3 py-1 rounded-lg text-[11px] font-bold tracking-wide transition-all duration-300 shadow-md
              ${isBooked 
                ? 'bg-red-900/80 text-red-200 border border-red-700/50' 
                : isSelected 
                  ? 'bg-amber-500 text-black border border-amber-400' 
                  : 'bg-neutral-900/90 text-neutral-300 border border-neutral-700'
              }
            `}>
              {table.label}
            </div>

            {/* Количество мест */}
            <div className={`
              flex items-center gap-1 text-[9px] font-medium px-2 py-0.5 rounded-full
              ${isBooked ? 'text-red-400/80 bg-red-950/50' : 'text-neutral-500 bg-neutral-900/50'}
            `}>
              <Users size={9} />
              <span>{table.seats} мест</span>
            </div>
          </motion.button>
        );
      })}

      {/* Тултип при наведении - позиционируется умно */}
      <AnimatePresence>
        {hoveredTable && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="fixed z-[100] pointer-events-none"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="bg-neutral-900/98 backdrop-blur-xl border border-neutral-600 rounded-2xl p-5 shadow-2xl min-w-[220px]">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-neutral-700">
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center shadow-inner
                  ${isTableBooked(hoveredTable.id) 
                    ? 'bg-gradient-to-br from-red-900 to-red-950 text-red-400' 
                    : 'bg-gradient-to-br from-amber-800 to-amber-900 text-amber-400'
                  }
                `}>
                  {getTableIcon(hoveredTable.type, 22)}
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">{hoveredTable.label}</h4>
                  <p className="text-xs text-neutral-500">{getTypeName(hoveredTable.type)}</p>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center">
                    <Users size={14} className="text-neutral-400" />
                  </div>
                  <span className="text-neutral-300">До <span className="text-white font-bold">{hoveredTable.seats}</span> человек</span>
                </div>

                {isTableBooked(hoveredTable.id) ? (
                  <>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-red-900/30 flex items-center justify-center">
                        <Calendar size={14} className="text-red-400" />
                      </div>
                      <span className="text-red-300 font-medium">{getBookingInfo(hoveredTable.id)?.date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-red-900/30 flex items-center justify-center">
                        <Clock size={14} className="text-red-400" />
                      </div>
                      <span className="text-red-300 font-medium">{getBookingInfo(hoveredTable.id)?.time}</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-neutral-700 flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-sm text-red-400 font-bold">Забронировано</span>
                    </div>
                  </>
                ) : (
                  <div className="mt-3 pt-3 border-t border-neutral-700 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-sm text-emerald-400 font-bold">Свободен — нажмите для выбора</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Вход */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-3 px-5 py-2 bg-neutral-900/90 backdrop-blur-xl rounded-full border border-neutral-700/50 shadow-lg">
        <div className="w-8 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent rounded-full" />
        <span className="text-[10px] text-neutral-400 font-bold tracking-widest uppercase">Вход</span>
        <div className="w-8 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent rounded-full" />
      </div>

      {/* Легенда */}
      <div className="absolute bottom-2 left-2 flex flex-col gap-1.5 px-3 py-2 bg-neutral-900/90 backdrop-blur-xl rounded-xl border border-neutral-700/50 text-[9px]">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow shadow-emerald-500/50" />
          <span className="text-neutral-400">Свободен</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow shadow-amber-500/50" />
          <span className="text-neutral-400">Выбран</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow shadow-red-500/50" />
          <span className="text-neutral-400">Занят</span>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { businessConfig } from '../config/business';
import { getBookingsForDate } from '../services/bookingService';
import { 
  Crown, Sofa, Armchair, Wine, Users, Clock, Calendar, X, Sparkles,
  Zap, Star, ChevronLeft, ChevronRight, Eye, Volume2, VolumeX
} from 'lucide-react';

// =============================================================================
// 🎨 ДИЗАЙН-ТОКЕНЫ ДЛЯ ИЗОМЕТРИЧЕСКОГО ЗАЛА
// =============================================================================
const HALL_DESIGN = {
  // Изометрия: 30° угол
  isoAngle: 30,
  perspective: 1000,
  
  // Цветовая схема
  colors: {
    floor: {
      base: '#1e1b17',
      wood: '#2d2620',
      accent: 'rgba(180, 120, 60, 0.08)',
    },
    walls: {
      main: '#151210',
      accent: '#1f1a15',
    },
    ambient: {
      warm: 'rgba(255, 180, 100, 0.15)',
      smoke: 'rgba(200, 180, 160, 0.06)',
      neon: 'rgba(255, 150, 50, 0.3)',
    },
    table: {
      free: {
        bg: 'linear-gradient(145deg, #3d3530 0%, #2a2420 50%, #1e1a16 100%)',
        border: '#5a4a3a',
        glow: 'rgba(100, 200, 100, 0.4)',
      },
      selected: {
        bg: 'linear-gradient(145deg, #d97706 0%, #b45309 50%, #92400e 100%)',
        border: '#fbbf24',
        glow: 'rgba(251, 191, 36, 0.6)',
      },
      booked: {
        bg: 'linear-gradient(145deg, #7f1d1d 0%, #5c1515 50%, #3f0f0f 100%)',
        border: '#dc2626',
        glow: 'rgba(220, 38, 38, 0.3)',
      },
    },
  },
};

// =============================================================================
// ✨ КОМПОНЕНТ ЧАСТИЦ ДЫМА
// =============================================================================
function SmokeParticles({ count = 20, intensity = 1 }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: 20 + Math.random() * 60,
      delay: Math.random() * 8,
      duration: 8 + Math.random() * 6,
      size: 30 + Math.random() * 60,
      opacity: 0.03 + Math.random() * 0.05 * intensity,
    }));
  }, [count, intensity]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            bottom: '-10%',
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, rgba(240, 230, 220, ${p.opacity}) 0%, transparent 70%)`,
            filter: 'blur(20px)',
          }}
          animate={{
            y: [0, -800],
            x: [0, Math.random() * 100 - 50],
            opacity: [0, p.opacity * 1.5, p.opacity, 0],
            scale: [0.5, 1, 1.5, 2],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

// =============================================================================
// 🌟 КОМПОНЕНТ ИСКР / СВЕЧЕНИЯ
// =============================================================================
function SparkleEffect({ active, x, y }) {
  if (!active) return null;
  
  const sparkles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    angle: (360 / 8) * i,
    distance: 30 + Math.random() * 20,
    delay: i * 0.05,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ left: x, top: y }}>
      {sparkles.map((s) => (
        <motion.div
          key={s.id}
          className="absolute w-2 h-2 bg-amber-400 rounded-full"
          style={{
            left: '50%',
            top: '50%',
            filter: 'blur(1px)',
            boxShadow: '0 0 10px 2px rgba(251, 191, 36, 0.8)',
          }}
          initial={{ 
            x: 0, 
            y: 0, 
            scale: 0, 
            opacity: 1 
          }}
          animate={{ 
            x: Math.cos(s.angle * Math.PI / 180) * s.distance,
            y: Math.sin(s.angle * Math.PI / 180) * s.distance,
            scale: [0, 1, 0],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 0.6,
            delay: s.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

// =============================================================================
// 🪑 3D МОДЕЛЬ СТОЛА
// =============================================================================
function Table3D({ 
  table, 
  isSelected, 
  isBooked, 
  isHovered, 
  onClick, 
  onHover,
  bookingInfo 
}) {
  const [showSparkle, setShowSparkle] = useState(false);
  
  // Определяем размеры и форму стола по типу
  const getTableConfig = () => {
    switch (table.type) {
      case 'vip':
        return { 
          width: 120, 
          height: 80, 
          shape: 'rounded-3xl',
          sofas: true,
          icon: Crown,
          premium: true,
        };
      case 'sofa':
        return { 
          width: 100, 
          height: 60, 
          shape: 'rounded-2xl',
          sofas: true,
          icon: Sofa,
        };
      case 'bar':
        return { 
          width: 50, 
          height: 80, 
          shape: 'rounded-xl',
          stools: true,
          icon: Wine,
        };
      default: // window
        return { 
          width: 70, 
          height: 70, 
          shape: 'rounded-xl',
          chairs: true,
          icon: Armchair,
        };
    }
  };

  const config = getTableConfig();
  const Icon = config.icon;
  
  // Цвета по статусу
  const status = isBooked ? 'booked' : isSelected ? 'selected' : 'free';
  const colors = HALL_DESIGN.colors.table[status];

  // Обработка клика с эффектом
  const handleClick = () => {
    if (isBooked) return;
    setShowSparkle(true);
    setTimeout(() => setShowSparkle(false), 600);
    onClick(table.id);
  };

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        left: `${table.x}%`,
        top: `${table.y}%`,
        width: config.width,
        height: config.height + 30, // +30 для 3D эффекта
        transform: 'translate(-50%, -50%)',
        zIndex: isHovered || isSelected ? 50 : 10,
      }}
      initial={{ scale: 0, rotateX: -30, opacity: 0 }}
      animate={{ 
        scale: 1, 
        rotateX: 0, 
        opacity: 1,
        y: isHovered && !isBooked ? -8 : 0,
      }}
      transition={{ 
        type: 'spring', 
        stiffness: 200, 
        damping: 20,
        delay: table.id * 0.08,
      }}
      whileHover={!isBooked ? { scale: 1.08 } : {}}
      onClick={handleClick}
      onMouseEnter={() => onHover(table)}
      onMouseLeave={() => onHover(null)}
    >
      {/* 3D Тень */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{
          width: config.width * 0.8,
          height: 15,
          background: isSelected 
            ? 'radial-gradient(ellipse, rgba(251, 191, 36, 0.3) 0%, transparent 70%)'
            : 'radial-gradient(ellipse, rgba(0,0,0,0.4) 0%, transparent 70%)',
          filter: 'blur(8px)',
        }}
        animate={{
          opacity: isHovered ? 0.8 : 0.5,
          scale: isHovered ? 1.2 : 1,
        }}
      />

      {/* 3D База стола (нижняя часть) */}
      <div
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 ${config.shape}`}
        style={{
          width: config.width,
          height: 8,
          background: 'linear-gradient(to bottom, #1a1612 0%, #0d0b09 100%)',
          transform: 'perspective(500px) rotateX(60deg)',
        }}
      />

      {/* Основная столешница */}
      <motion.div
        className={`absolute top-0 left-0 right-0 ${config.shape} overflow-hidden`}
        style={{
          height: config.height,
          background: colors.bg,
          border: `2px solid ${colors.border}`,
          boxShadow: `
            0 4px 20px rgba(0,0,0,0.4),
            0 0 30px ${colors.glow},
            inset 0 1px 1px rgba(255,255,255,0.1)
          `,
        }}
        animate={{
          boxShadow: isSelected 
            ? `0 4px 40px rgba(251, 191, 36, 0.5), 0 0 60px ${colors.glow}, inset 0 1px 1px rgba(255,255,255,0.2)`
            : `0 4px 20px rgba(0,0,0,0.4), 0 0 30px ${colors.glow}, inset 0 1px 1px rgba(255,255,255,0.1)`,
        }}
      >
        {/* Стеклянный отблеск */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)',
          }}
        />

        {/* VIP украшение */}
        {config.premium && (
          <motion.div
            className="absolute -top-1 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 rounded-full"
            animate={{ 
              background: [
                'linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b)',
                'linear-gradient(90deg, #fbbf24, #f59e0b, #fbbf24)',
                'linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-[8px] font-bold text-black tracking-widest">VIP</span>
          </motion.div>
        )}

        {/* Иконка типа */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon 
            size={config.premium ? 32 : 24} 
            className={`
              ${isBooked ? 'text-red-400/70' : isSelected ? 'text-white' : 'text-neutral-400/80'}
              drop-shadow-lg
            `}
          />
        </div>

        {/* Кальян на столе (для VIP и sofa) */}
        {(table.type === 'vip' || table.type === 'sofa') && !isBooked && (
          <motion.div
            className="absolute bottom-2 right-2 text-lg"
            animate={{ 
              opacity: [0.6, 0.8, 0.6],
              y: [0, -2, 0],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            💨
          </motion.div>
        )}
      </motion.div>

      {/* Лейбл стола */}
      <motion.div
        className={`
          absolute -bottom-6 left-1/2 -translate-x-1/2 
          px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider
          whitespace-nowrap shadow-lg backdrop-blur-sm
        `}
        style={{
          background: isBooked 
            ? 'linear-gradient(135deg, rgba(127, 29, 29, 0.9), rgba(92, 21, 21, 0.9))'
            : isSelected 
              ? 'linear-gradient(135deg, rgba(217, 119, 6, 0.95), rgba(180, 83, 9, 0.95))'
              : 'linear-gradient(135deg, rgba(30, 27, 23, 0.95), rgba(20, 18, 15, 0.95))',
          border: `1px solid ${isBooked ? '#dc2626' : isSelected ? '#fbbf24' : '#4a4035'}`,
          color: isBooked ? '#fca5a5' : isSelected ? '#fff' : '#a8a29e',
        }}
        animate={{
          y: isHovered ? 2 : 0,
        }}
      >
        {table.label}
      </motion.div>

      {/* Индикатор мест */}
      <div 
        className={`
          absolute -bottom-11 left-1/2 -translate-x-1/2
          flex items-center gap-1 text-[10px] font-medium
          px-2 py-0.5 rounded-full
          ${isBooked ? 'text-red-400/60 bg-red-950/30' : 'text-neutral-500 bg-neutral-900/50'}
        `}
      >
        <Users size={10} />
        <span>{table.seats}</span>
      </div>

      {/* Пульсация для свободного */}
      {!isBooked && !isSelected && (
        <motion.div
          className={`absolute inset-0 ${config.shape} border-2 border-emerald-500/40 pointer-events-none`}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.4, 0, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ top: 0, height: config.height }}
        />
      )}

      {/* Пульсация для выбранного */}
      {isSelected && (
        <>
          <motion.div
            className={`absolute inset-0 ${config.shape} border-2 border-amber-400 pointer-events-none`}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.8, 0, 0.8],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ top: 0, height: config.height }}
          />
          <motion.div
            className={`absolute inset-0 ${config.shape} bg-amber-500/10 pointer-events-none`}
            animate={{
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
            }}
            style={{ top: 0, height: config.height }}
          />
        </>
      )}

      {/* Эффект искр при выборе */}
      <SparkleEffect active={showSparkle} x="50%" y={config.height / 2} />

      {/* Статус занят - крестик */}
      {isBooked && (
        <motion.div
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center border-2 border-neutral-900 shadow-lg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.3 }}
        >
          <X size={12} className="text-white" strokeWidth={3} />
        </motion.div>
      )}

      {/* Статус свободен - точка */}
      {!isBooked && (
        <motion.div
          className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-neutral-900 shadow-lg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.3 }}
        >
          <motion.div 
            className="w-2 h-2 bg-white rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </motion.div>
      )}
    </motion.div>
  );
}

// =============================================================================
// 💡 ДЕКОР ЗАЛА
// =============================================================================
function HallDecor() {
  const decorItems = [
    // Растения
    { type: 'plant', x: 3, y: 8, emoji: '🌿', size: 'text-2xl', opacity: 0.4 },
    { type: 'plant', x: 97, y: 8, emoji: '🌴', size: 'text-xl', opacity: 0.3 },
    { type: 'plant', x: 3, y: 88, emoji: '🪴', size: 'text-xl', opacity: 0.35 },
    { type: 'plant', x: 97, y: 88, emoji: '🌿', size: 'text-lg', opacity: 0.3 },
    
    // Кальяны декоративные
    { type: 'hookah', x: 45, y: 15, emoji: '💨', size: 'text-3xl', opacity: 0.2, animate: true },
    { type: 'hookah', x: 55, y: 75, emoji: '💨', size: 'text-2xl', opacity: 0.15, animate: true },
    
    // Свечи / лампы
    { type: 'candle', x: 25, y: 5, emoji: '🕯️', size: 'text-sm', opacity: 0.4, glow: true },
    { type: 'candle', x: 75, y: 5, emoji: '🕯️', size: 'text-sm', opacity: 0.4, glow: true },
  ];

  return (
    <>
      {decorItems.map((item, i) => (
        <motion.div
          key={i}
          className={`absolute pointer-events-none select-none ${item.size}`}
          style={{ 
            left: `${item.x}%`, 
            top: `${item.y}%`,
            opacity: item.opacity,
            transform: 'translate(-50%, -50%)',
            filter: item.glow ? 'drop-shadow(0 0 10px rgba(255, 180, 100, 0.8))' : undefined,
          }}
          animate={item.animate ? {
            y: [0, -5, 0],
            opacity: [item.opacity, item.opacity * 1.2, item.opacity],
          } : {}}
          transition={item.animate ? {
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          } : {}}
        >
          {item.emoji}
        </motion.div>
      ))}
    </>
  );
}

// =============================================================================
// 📊 ТАЙМЛАЙН БРОНИРОВАНИЙ (МИНИ)
// =============================================================================
function BookingTimeline({ bookings, selectedTime }) {
  const times = ['14:00', '16:00', '18:00', '20:00', '22:00', '00:00'];
  
  const getBookingsAtTime = (time) => {
    return bookings.filter(b => b.time === time).length;
  };

  return (
    <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex items-end gap-1 px-3 py-2 bg-neutral-900/90 backdrop-blur-xl rounded-xl border border-neutral-700/50">
      {times.map((t) => {
        const count = getBookingsAtTime(t);
        const isSelected = t === selectedTime;
        const maxHeight = 24;
        const height = Math.max(4, (count / 3) * maxHeight);
        
        return (
          <div key={t} className="flex flex-col items-center gap-1">
            <motion.div
              className={`w-4 rounded-t-sm ${
                isSelected ? 'bg-amber-500' : count > 0 ? 'bg-red-500/60' : 'bg-emerald-500/40'
              }`}
              style={{ height }}
              initial={{ height: 0 }}
              animate={{ height }}
              transition={{ delay: 0.5, duration: 0.5 }}
            />
            <span className={`text-[8px] ${isSelected ? 'text-amber-400' : 'text-neutral-500'}`}>
              {t.split(':')[0]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// =============================================================================
// 🎯 ИНТЕЛЛЕКТУАЛЬНЫЙ ТУЛТИП
// =============================================================================
function SmartTooltip({ table, isBooked, bookingInfo, position }) {
  const getTypeName = (type) => {
    const names = {
      vip: 'VIP Зона',
      sofa: 'Диванная зона',
      bar: 'Барная стойка',
      window: 'У окна'
    };
    return names[type] || 'Стандарт';
  };

  const getTableIcon = (type) => {
    const icons = { vip: Crown, sofa: Sofa, bar: Wine, window: Armchair };
    const Icon = icons[type] || Armchair;
    return <Icon size={20} />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 5 }}
      className="fixed z-[200] pointer-events-none"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%)',
        marginTop: -20,
      }}
    >
      <div 
        className="bg-neutral-900/98 backdrop-blur-2xl border rounded-2xl p-4 shadow-2xl min-w-[220px]"
        style={{
          borderColor: isBooked ? 'rgba(220, 38, 38, 0.5)' : 'rgba(251, 191, 36, 0.3)',
          boxShadow: isBooked 
            ? '0 25px 50px -12px rgba(220, 38, 38, 0.25)' 
            : '0 25px 50px -12px rgba(251, 191, 36, 0.15)',
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-3 pb-2 border-b border-neutral-700/50">
          <div className={`
            w-10 h-10 rounded-xl flex items-center justify-center
            ${isBooked 
              ? 'bg-gradient-to-br from-red-900 to-red-950 text-red-400' 
              : 'bg-gradient-to-br from-amber-800 to-amber-900 text-amber-400'
            }
          `}>
            {getTableIcon(table.type)}
          </div>
          <div>
            <h4 className="font-bold text-white text-base">{table.label}</h4>
            <p className="text-xs text-neutral-500">{getTypeName(table.type)}</p>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Users size={14} className="text-neutral-500" />
            <span className="text-neutral-300">
              До <span className="text-white font-bold">{table.seats}</span> человек
            </span>
          </div>

          {isBooked && bookingInfo ? (
            <>
              <div className="flex items-center gap-2 text-sm">
                <Clock size={14} className="text-red-400" />
                <span className="text-red-300">{bookingInfo.time}</span>
              </div>
              <div className="mt-2 pt-2 border-t border-neutral-700/50 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-sm text-red-400 font-medium">Забронировано</span>
              </div>
            </>
          ) : (
            <div className="mt-2 pt-2 border-t border-neutral-700/50 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm text-emerald-400 font-medium">Свободен</span>
            </div>
          )}
        </div>

        {/* Стрелка */}
        <div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0"
          style={{
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderTop: `10px solid ${isBooked ? 'rgba(127, 29, 29, 0.95)' : 'rgba(30, 27, 23, 0.95)'}`,
          }}
        />
      </div>
    </motion.div>
  );
}

// =============================================================================
// 🏠 ГЛАВНЫЙ КОМПОНЕНТ - ВИЗУАЛИЗАТОР ЗАЛА 3D
// =============================================================================
export function HallVisualizer3D({ selectedTableId, onSelectTable, selectedDate, selectedTime }) {
  const { hall } = businessConfig;
  const [bookings, setBookings] = useState([]);
  const [hoveredTable, setHoveredTable] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showSmoke, setShowSmoke] = useState(true);
  const containerRef = useRef(null);

  // Загружаем бронирования
  useEffect(() => {
    const dateBookings = getBookingsForDate(selectedDate || 'Сегодня');
    setBookings(dateBookings);
  }, [selectedDate]);

  // Отслеживаем позицию мыши для тултипа
  const handleMouseMove = (e) => {
    if (hoveredTable) {
      setMousePosition({ x: e.clientX, y: e.clientY });
    }
  };

  // Проверка занятости
  const isTableBooked = (tableId) => {
    return bookings.some(b => b.tableId === tableId);
  };

  const getBookingInfo = (tableId) => {
    return bookings.find(b => b.tableId === tableId);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-[16/10] rounded-3xl overflow-hidden mb-6 shadow-2xl"
      onMouseMove={handleMouseMove}
      style={{
        background: `
          radial-gradient(ellipse at 50% 0%, rgba(255, 150, 50, 0.08) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 80%, rgba(255, 100, 50, 0.05) 0%, transparent 40%),
          radial-gradient(ellipse at 20% 70%, rgba(200, 150, 100, 0.04) 0%, transparent 40%),
          linear-gradient(180deg, #1a1614 0%, #151210 30%, #0d0b09 100%)
        `,
        border: '1px solid rgba(90, 74, 58, 0.3)',
      }}
    >
      {/* Паркетный пол с текстурой */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              90deg,
              transparent 0px,
              transparent 50px,
              rgba(139, 90, 43, 0.06) 50px,
              rgba(139, 90, 43, 0.06) 51px
            ),
            repeating-linear-gradient(
              0deg,
              transparent 0px,
              transparent 100px,
              rgba(139, 90, 43, 0.04) 100px,
              rgba(139, 90, 43, 0.04) 101px
            ),
            repeating-linear-gradient(
              90deg,
              rgba(80, 50, 30, 0.02) 0px,
              rgba(120, 80, 50, 0.04) 25px,
              rgba(80, 50, 30, 0.02) 50px
            )
          `,
        }}
      />

      {/* Ambient свечение */}
      <div className="absolute top-0 left-1/3 w-64 h-64 bg-amber-500/8 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-orange-600/5 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-700/3 rounded-full blur-[120px]" />

      {/* Анимированный дым */}
      {showSmoke && <SmokeParticles count={15} intensity={1.2} />}

      {/* Декор зала */}
      <HallDecor />

      {/* Стены с неоновым акцентом */}
      <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-neutral-950 via-neutral-900/80 to-transparent">
        <div className="absolute bottom-0 inset-x-10 h-px bg-gradient-to-r from-transparent via-amber-600/30 to-transparent" />
      </div>
      <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-neutral-900/60 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-neutral-900/60 to-transparent" />

      {/* Барная зона справа - более детальная */}
      <div 
        className="absolute right-3 top-[18%] bottom-[28%] w-12 rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, rgba(180, 130, 80, 0.15) 0%, rgba(140, 100, 60, 0.1) 50%, rgba(100, 70, 40, 0.15) 100%)',
          border: '1px solid rgba(180, 130, 80, 0.2)',
          boxShadow: 'inset 0 0 30px rgba(0,0,0,0.3), 0 0 20px rgba(180, 130, 80, 0.1)',
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <Wine size={16} className="text-amber-600/50" />
          <span 
            className="text-[9px] text-amber-600/60 font-bold tracking-[0.3em]" 
            style={{ writingMode: 'vertical-rl' }}
          >
            BAR
          </span>
        </div>
        {/* Полки */}
        <div className="absolute top-[20%] inset-x-1 h-px bg-amber-700/20" />
        <div className="absolute top-[40%] inset-x-1 h-px bg-amber-700/20" />
        <div className="absolute top-[60%] inset-x-1 h-px bg-amber-700/20" />
      </div>

      {/* Заголовок зала */}
      <motion.div 
        className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-3 px-5 py-2.5 rounded-full z-30"
        style={{
          background: 'linear-gradient(135deg, rgba(20, 18, 15, 0.95) 0%, rgba(30, 27, 23, 0.9) 100%)',
          border: '1px solid rgba(180, 130, 80, 0.25)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.4), 0 0 20px rgba(251, 191, 36, 0.1)',
        }}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Sparkles size={14} className="text-amber-500" />
        </motion.div>
        <span className="text-xs text-amber-400/90 font-bold tracking-[0.2em] uppercase">
          Smoky Loft — выберите столик
        </span>
        <motion.div
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Sparkles size={14} className="text-amber-500" />
        </motion.div>
      </motion.div>

      {/* Столы - 3D */}
      {hall.tables.map((table) => (
        <Table3D
          key={table.id}
          table={table}
          isSelected={selectedTableId === table.id}
          isBooked={isTableBooked(table.id)}
          isHovered={hoveredTable?.id === table.id}
          onClick={onSelectTable}
          onHover={setHoveredTable}
          bookingInfo={getBookingInfo(table.id)}
        />
      ))}

      {/* Интеллектуальный Тултип */}
      <AnimatePresence>
        {hoveredTable && (
          <SmartTooltip
            table={hoveredTable}
            isBooked={isTableBooked(hoveredTable.id)}
            bookingInfo={getBookingInfo(hoveredTable.id)}
            position={mousePosition}
          />
        )}
      </AnimatePresence>

      {/* Таймлайн бронирований (если передано время) */}
      {selectedTime && (
        <BookingTimeline bookings={bookings} selectedTime={selectedTime} />
      )}

      {/* Вход */}
      <motion.div 
        className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-2.5 rounded-full z-20"
        style={{
          background: 'linear-gradient(135deg, rgba(20, 18, 15, 0.95) 0%, rgba(30, 27, 23, 0.9) 100%)',
          border: '1px solid rgba(90, 74, 58, 0.3)',
        }}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="w-10 h-0.5 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent rounded-full" />
        <span className="text-[10px] text-neutral-400 font-bold tracking-[0.25em] uppercase">Вход</span>
        <div className="w-10 h-0.5 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent rounded-full" />
      </motion.div>

      {/* Легенда */}
      <motion.div 
        className="absolute bottom-3 left-3 flex flex-col gap-2 px-4 py-3 rounded-xl z-20"
        style={{
          background: 'linear-gradient(135deg, rgba(20, 18, 15, 0.95) 0%, rgba(30, 27, 23, 0.9) 100%)',
          border: '1px solid rgba(90, 74, 58, 0.3)',
        }}
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
          <span className="text-[10px] text-neutral-400 font-medium">Свободен</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500 shadow-lg shadow-amber-500/50" />
          <span className="text-[10px] text-neutral-400 font-medium">Выбран</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
          <span className="text-[10px] text-neutral-400 font-medium">Занят</span>
        </div>
      </motion.div>

      {/* Кнопка управления дымом */}
      <motion.button
        className="absolute bottom-3 right-3 p-2.5 rounded-xl z-20"
        style={{
          background: 'linear-gradient(135deg, rgba(20, 18, 15, 0.95) 0%, rgba(30, 27, 23, 0.9) 100%)',
          border: '1px solid rgba(90, 74, 58, 0.3)',
        }}
        onClick={() => setShowSmoke(!showSmoke)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {showSmoke ? (
          <Eye size={14} className="text-amber-400" />
        ) : (
          <Eye size={14} className="text-neutral-500" />
        )}
      </motion.button>
    </div>
  );
}

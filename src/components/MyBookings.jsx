import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Calendar, Clock, Users, Armchair, Crown, Wine, Sofa,
  Trash2, AlertTriangle, ChevronRight, Phone, User, MapPin
} from 'lucide-react';
import { businessConfig } from '../config/business';
import { getActiveBookings, cancelBooking, getBookingById } from '../services/bookingService';

// =============================================================================
// 📋 КОМПОНЕНТ "МОИ БРОНИРОВАНИЯ"
// =============================================================================
export function MyBookings({ isOpen, onClose, onCancelSuccess }) {
  const [bookings, setBookings] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { hall, theme } = businessConfig;

  // Загрузка бронирований
  useEffect(() => {
    if (isOpen) {
      const active = getActiveBookings();
      setBookings(active);
    }
  }, [isOpen]);

  // Получение инфо о столе
  const getTableInfo = (tableId) => {
    return hall.tables.find(t => t.id === tableId);
  };

  // Иконка типа стола
  const getTypeIcon = (type) => {
    const icons = { vip: Crown, sofa: Sofa, bar: Wine, window: Armchair };
    const Icon = icons[type] || Armchair;
    return <Icon size={18} className="text-amber-400" />;
  };

  // Обработка отмены
  const handleCancel = (bookingId) => {
    setIsDeleting(true);
    
    // Небольшая задержка для визуального эффекта
    setTimeout(() => {
      try {
        const success = cancelBooking(bookingId);
        
        if (success) {
          setBookings(prev => prev.filter(b => b.id !== bookingId));
          if (onCancelSuccess) onCancelSuccess();
        }
      } catch (error) {
        console.error('Ошибка отмены брони:', error);
      } finally {
        setIsDeleting(false);
        setConfirmDelete(null);
      }
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`w-full max-w-lg ${theme.cardBg} rounded-t-3xl sm:rounded-3xl border border-neutral-700 shadow-2xl flex flex-col max-h-[85vh]`}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-neutral-700">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Calendar size={20} className="text-amber-500" />
                Мои бронирования
              </h2>
              <p className="text-sm text-neutral-400 mt-1">
                {bookings.length > 0 
                  ? `Активных: ${bookings.length}` 
                  : 'Нет активных броней'}
              </p>
            </div>
            <button 
              onClick={onClose} 
              className="p-2.5 rounded-xl bg-neutral-700 hover:bg-neutral-600 transition-colors"
            >
              <X size={20} className="text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {bookings.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-neutral-800 flex items-center justify-center">
                  <Calendar size={32} className="text-neutral-600" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Пока пусто</h3>
                <p className="text-neutral-400 text-sm max-w-xs mx-auto">
                  У вас нет активных бронирований. Забронируйте столик, чтобы он появился здесь.
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking, index) => {
                  const tableInfo = getTableInfo(booking.tableId);
                  const isConfirming = confirmDelete === booking.id;

                  return (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`
                        relative p-4 rounded-2xl border-2 transition-all
                        ${isConfirming 
                          ? 'bg-red-950/30 border-red-500/50' 
                          : 'bg-neutral-800/50 border-neutral-700/50'}
                      `}
                    >
                      {/* Основная информация */}
                      <div className="flex items-start gap-4">
                        {/* Иконка типа */}
                        <div className={`
                          w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                          ${tableInfo?.type === 'vip' 
                            ? 'bg-gradient-to-br from-amber-800 to-amber-900' 
                            : 'bg-neutral-700/50'}
                        `}>
                          {getTypeIcon(tableInfo?.type)}
                        </div>

                        {/* Детали */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-white">
                              {tableInfo?.label || `Стол #${booking.tableId}`}
                            </h3>
                            {tableInfo?.type === 'vip' && (
                              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] font-bold rounded-full">
                                VIP
                              </span>
                            )}
                          </div>

                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2 text-neutral-300">
                              <Calendar size={14} className="text-amber-500" />
                              <span>{booking.date}</span>
                              <Clock size={14} className="text-amber-500 ml-2" />
                              <span>{booking.time}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-neutral-400">
                              <User size={14} />
                              <span className="truncate">{booking.name}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Кнопка отмены / Подтверждение */}
                      <div className="mt-4 pt-3 border-t border-neutral-700/50">
                        {!isConfirming ? (
                          <button
                            onClick={() => setConfirmDelete(booking.id)}
                            className="w-full py-2.5 px-4 rounded-xl bg-neutral-700/50 hover:bg-red-900/30 border border-transparent hover:border-red-500/30 text-neutral-400 hover:text-red-400 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                          >
                            <Trash2 size={16} />
                            Отменить бронь
                          </button>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-3"
                          >
                            <div className="flex items-center gap-2 text-red-400 text-sm">
                              <AlertTriangle size={16} />
                              <span>Точно отменить бронирование?</span>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setConfirmDelete(null)}
                                disabled={isDeleting}
                                className="flex-1 py-2.5 rounded-xl bg-neutral-700 text-white font-medium hover:bg-neutral-600 transition-colors"
                              >
                                Нет, оставить
                              </button>
                              <button
                                onClick={() => handleCancel(booking.id)}
                                disabled={isDeleting}
                                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-500 transition-colors flex items-center justify-center gap-2"
                              >
                                {isDeleting ? (
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                                  />
                                ) : (
                                  <>
                                    <Trash2 size={16} />
                                    Да, отменить
                                  </>
                                )}
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-neutral-700">
            <p className="text-xs text-neutral-500 text-center">
              Отмена бронирования возможна не позднее чем за 2 часа до визита
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Calendar, User, Armchair, Clock, ArrowLeft, ArrowRight, Sparkles, Users, Crown } from 'lucide-react';
import { businessConfig } from '../config/business';
import { HallVisualizer3D } from './HallVisualizer3D';
import { addBooking, seedDemoBookings, clearBookings } from '../services/bookingService';

export function BookingModal({ isOpen, onClose, cart, clearCart, onBookingSuccess }) {
  const [step, setStep] = useState(1);
  const [selectedTable, setSelectedTable] = useState(null);
  const [date, setDate] = useState('Сегодня');
  const [time, setTime] = useState('');
  const [contact, setContact] = useState({ name: '', phone: '' });
  
  const { theme, hall } = businessConfig;

  // Seed demo bookings on first load
  useEffect(() => {
    seedDemoBookings();
  }, []);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedTable(null);
      setDate('Сегодня');
      setTime('');
      setContact({ name: '', phone: '' });
    }
  }, [isOpen]);

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length === 0) return '';
    if (numbers.length > 11) return contact.phone;
    
    let formatted = '+7';
    if (numbers.length > 1) formatted += ' (' + numbers.substring(1, 4);
    if (numbers.length > 4) formatted += ') ' + numbers.substring(4, 7);
    if (numbers.length > 7) formatted += '-' + numbers.substring(7, 9);
    if (numbers.length > 9) formatted += '-' + numbers.substring(9, 11);
    
    return formatted;
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value;
    if (val.length < contact.phone.length) {
      setContact({ ...contact, phone: val });
      return;
    }
    setContact({ ...contact, phone: formatPhone(val) });
  };

  const dates = [
    { label: 'Сегодня', value: 'today' },
    { label: 'Завтра', value: 'tomorrow' },
    { label: 'Послезавтра', value: 'after_tomorrow' }
  ];

  const times = ['14:00', '16:00', '18:00', '20:00', '22:00', '00:00'];

  const handleBooking = () => {
    const tableInfo = hall.tables.find(t => t.id === selectedTable);
    
    // Сохраняем бронирование локально
    addBooking({
      tableId: selectedTable,
      date,
      time,
      name: contact.name,
      phone: contact.phone
    });
    
    const text = `
🔥 *Новая бронь: ${businessConfig.name}*

🪑 *Столик:* ${tableInfo?.label || 'Не выбран'} (${tableInfo?.type || ''})
👤 *Гость:* ${contact.name}
📱 *Телефон:* ${contact.phone}
📅 *Дата:* ${date}
⏰ *Время:* ${time}

🛒 *Заказ:*
${cart.map(i => `- ${i.title} (${i.price} ${businessConfig.currency})`).join('\n')}

💰 *Итого:* ${cart.reduce((a, b) => a + b.price, 0)} ${businessConfig.currency}
    `.trim();

    const url = `https://t.me/${businessConfig.telegramAdmin}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    if (onBookingSuccess) onBookingSuccess();
    clearCart();
    onClose();
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
          className={`w-full max-w-2xl ${theme.cardBg} rounded-t-3xl sm:rounded-3xl border border-neutral-700 shadow-2xl flex flex-col max-h-[90vh]`}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-neutral-700">
            <div>
              <h2 className={`text-xl font-bold ${theme.text}`}>
                {step === 1 && "Дата и время"}
                {step === 2 && "Выберите столик"}
                {step === 3 && "Контактные данные"}
              </h2>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3].map(i => (
                  <div 
                    key={i} 
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i < step 
                        ? 'w-10 bg-emerald-500' 
                        : i === step 
                          ? 'w-10 bg-amber-500' 
                          : 'w-3 bg-neutral-700'
                    }`} 
                  />
                ))}
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-2.5 rounded-xl bg-neutral-700 hover:bg-neutral-600 transition-colors"
            >
              <X size={20} className="text-white" />
            </button>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            {/* Step 1: Date & Time Selection */}
            {step === 1 && (
              <motion.div 
                initial={{ opacity: 0, x: 30 }} 
                animate={{ opacity: 1, x: 0 }} 
                className="space-y-8"
              >
                <div>
                  <label className="flex items-center gap-2 text-sm text-amber-400 font-bold mb-4 uppercase tracking-wider">
                    <Calendar size={16} /> Выберите день
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {dates.map(d => (
                      <button
                        key={d.value}
                        onClick={() => setDate(d.label)}
                        className={`px-4 py-4 rounded-xl text-sm font-bold border-2 transition-all ${
                          date === d.label 
                            ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-lg shadow-amber-900/20' 
                            : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:border-neutral-600'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm text-amber-400 font-bold mb-4 uppercase tracking-wider">
                    <Clock size={16} /> Выберите время
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {times.map(t => (
                      <button
                        key={t}
                        onClick={() => setTime(t)}
                        className={`px-3 py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                          time === t 
                            ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-lg shadow-amber-900/20' 
                            : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:border-neutral-600'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  disabled={!date || !time}
                  onClick={() => setStep(2)}
                  className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
                    date && time 
                      ? `${theme.accent} shadow-lg shadow-amber-900/30` 
                      : 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
                  }`}
                >
                  Далее — выбор столика
                  <ArrowRight size={18} />
                </button>
              </motion.div>
            )}

            {/* Step 2: Table Selection */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-neutral-400 text-sm">Выберите свободный столик:</p>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-900/30 rounded-lg border border-amber-700/50">
                    <Calendar size={14} className="text-amber-500" />
                    <span className="text-amber-400 text-sm font-medium">{date}, {time}</span>
                  </div>
                </div>
                
                <HallVisualizer3D 
                  selectedTableId={selectedTable} 
                  onSelectTable={setSelectedTable}
                  selectedDate={date}
                  selectedTime={time}
                />

                <div className="flex gap-3 mt-4">
                  <button 
                    onClick={() => setStep(1)} 
                    className="flex items-center gap-2 px-5 py-4 rounded-xl font-bold bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
                  >
                    <ArrowLeft size={18} />
                    Назад
                  </button>
                  <button
                    disabled={!selectedTable}
                    onClick={() => setStep(3)}
                    className={`flex-1 py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
                      selectedTable 
                        ? `${theme.accent} shadow-lg shadow-amber-900/30` 
                        : 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
                    }`}
                  >
                    Далее — контакты
                    <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Contact Information */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                {/* Summary Card - Premium Design */}
                {(() => {
                  const selectedTableInfo = hall.tables.find(t => t.id === selectedTable);
                  const zoneInfo = hall.zones?.[selectedTableInfo?.type];
                  const getTypeIcon = (type) => {
                    switch(type) {
                      case 'vip': return <Crown size={16} className="text-amber-400" />;
                      case 'sofa': return <Armchair size={16} className="text-amber-400" />;
                      case 'bar': return <Armchair size={16} className="text-amber-400" />;
                      default: return <Armchair size={16} className="text-amber-400" />;
                    }
                  };
                  return (
                    <div 
                      className="relative overflow-hidden rounded-2xl p-5"
                      style={{
                        background: 'linear-gradient(135deg, rgba(180, 120, 60, 0.15) 0%, rgba(100, 70, 40, 0.1) 50%, rgba(50, 35, 20, 0.15) 100%)',
                        border: '1px solid rgba(180, 130, 80, 0.3)',
                      }}
                    >
                      {/* Decorative gradient */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl" />
                      
                      <div className="relative">
                        <div className="flex items-center gap-2 mb-4">
                          <Sparkles size={14} className="text-amber-500" />
                          <h4 className="text-amber-400 text-xs font-bold uppercase tracking-wider">Ваш выбор</h4>
                        </div>
                        
                        <div className="space-y-3">
                          {/* Столик */}
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              {getTypeIcon(selectedTableInfo?.type)}
                              <span className="text-neutral-400 text-sm">Столик:</span>
                            </div>
                            <div className="text-right">
                              <span className="text-white font-bold">{selectedTableInfo?.label}</span>
                              {zoneInfo && (
                                <p className="text-[10px] text-neutral-500">{zoneInfo.description}</p>
                              )}
                            </div>
                          </div>
                          
                          {/* Мест */}
                          <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                              <Users size={16} className="text-amber-400" />
                              <span className="text-neutral-400">Мест:</span>
                            </div>
                            <span className="text-white font-bold">до {selectedTableInfo?.seats} человек</span>
                          </div>

                          {/* Дата */}
                          <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar size={16} className="text-amber-400" />
                              <span className="text-neutral-400">Дата и время:</span>
                            </div>
                            <span className="text-white font-bold">{date}, {time}</span>
                          </div>
                          
                          {/* Минимальный заказ */}
                          {selectedTableInfo?.minOrder && (
                            <div className="flex justify-between items-center text-sm pt-2 border-t border-amber-800/20">
                              <span className="text-neutral-500 text-xs">Мин. заказ на столик:</span>
                              <span className="text-neutral-400">{selectedTableInfo.minOrder} {businessConfig.currency}</span>
                            </div>
                          )}
                          
                          {/* Итого */}
                          <div className="flex justify-between items-center text-sm pt-3 border-t border-amber-800/30">
                            <span className="text-neutral-400 font-medium">Сумма заказа:</span>
                            <span className="text-amber-400 font-bold text-lg">{cart.reduce((a, b) => a + b.price, 0)} {businessConfig.currency}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Contact Form */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs text-neutral-400 ml-1 font-medium">Как вас зовут?</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                      <input
                        type="text"
                        placeholder="Имя"
                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-neutral-900 border-2 border-neutral-700 text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-500 transition-colors"
                        value={contact.name}
                        onChange={e => setContact({...contact, name: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs text-neutral-400 ml-1 font-medium">Номер телефона</label>
                    <input
                      type="tel"
                      placeholder="+7 (999) 000-00-00"
                      className="w-full px-4 py-4 rounded-xl bg-neutral-900 border-2 border-neutral-700 text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-500 transition-colors"
                      value={contact.phone}
                      onChange={handlePhoneChange}
                    />
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => setStep(2)} 
                    className="flex items-center gap-2 px-5 py-4 rounded-xl font-bold bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
                  >
                    <ArrowLeft size={18} />
                    Назад
                  </button>
                  <button
                    disabled={!contact.name || !contact.phone}
                    onClick={handleBooking}
                    className={`flex-1 py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all ${
                      contact.name && contact.phone 
                        ? `${theme.accent} shadow-lg shadow-amber-900/30` 
                        : 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
                    }`}
                  >
                    <Check size={20} />
                    Забронировать
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

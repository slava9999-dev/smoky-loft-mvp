import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Calendar, User, Armchair } from 'lucide-react';
import { businessConfig } from '../config/business';
import { HallVisualizer } from './HallVisualizer';

export function BookingModal({ isOpen, onClose, cart, clearCart, onBookingSuccess }) {
  const [step, setStep] = useState(1);
  const [selectedTable, setSelectedTable] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [contact, setContact] = useState({ name: '', phone: '' });
  
  const { theme, hall } = businessConfig;

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedTable(null);
      setDate('');
      setTime('');
      setContact({ name: '', phone: '' });
    }
  }, [isOpen]);

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length === 0) return '';
    if (numbers.length > 11) return contact.phone; // Limit length
    
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
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          className={`w-full max-w-lg ${theme.cardBg} rounded-t-2xl sm:rounded-2xl border border-neutral-700 shadow-2xl flex flex-col max-h-[90vh]`}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-neutral-700">
            <div>
              <h2 className={`text-xl font-bold ${theme.text}`}>
                {step === 1 && "Выберите столик"}
                {step === 2 && "Дата и время"}
                {step === 3 && "Контакты"}
              </h2>
              <div className="flex gap-1 mt-1">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i <= step ? 'w-8 bg-amber-500' : 'w-2 bg-neutral-700'}`} />
                ))}
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-full bg-neutral-700 hover:bg-neutral-600 transition-colors">
              <X size={20} className="text-white" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto custom-scrollbar">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <p className="text-neutral-400 mb-4 text-sm">Нажмите на стол схемы зала, чтобы выбрать место:</p>
                
                <HallVisualizer 
                  selectedTableId={selectedTable} 
                  onSelectTable={setSelectedTable} 
                />

                <div className="flex gap-4 justify-center text-xs text-neutral-500 mb-6">
                  <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-neutral-700 border border-neutral-500"></div>Свободно</div>
                  <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-amber-500"></div>Выбрано</div>
                </div>

                <button
                  disabled={!selectedTable}
                  onClick={() => setStep(2)}
                  className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
                    selectedTable ? theme.accent : 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
                  }`}
                >
                  Продолжить
                  <Armchair size={18} />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
               
                <div>
                  <label className="flex items-center gap-2 text-sm text-amber-400 font-bold mb-3 uppercase tracking-wider">
                    <Calendar size={16} /> День
                  </label>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {dates.map(d => (
                      <button
                        key={d.value}
                        onClick={() => setDate(d.label)}
                        className={`flex-1 min-w-[100px] px-4 py-3 rounded-xl text-sm font-bold border transition-all ${
                          date === d.label 
                            ? 'bg-amber-500/20 border-amber-500 text-amber-400' 
                            : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:border-neutral-600'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-amber-400 font-bold mb-3 uppercase tracking-wider block">Время</label>
                  <div className="grid grid-cols-4 gap-2">
                    {times.map(t => (
                      <button
                        key={t}
                        onClick={() => setTime(t)}
                        className={`px-2 py-3 rounded-xl text-sm font-bold border transition-all ${
                          time === t 
                            ? 'bg-amber-500/20 border-amber-500 text-amber-400' 
                            : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:border-neutral-600'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button onClick={() => setStep(1)} className="px-6 py-4 rounded-xl font-bold bg-neutral-800 text-white hover:bg-neutral-700 transition-colors">
                    Назад
                  </button>
                  <button
                    disabled={!date || !time}
                    onClick={() => setStep(3)}
                    className={`flex-1 py-4 rounded-xl font-bold text-white transition-all ${
                      date && time ? theme.accent : 'bg-neutral-800 text-neutral-600'
                    }`}
                  >
                    Далее
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                <div className="bg-amber-900/20 border border-amber-900/50 rounded-xl p-4 mb-4">
                  <h4 className="text-amber-500 text-xs font-bold uppercase tracking-wider mb-2">Ваш выбор</h4>
                  <div className="flex justify-between text-neutral-300 text-sm mb-1">
                    <span>Столик:</span>
                    <span className="text-white font-bold">{hall.tables.find(t => t.id === selectedTable)?.label}</span>
                  </div>
                  <div className="flex justify-between text-neutral-300 text-sm">
                    <span>Дата и время:</span>
                    <span className="text-white font-bold">{date}, {time}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs text-neutral-400 ml-1">Как вас зовут?</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                      <input
                        type="text"
                        placeholder="Имя"
                        className="w-full pl-11 pr-4 py-4 rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-amber-500 transition-colors"
                        value={contact.name}
                        onChange={e => setContact({...contact, name: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs text-neutral-400 ml-1">Номер телефона</label>
                    <input
                      type="tel"
                      placeholder="+7 (999) 000-00-00"
                      className="w-full px-4 py-4 rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-amber-500 transition-colors"
                      value={contact.phone}
                      onChange={handlePhoneChange}
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4 mt-auto">
                    <button onClick={() => setStep(2)} className="px-6 py-4 rounded-xl font-bold bg-neutral-800 text-white hover:bg-neutral-700 transition-colors">
                      Назад
                    </button>
                    <button
                      disabled={!contact.name || !contact.phone}
                      onClick={handleBooking}
                      className={`flex-1 py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-lg shadow-amber-900/20 ${
                        contact.name && contact.phone ? theme.accent : 'bg-neutral-800 text-neutral-600'
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

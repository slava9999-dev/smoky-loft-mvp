import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { businessConfig } from '../config/business';

export function BookingModal({ isOpen, onClose, cart }) {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [contact, setContact] = useState({ name: '', phone: '' });
  
  const { theme } = businessConfig;

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setDate('');
      setTime('');
    }
  }, [isOpen]);

  const dates = [
    { label: 'Сегодня', value: 'today' },
    { label: 'Завтра', value: 'tomorrow' },
    { label: 'Послезавтра', value: 'after_tomorrow' }
  ];

  const times = ['14:00', '16:00', '18:00', '20:00', '22:00', '00:00'];

  const handleBooking = () => {
    const text = `
🔥 *Новая бронь: ${businessConfig.name}*
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
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          className={`w-full max-w-md ${theme.cardBg} rounded-t-2xl sm:rounded-2xl p-6 border-t ${theme.border}`}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-xl font-bold ${theme.text}`}>Бронирование</h2>
            <button onClick={onClose} className="p-2 rounded-full bg-neutral-700/50">
              <X size={20} className="text-white" />
            </button>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="text-sm text-neutral-400 mb-2 block">Выберите день</label>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {dates.map(d => (
                    <button
                      key={d.value}
                      onClick={() => setDate(d.label)}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                        date === d.label 
                          ? `${theme.accent} text-white` 
                          : 'bg-neutral-700 text-neutral-300'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-neutral-400 mb-2 block">Выберите время</label>
                <div className="grid grid-cols-4 gap-2">
                  {times.map(t => (
                    <button
                      key={t}
                      onClick={() => setTime(t)}
                      className={`px-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                        time === t 
                          ? `${theme.accent} text-white` 
                          : 'bg-neutral-700 text-neutral-300'
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
                className={`w-full py-3 rounded-xl font-bold text-white ${
                  date && time ? theme.accent : 'bg-neutral-700 text-neutral-500'
                }`}
              >
                Продолжить
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Ваше имя"
                className="w-full p-3 rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-amber-500"
                value={contact.name}
                onChange={e => setContact({...contact, name: e.target.value})}
              />
              <input
                type="tel"
                placeholder="Телефон"
                className="w-full p-3 rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-amber-500"
                value={contact.phone}
                onChange={e => setContact({...contact, phone: e.target.value})}
              />
              
              <button
                disabled={!contact.name || !contact.phone}
                onClick={handleBooking}
                className={`w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 ${
                  contact.name && contact.phone ? theme.accent : 'bg-neutral-700 text-neutral-500'
                }`}
              >
                <Check size={20} />
                Подтвердить бронь
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

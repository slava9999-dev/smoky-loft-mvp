import { useState } from 'react';
import { businessConfig } from './config/business';
import { ServiceCard } from './components/ServiceCard';
import { BookingModal } from './components/BookingModal';
import { ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

function App() {
  const [cart, setCart] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { theme, hero, services, loyalty } = businessConfig;

  const addToCart = (service) => {
    setCart([...cart, service]);
    // Haptic feedback pattern if available, otherwise just visual
    if (window.navigator.vibrate) window.navigator.vibrate(50);
  };

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} pb-24`}>
      {/* Hero Section */}
      <header className="p-6 pt-12">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3 text-gradient leading-tight">
              {businessConfig.name}
            </h1>
            <p className="text-neutral-300 text-base max-w-[280px] leading-relaxed">
              {hero.subtitle}
            </p>
          </div>
          <div className="text-5xl animate-pulse">{hero.emoji}</div>
        </div>

        {/* Loyalty Card */}
        <div className={`p-6 rounded-2xl bg-gradient-to-br from-amber-700 via-amber-800 to-amber-900 text-white shadow-2xl mb-8 border border-amber-600/30`}>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-lg tracking-tight">{loyalty.title}</h3>
            <span className="bg-white/25 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm border border-white/20">
              {loyalty.discount}
            </span>
          </div>
          <p className="text-sm opacity-95 leading-relaxed">{loyalty.description}</p>
        </div>
      </header>

      {/* Services Grid */}
      <main className="px-6 pb-6">
        <h2 className="text-2xl font-bold mb-5 tracking-tight">Меню & Услуги</h2>
        <div className="grid gap-4">
          {services.map(service => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              onAdd={addToCart} 
            />
          ))}
        </div>
      </main>

      {/* Floating Action Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 left-0 right-0 px-6 z-40">
          <motion.button
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className={`w-full py-4 rounded-xl ${theme.accent} text-white font-bold shadow-lg flex items-center justify-between px-6`}
          >
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} />
              <span>{cart.length} поз.</span>
            </div>
            <span>Бронировать</span>
            <span>{cart.reduce((a, b) => a + b.price, 0)} {businessConfig.currency}</span>
          </motion.button>
        </div>
      )}

      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        cart={cart} 
      />
    </div>
  );
}

export default App;

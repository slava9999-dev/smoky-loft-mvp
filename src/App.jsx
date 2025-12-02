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
            <h1 className="text-3xl font-bold mb-2">{businessConfig.name}</h1>
            <p className="text-neutral-400 text-sm max-w-[250px]">{hero.subtitle}</p>
          </div>
          <div className="text-4xl">{hero.emoji}</div>
        </div>

        {/* Loyalty Card */}
        <div className={`p-5 rounded-2xl bg-gradient-to-br from-amber-700 to-amber-900 text-white shadow-lg mb-8`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">{loyalty.title}</h3>
            <span className="bg-white/20 px-2 py-1 rounded text-xs backdrop-blur-sm">{loyalty.discount}</span>
          </div>
          <p className="text-sm opacity-90">{loyalty.description}</p>
        </div>
      </header>

      {/* Services Grid */}
      <main className="px-6 pb-6">
        <h2 className="text-xl font-bold mb-4">Меню & Услуги</h2>
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

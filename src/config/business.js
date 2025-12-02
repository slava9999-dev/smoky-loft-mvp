export const businessConfig = {
  name: "Smoky Loft",
  telegramAdmin: "vyacheslav_admin", 
  currency: "₽",
  
  // THEME: Dark Amber & Smoke
  theme: {
    bg: "bg-neutral-900", 
    text: "text-amber-50",
    accent: "bg-amber-700", 
    cardBg: "bg-neutral-800",
    border: "border-neutral-700"
  },

  hero: {
    title: "Атмосфера правильного отдыха",
    subtitle: "Авторские миксы, чайная карта и PS5. Бронируй стол.",
    emoji: "💨"
  },

  loyalty: {
    title: "Smoky Family",
    discount: "Free",
    description: "Замена чаши бесплатно при заказе от 3000₽."
  },

  // PRESERVE STRUCTURE for ServiceCard component
  services: [
    {
      id: 1,
      title: "Кальян Classic",
      price: 1200,
      description: "Легкие и средние табаки на классической чаше.",
      image: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 2,
      title: "Авторский Микс",
      price: 1700,
      description: "Фруктовая чаша (грейпфрут/ананас), премиум табаки.",
      image: "https://images.unsplash.com/photo-1512418490979-92798cec1380?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 3,
      title: "VIP Комната + PS5",
      price: 500, 
      description: "Отдельная комната, большой экран, приставка. Цена за час.",
      image: "https://images.unsplash.com/photo-1605901309584-818e25960b8f?auto=format&fit=crop&q=80&w=800"
    }
  ]
};

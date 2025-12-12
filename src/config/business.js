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

  wifi: {
    network: "Smoky_Guest",
    password: "smoke2025"
  },

  social: {
    instagram: "https://instagram.com"
  },

  // PRESERVE STRUCTURE for ServiceCard component
  services: [
    {
      id: 1,
      title: "Кальян Classic",
      price: 1200,
      description: "Легкие и средние табаки на классической чаше.",
      image: "/images/hookah-classic.webp"
    },
    {
      id: 2,
      title: "Авторский Микс",
      price: 1700,
      description: "Фруктовая чаша (грейпфрут/ананас), премиум табаки.",
      image: "/images/hookah-fruit.webp"
    },
    {
      id: 3,
      title: "VIP Комната + PS5",
      price: 500, 
      description: "Отдельная комната, большой экран, приставка. Цена за час.",
      image: "/images/vip-room.webp"
    }
  ],
  
  // Hall Configuration for Visualization
  hall: {
    width: 800,
    height: 600,
    tables: [
      { id: 1, label: "Стол 1", x: 10, y: 10, type: "window", seats: 4 },
      { id: 2, label: "Стол 2", x: 60, y: 10, type: "window", seats: 4 },
      { id: 3, label: "Стол 3", x: 10, y: 50, type: "sofa", seats: 6 },
      { id: 4, label: "Стол 4", x: 60, y: 50, type: "sofa", seats: 6 },
      { id: 5, label: "VIP", x: 35, y: 80, type: "vip", seats: 8 },
      { id: 6, label: "Bar", x: 90, y: 40, type: "bar", seats: 2 }
    ]
  }
};

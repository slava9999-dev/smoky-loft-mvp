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
  // Координаты в процентах от размера контейнера
  hall: {
    width: 800,
    height: 600,
    tables: [
      // Зона у окна (левая стена) - уютные столики для пар и небольших компаний
      { id: 1, label: "Окно 1", x: 15, y: 25, type: "window", seats: 2, minOrder: 1500, features: ["view", "cozy"] },
      { id: 2, label: "Окно 2", x: 15, y: 48, type: "window", seats: 4, minOrder: 2000, features: ["view", "cozy"] },
      
      // Центральная зона - диванная (большие компании)
      { id: 3, label: "Диван 1", x: 35, y: 30, type: "sofa", seats: 6, minOrder: 3000, features: ["comfort", "spacious"] },
      { id: 4, label: "Диван 2", x: 60, y: 30, type: "sofa", seats: 6, minOrder: 3000, features: ["comfort", "spacious"] },
      { id: 5, label: "Диван 3", x: 35, y: 55, type: "sofa", seats: 5, minOrder: 2500, features: ["comfort"] },
      { id: 6, label: "Диван 4", x: 60, y: 55, type: "sofa", seats: 5, minOrder: 2500, features: ["comfort"] },
      
      // VIP зона (приватная) - внизу по центру
      { id: 7, label: "VIP Lounge", x: 47, y: 75, type: "vip", seats: 10, minOrder: 5000, features: ["private", "ps5", "premium", "hookah_included"] },
      
      // Барная стойка (быстрые встречи, одиночки)
      { id: 8, label: "Бар 1", x: 78, y: 30, type: "bar", seats: 2, minOrder: 1000, features: ["quick", "social"] },
      { id: 9, label: "Бар 2", x: 78, y: 50, type: "bar", seats: 2, minOrder: 1000, features: ["quick", "social"] },
    ],
    // Зоны зала
    zones: {
      window: { name: "У окна", description: "Уютные столики с видом", avgPrice: 1500 },
      sofa: { name: "Диванная зона", description: "Мягкие диваны для компаний", avgPrice: 2500 },
      vip: { name: "VIP Lounge", description: "Приватная комната с PS5", avgPrice: 5000 },
      bar: { name: "Барная стойка", description: "Быстрый формат у бара", avgPrice: 1000 },
    }
  }
};

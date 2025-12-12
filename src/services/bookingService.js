/**
 * Booking Service - управление бронированиями столов
 * В будущем можно заменить на API-вызовы к бэкенду
 */

const STORAGE_KEY = 'smoky_loft_bookings';

// Получить все бронирования
export function getBookings() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Добавить бронирование
export function addBooking(booking) {
  const bookings = getBookings();
  const newBooking = {
    ...booking,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  bookings.push(newBooking);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  return newBooking;
}

// Проверить, занят ли стол на определенную дату/время
export function isTableBooked(tableId, date, time) {
  const bookings = getBookings();
  return bookings.some(b => 
    b.tableId === tableId && 
    b.date === date && 
    b.time === time
  );
}

// Получить бронирование для стола (ближайшее)
export function getTableBooking(tableId, date) {
  const bookings = getBookings();
  return bookings.find(b => b.tableId === tableId && b.date === date);
}

// Получить все бронирования на дату
export function getBookingsForDate(date) {
  const bookings = getBookings();
  return bookings.filter(b => b.date === date);
}

// Очистить старые бронирования (прошедшие)
export function cleanupOldBookings() {
  const bookings = getBookings();
  const today = new Date().toISOString().split('T')[0];
  const activeBookings = bookings.filter(b => {
    // Простая проверка - оставляем "Сегодня", "Завтра", "Послезавтра"
    return ['Сегодня', 'Завтра', 'Послезавтра'].includes(b.date);
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(activeBookings));
}

// Полная очистка бронирований (для тестирования)
export function clearBookings() {
  localStorage.removeItem(STORAGE_KEY);
}

// ===== НОВЫЕ ФУНКЦИИ ДЛЯ УПРАВЛЕНИЯ БРОНЯМИ =====

// Отменить бронирование по ID
export function cancelBooking(bookingId) {
  const bookings = getBookings();
  const index = bookings.findIndex(b => b.id === bookingId);
  
  if (index === -1) return false;
  
  // Удаляем бронирование
  bookings.splice(index, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  
  return true;
}

// Получить бронирования пользователя по телефону
export function getUserBookings(phone) {
  const bookings = getBookings();
  // Нормализуем телефон для сравнения
  const normalizedPhone = phone.replace(/\D/g, '');
  return bookings.filter(b => {
    const bookingPhone = b.phone?.replace(/\D/g, '') || '';
    return bookingPhone === normalizedPhone || bookingPhone.endsWith(normalizedPhone.slice(-10));
  });
}

// Получить все активные бронирования (не прошедшие)
export function getActiveBookings() {
  const bookings = getBookings();
  const activeDates = ['Сегодня', 'Завтра', 'Послезавтра'];
  return bookings.filter(b => activeDates.includes(b.date));
}

// Получить бронирование по ID
export function getBookingById(bookingId) {
  const bookings = getBookings();
  return bookings.find(b => b.id === bookingId);
}

// Демо-данные для тестирования (новая планировка с 9 столами)
export function seedDemoBookings() {
  const existingBookings = getBookings();
  if (existingBookings.length > 0) return; // Уже есть данные
  
  const demoBookings = [
    // Сегодня
    { tableId: 3, date: 'Сегодня', time: '18:00', name: 'Александр К.', phone: '+7 (999) 123-45-67' },
    { tableId: 7, date: 'Сегодня', time: '20:00', name: 'VIP Гость', phone: '+7 (999) 000-00-00' },
    { tableId: 1, date: 'Сегодня', time: '22:00', name: 'Дмитрий', phone: '+7 (999) 777-88-99' },
    // Завтра
    { tableId: 4, date: 'Завтра', time: '16:00', name: 'Мария С.', phone: '+7 (999) 555-33-22' },
    { tableId: 5, date: 'Завтра', time: '18:00', name: 'Компания "Дружба"', phone: '+7 (999) 111-22-33' },
    { tableId: 7, date: 'Завтра', time: '22:00', name: 'VIP День Рождения', phone: '+7 (999) 444-55-66' },
  ];
  
  demoBookings.forEach(b => addBooking(b));
}

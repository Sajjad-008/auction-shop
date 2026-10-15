const inMinutes = (m) => new Date(Date.now() + m * 60 * 1000).toISOString();

export const auctions = [
  {
    id: 1,
    category: "collectibles",
    title: "ساعت مچی کلاسیک رترو",
    currentPrice: 12500000,
    bidCount: 12,
    endAt: inMinutes(165),
  },
  {
    id: 2,
    category: "electronics",
    title: "گوشی هوشمند پرچمدار",
    currentPrice: 38900000,
    bidCount: 27,
    endAt: inMinutes(4),
  },
  {
    id: 3,
    category: "collectibles",
    title: "دوربین آنالوگ قدیمی",
    currentPrice: 8200000,
    bidCount: 9,
    endAt: inMinutes(100),
  },
  {
    id: 4,
    category: "decor",
    title: "فرش دستباف کاشان",
    currentPrice: 42000000,
    bidCount: 31,
    endAt: inMinutes(-10),
  },
  {
    id: 5,
    category: "electronics",
    title: "هدفون حرفه‌ای استودیویی",
    currentPrice: 4800000,
    bidCount: 6,
    endAt: inMinutes(240),
  },
  {
    id: 6,
    category: "art",
    title: "تابلوی نقاشی رنگ‌روغن",
    currentPrice: 16400000,
    bidCount: 15,
    endAt: inMinutes(60),
  },
];

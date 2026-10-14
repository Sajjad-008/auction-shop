const inMinutes = (m) => new Date(Date.now() + m * 60 * 1000).toISOString();

export const auctions = [
  {
    id: 1,
    title: "ساعت مچی کلاسیک رترو",
    currentPrice: 12500000,
    bidCount: 12,
    endAt: inMinutes(165),
  },
  {
    id: 2,
    title: "گوشی هوشمند پرچمدار",
    currentPrice: 38900000,
    bidCount: 27,
    endAt: inMinutes(4),
  },
  {
    id: 3,
    title: "دوربین آنالوگ قدیمی",
    currentPrice: 8200000,
    bidCount: 9,
    endAt: inMinutes(100),
  },
  {
    id: 4,
    title: "فرش دستباف کاشان",
    currentPrice: 42000000,
    bidCount: 31,
    endAt: inMinutes(-10),
  },
];

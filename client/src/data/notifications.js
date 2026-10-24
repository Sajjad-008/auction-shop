const ago = (m) => new Date(Date.now() - m * 60 * 1000).toISOString();

export const initialNotifications = [
  {
    id: "seed-1",
    type: "outbid",
    read: false,
    at: ago(9),
    link: "/auction/2",
    title: "پیشنهاد بالاتر ثبت شد",
    text: "کسی برای «گوشی هوشمند پرچمدار» پیشنهاد بالاتر از تو داد.",
  },
  {
    id: "seed-2",
    type: "ending",
    read: false,
    at: ago(15),
    link: "/auction/6",
    title: "مزایده در حال پایان",
    text: "کمتر از یک ساعت تا پایان «تابلوی نقاشی رنگ‌روغن» مانده.",
  },
  {
    id: "seed-3",
    type: "won",
    read: false,
    at: ago(10),
    link: "/auction/4",
    title: "برنده شدی",
    text: "تبریک! برنده‌ی مزایده‌ی «فرش دستباف کاشان» شدی.",
  },
  {
    id: "seed-4",
    type: "system",
    read: true,
    at: ago(180),
    link: null,
    title: "به مزایده‌گاه خوش اومدی",
    text: "از اینجا می‌تونی اعلان‌های مزایده‌هات رو ببینی.",
  },
];

import type { AppNotification } from "../types";

const ago = (m: number) => new Date(Date.now() - m * 60 * 1000).toISOString();

export const initialNotifications: AppNotification[] = [
  {
    id: "seed-1",
    type: "outbid",
    read: false,
    at: ago(9),
    link: "/auction/2",
    title: "ثبت پیشنهاد بالاتر",
    text: "برای «گوشی هوشمند پرچمدار» پیشنهادی بالاتر از پیشنهاد شما ثبت شد.",
  },
  {
    id: "seed-2",
    type: "ending",
    read: false,
    at: ago(15),
    link: "/auction/6",
    title: "مزایده در آستانه‌ی پایان",
    text: "کمتر از یک ساعت تا پایان مزایده‌ی «تابلوی نقاشی رنگ‌روغن» باقی مانده است.",
  },
  {
    id: "seed-3",
    type: "won",
    read: false,
    at: ago(10),
    link: "/auction/4",
    title: "برنده‌ی مزایده شدید",
    text: "تبریک؛ شما برنده‌ی مزایده‌ی «فرش دستباف کاشان» شدید.",
  },
  {
    id: "seed-4",
    type: "system",
    read: true,
    at: ago(180),
    link: null,
    title: "خوش آمدید",
    text: "اعلان‌های مربوط به مزایده‌های شما از این بخش قابل مشاهده است.",
  },
];

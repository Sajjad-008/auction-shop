import type { Auction } from "../types";
const inMinutes = (m: number) =>
  new Date(Date.now() + m * 60 * 1000).toISOString();
const ago = (m: number) => inMinutes(-m);

export const initialAuctions: Auction[] = [
  {
    id: 1,
    category: "collectibles",
    title: "ساعت مچی کلاسیک رترو",
    image: "/images/auction-1.jpg",
    description:
      "ساعت مچی کلاسیک با بدنه‌ی استیل و مکانیزم اتوماتیک. وضعیت عالی، همراه با جعبه‌ی اصلی و کارت گارانتی.",
    startPrice: 10000000,
    bidStep: 250000,
    endAt: inMinutes(165),
    bids: [
      { user: "من", amount: 12500000, at: ago(2) },
      { user: "م***ا", amount: 12250000, at: ago(11) },
      { user: "س***ه", amount: 12000000, at: ago(40) },
    ],
  },
  {
    id: 2,
    category: "electronics",
    title: "گوشی هوشمند پرچمدار",
    image: "/images/auction-2.jpg",
    description:
      "گوشی هوشمند پرچمدار با ۲۵۶ گیگ حافظه، بدون خط و خش، همراه با تمام ملحقات و گارانتی معتبر.",
    startPrice: 35000000,
    bidStep: 500000,
    endAt: inMinutes(4),
    bids: [
      { user: "ر***ا", amount: 38900000, at: ago(1) },
      { user: "من", amount: 38400000, at: ago(9) },
    ],
  },
  {
    id: 3,
    category: "collectibles",
    title: "دوربین آنالوگ قدیمی",
    image: "/images/auction-3.jpg",
    description:
      "دوربین آنالوگ فیلمی کلکسیونی، سالم و آماده‌ی عکاسی. همراه با کیف چرمی اصلی.",
    startPrice: 7000000,
    bidStep: 200000,
    endAt: inMinutes(100),
    bids: [{ user: "ح***ن", amount: 8200000, at: ago(25) }],
  },
  {
    id: 4,
    category: "decor",
    title: "فرش دستباف کاشان",
    image: "/images/auction-4.jpg",
    description:
      "فرش دستباف کاشان، ابعاد ۶ متری، با طرح لچک‌ترنج و رنگ‌بندی سنتی.",
    startPrice: 38000000,
    bidStep: 1000000,
    endAt: inMinutes(-10),
    bids: [{ user: "من", amount: 42000000, at: ago(30) }],
  },
  {
    id: 5,
    category: "electronics",
    title: "هدفون حرفه‌ای استودیویی",
    image: "/images/auction-5.jpg",
    description:
      "هدفون استودیویی با کیفیت صدای بالا، مناسب میکس و مانیتورینگ. بدون استفاده‌ی زیاد.",
    startPrice: 4000000,
    bidStep: 100000,
    endAt: inMinutes(240),
    bids: [{ user: "پ***ز", amount: 4800000, at: ago(55) }],
  },
  {
    id: 6,
    category: "art",
    title: "تابلوی نقاشی رنگ‌روغن",
    image: "/images/auction-6.jpg",
    description:
      "تابلوی نقاشی رنگ‌روغن روی بوم، ابعاد ۷۰ در ۱۰۰ سانتی‌متر، همراه با قاب چوبی.",
    startPrice: 14000000,
    bidStep: 400000,
    endAt: inMinutes(60),
    bids: [
      { user: "ک***ی", amount: 16400000, at: ago(5) },
      { user: "من", amount: 16000000, at: ago(20) },
    ],
  },
];

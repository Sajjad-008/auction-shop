export const getCurrentPrice = (a) =>
  a.bids.length ? a.bids[0].amount : a.startPrice;

export const getMinNextBid = (a) =>
  a.bids.length ? a.bids[0].amount + a.bidStep : a.startPrice;

export const isEnded = (a) => new Date(a.endAt) <= Date.now();

export const formatToman = (n) => `${n.toLocaleString("fa-IR")} تومان`;

// ورودی کاربر رو (حتی با ارقام فارسی و جداکننده) به رشته‌ی ارقام انگلیسی تبدیل می‌کنه
export const toEnglishDigits = (s) =>
  s
    .replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d))
    .replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d))
    .replace(/\D/g, "");

export const timeAgo = (iso) => {
  const min = Math.floor((Date.now() - new Date(iso)) / 60000);
  if (min < 1) return "همین الان";
  if (min < 60) return `${min.toLocaleString("fa-IR")} دقیقه پیش`;
  return `${Math.floor(min / 60).toLocaleString("fa-IR")} ساعت پیش`;
};

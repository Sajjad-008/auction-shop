// عدد فارسی بدون جداکننده‌ی هزارگان (برای شماره‌ی تیکت)
export const faNum = (n) => n.toLocaleString("fa-IR", { useGrouping: false });

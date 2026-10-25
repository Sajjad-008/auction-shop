// عدد فارسی بدون جداکننده‌ی هزارگان (برای شماره‌ی تیکت)
export const faNum = (n: number): string =>
  n.toLocaleString("fa-IR", { useGrouping: false });

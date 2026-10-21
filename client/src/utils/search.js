export const normalize = (s) =>
  s
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[\u064B-\u065F\u0640]/g, "")
    .toLowerCase()
    .trim();

export const matches = (auction, query) => {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const text = normalize(`${auction.title} ${auction.description}`);
  return words.every((w) => text.includes(w));
};

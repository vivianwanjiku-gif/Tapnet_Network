export function kes(amount) {
  const value = Number(amount);
  if (!Number.isFinite(value)) return "—";
  return `KSh ${value.toLocaleString("en-KE")}`;
}

export function periodWord(days) {
  if (days === 1) return "day";
  if (days === 7) return "week";
  if (days === 30) return "month";
  return `${days} days`;
}

export function formatWhen(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

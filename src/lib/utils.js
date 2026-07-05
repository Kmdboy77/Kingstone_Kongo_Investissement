export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
export function formatCurrency(amount, currency = "USD") {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency", currency,
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(amount);
}
export function formatNumber(n) {
  return new Intl.NumberFormat("fr-FR").format(n);
}
export function pct(collected, goal) {
  return Math.min(100, Math.round((collected / goal) * 100));
}

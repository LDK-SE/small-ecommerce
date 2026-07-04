export function formatPrice(price) {
  const p = Number(price) || 0;
  return `￥${p.toFixed(2)}`;
}

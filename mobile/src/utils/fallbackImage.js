const fallbackIds = [
  'photo-1556742049-0cfed4f6a45d',
  'photo-1542291026-7eec264c27ff',
  'photo-1523275335684-37898b6baf30',
  'photo-1505740420928-5e560c06d30e',
  'photo-1555041469-a586c61ea9bc',
  'photo-1572635196237-14b3f281503f',
  'photo-1491553895911-0055eca6402d',
  'photo-1560343090-f0409e92791a'
];

export function getFallbackImage(name, width = 900) {
  const hash = (name || '').split('').reduce((s, c) => s + c.charCodeAt(0), 0);
  return `https://images.unsplash.com/${fallbackIds[hash % fallbackIds.length]}?auto=format&fit=crop&w=${width}&q=80`;
}

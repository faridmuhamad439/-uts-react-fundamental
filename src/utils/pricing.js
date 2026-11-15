// Utility pricing, promo codes, tax, and currency formatter

export const PROMO_CODES = {
  UTS25: { code: 'UTS25', discountPercent: 25, description: 'Diskon Spesial UTS 25%' },
  HEMAT10: { code: 'HEMAT10', discountPercent: 10, description: 'Hemat Harian 10%' },
  KOPI15: { code: 'KOPI15', discountPercent: 15, description: 'Pecinta Kopi 15%' }
};

export const TAX_RATE = 0.10; // 10%

export function formatRupiah(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return 'Rp 0';
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function calculateCartTotals(items, promoCode = '') {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  let discountPercent = 0;
  let promoInfo = null;
  const upperCode = (promoCode || '').trim().toUpperCase();

  if (upperCode && PROMO_CODES[upperCode]) {
    promoInfo = PROMO_CODES[upperCode];
    discountPercent = promoInfo.discountPercent;
  }

  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const afterDiscount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round(afterDiscount * TAX_RATE);
  const grandTotal = afterDiscount + taxAmount;

  return {
    subtotal,
    promoCode: promoInfo ? promoInfo.code : null,
    discountPercent,
    discountAmount,
    taxAmount,
    grandTotal
  };
}

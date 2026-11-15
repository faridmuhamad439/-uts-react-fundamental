import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationContext';
import { useToast } from '../context/ToastContext';
import { formatRupiah, PROMO_CODES } from '../utils/pricing';
import Modal from './Modal';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Tag,
  ShoppingBag,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react';

export default function CartDrawer({ isOpen, onClose }) {
  const {
    items,
    promoCode,
    totals,
    increaseQty,
    decreaseQty,
    removeFromCart,
    applyPromo,
    removePromo,
    checkoutOrder,
    getStock
  } = useCart();

  const { addNotification } = useNotifications();
  const toast = useToast();

  const [inputPromo, setInputPromo] = useState('');
  const [promoError, setPromoError] = useState('');
  const [completedOrder, setCompletedOrder] = useState(null);

  if (!isOpen) return null;

  const handleApplyPromo = (codeToApply) => {
    const code = codeToApply || inputPromo;
    setPromoError('');
    const res = applyPromo(code);
    if (res.success) {
      toast.success(`Kupon ${res.promo.code} aktif! Diskon ${res.promo.discountPercent}%`);
      addNotification(
        'Promo Diterapkan',
        `Kupon ${res.promo.code} memberikan potongan harga ${res.promo.discountPercent}%.`,
        'success'
      );
      setInputPromo('');
    } else {
      setPromoError(res.reason);
      toast.error(res.reason);
    }
  };

  const handleRemovePromo = () => {
    removePromo();
    toast.info('Kupon promo dilepas.');
    addNotification('Promo Dihapus', 'Kupon promo tidak lagi digunakan pada pesanan.', 'info');
  };

  const handleIncrease = (item) => {
    const res = increaseQty(item.id);
    if (!res.success) {
      toast.warning(res.reason);
    }
  };

  const handleCheckout = () => {
    const res = checkoutOrder('QRIS / Cashless');
    if (res.success) {
      setCompletedOrder(res.order);
      toast.success('Pembayaran sukses! Struk telah diterbitkan.');
      addNotification(
        'Transaksi Berhasil',
        `Pesanan #${res.order.orderId} senilai ${formatRupiah(res.order.totals.grandTotal)} lunas terbayar.`,
        'success'
      );
    } else {
      toast.error(res.reason);
    }
  };

  return (
    <>
      {/* Drawer Overlay */}
      <div
        className="fixed inset-0 z-50 custom-backdrop flex justify-end"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
      >
        <div
          className="w-full max-w-md bg-[#faf8f5] h-full shadow-2xl flex flex-col custom-drawer-anim border-l border-[#e7ded2]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Drawer */}
          <div className="p-5 border-b border-[#e9e1d4] bg-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#2e1a11] text-[#e2a859] flex items-center justify-center">
                <ShoppingBag size={18} />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#281810]">Keranjang Pesanan</h3>
                <span className="text-xs text-[#85766c] font-medium">
                  {items.reduce((acc, i) => acc + i.quantity, 0)} item dipilih
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#f4efe8] hover:bg-[#eae2d5] text-[#55473e] flex items-center justify-center transition-colors"
              aria-label="Tutup keranjang"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
            {items.length === 0 ? (
              <div className="text-center py-20 px-4">
                <div className="w-16 h-16 rounded-full bg-[#f0eae1] text-[#9c8e83] flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag size={28} />
                </div>
                <h4 className="text-base font-bold text-[#2e1a11] mb-1">Keranjang Masih Kosong</h4>
                <p className="text-xs text-[#7e7167] leading-relaxed max-w-xs mx-auto">
                  Pilih menu kopi atau hidangan favorit Anda di daftar menu dan tambahkan ke sini.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {items.map((item) => {
                    const maxStock = getStock(item.id, item.stock);
                    const isMax = item.quantity >= maxStock;

                    return (
                      <div
                        key={item.id}
                        className="p-3 rounded-2xl bg-white border border-[#ebe4d8] shadow-2xs flex gap-3 items-center"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-xl object-cover border border-[#eee6da] shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-[#2a1a12] truncate">
                            {item.name}
                          </h4>
                          <span className="text-xs font-bold text-[#b86b24]">
                            {formatRupiah(item.price)}
                          </span>
                          <span className="block text-[10px] text-[#938479]">
                            Tersedia: {maxStock} porsi
                          </span>
                        </div>

                        {/* Controls */}
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="text-[#a09489] hover:text-red-600 p-1"
                            title="Hapus"
                          >
                            <Trash2 size={13} />
                          </button>

                          <div className="flex items-center rounded-lg border border-[#ded5c7] bg-[#f9f7f4] overflow-hidden">
                            <button
                              type="button"
                              onClick={() => decreaseQty(item.id)}
                              className="w-6 h-6 flex items-center justify-center hover:bg-[#ebe3d6] text-[#42342c]"
                            >
                              <Minus size={11} />
                            </button>
                            <span className="w-6 text-center text-xs font-extrabold text-[#2a1a12]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              disabled={isMax}
                              onClick={() => handleIncrease(item)}
                              className="w-6 h-6 flex items-center justify-center hover:bg-[#ebe3d6] text-[#42342c] disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <Plus size={11} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Promo Code Box */}
                <div className="p-4 rounded-2xl bg-white border border-[#ebe4d8] shadow-2xs space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#3d2d23]">
                    <Tag size={13} className="text-[#b86b24]" />
                    <span>Kode Promo / Voucher</span>
                  </div>

                  {promoCode ? (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle size={14} className="text-emerald-600 shrink-0" />
                        <div>
                          <span className="font-mono font-bold text-emerald-900">{promoCode}</span>
                          <span className="text-[11px] text-emerald-700 ml-1.5 font-medium">
                            Hemat {totals.discountPercent}%
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemovePromo}
                        className="text-[11px] font-bold text-red-600 hover:underline"
                      >
                        Batal
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Ketik kode (UTS25)"
                          value={inputPromo}
                          onChange={(e) => setInputPromo(e.target.value)}
                          className="flex-1 px-3 py-1.5 text-xs font-mono uppercase bg-[#fbf9f6] border border-[#ded5c7] rounded-xl focus:outline-none focus:border-[#b86b24]"
                          onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                        />
                        <button
                          type="button"
                          onClick={() => handleApplyPromo()}
                          className="px-3.5 py-1.5 bg-[#2e1a11] hover:bg-[#3f2519] text-white text-xs font-bold rounded-xl transition-all"
                        >
                          Terapkan
                        </button>
                      </div>

                      {promoError && (
                        <p className="text-[11px] text-red-600 font-medium flex items-center gap-1">
                          <AlertCircle size={12} /> {promoError}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] text-[#938479]">Rekomendasi:</span>
                        {Object.keys(PROMO_CODES).map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => handleApplyPromo(c)}
                            className="px-2 py-0.5 rounded-md border border-dashed border-[#b86b24] text-[#b86b24] hover:bg-[#faedd9] text-[10px] font-bold font-mono transition-colors"
                          >
                            {c} (-{PROMO_CODES[c].discountPercent}%)
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer Summary & Checkout Button */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#e9e1d4] bg-white space-y-3 shadow-lg">
              <div className="space-y-1.5 text-xs text-[#6e6056]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#2c221e]">{formatRupiah(totals.subtotal)}</span>
                </div>
                {totals.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Diskon ({totals.promoCode})</span>
                    <span>-{formatRupiah(totals.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Pajak Restoran (10%)</span>
                  <span>{formatRupiah(totals.taxAmount)}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#f0eae1] flex justify-between items-baseline">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2e1a11]">
                  Total Bayar
                </span>
                <span className="text-xl font-extrabold text-[#2e1a11] tracking-tight">
                  {formatRupiah(totals.grandTotal)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#382013] to-[#25130b] hover:from-[#2e190e] hover:to-[#1b0d06] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#2b1810]/25 active:scale-98 transition-all"
              >
                <CreditCard size={17} />
                <span>Bayar Sekarang ({formatRupiah(totals.grandTotal)})</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* STRUK PEMBAYARAN SUKSES POPUP (Bukan alert/prompt) */}
      {completedOrder && (
        <Modal
          isOpen={Boolean(completedOrder)}
          onClose={() => setCompletedOrder(null)}
          title="Struk Transaksi Resmi"
          maxWidth="400px"
          footer={
            <div className="w-full flex justify-end">
              <button
                type="button"
                onClick={() => setCompletedOrder(null)}
                className="w-full py-2.5 rounded-xl bg-[#2e1a11] text-white text-xs font-bold hover:bg-[#3f2519] transition-all"
              >
                Tutup & Lanjut Pesan
              </button>
            </div>
          }
        >
          <div className="receipt-paper-ticket p-6 space-y-4">
            <div className="text-center">
              <h2 className="text-lg font-bold tracking-tight text-[#1e130c]">KOPIKU SPECIALTY</h2>
              <p className="text-[10px] text-[#786a60]">Jl. Kopi Kenangan No. 45, Jakarta</p>
              <div className="border-t border-dashed border-[#cfc5b6] my-2" />
              <div className="text-[10px] text-left space-y-0.5 text-[#52443a]">
                <div>No: #{completedOrder.orderId}</div>
                <div>Tgl: {completedOrder.date}</div>
                <div>Metode: {completedOrder.paymentMethod}</div>
              </div>
              <div className="border-t border-dashed border-[#cfc5b6] my-2" />
            </div>

            <div className="space-y-2 text-xs">
              {completedOrder.items.map((item) => (
                <div key={item.id} className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-[#2a1b12]">{item.name}</div>
                    <div className="text-[10px] text-[#85766c]">{item.quantity} x {formatRupiah(item.price)}</div>
                  </div>
                  <div className="font-bold text-[#2a1b12]">{formatRupiah(item.price * item.quantity)}</div>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed border-[#cfc5b6] pt-2 space-y-1 text-xs">
              <div className="flex justify-between text-[#615349]">
                <span>Subtotal</span>
                <span>{formatRupiah(completedOrder.totals.subtotal)}</span>
              </div>
              {completedOrder.totals.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Diskon ({completedOrder.totals.promoCode})</span>
                  <span>-{formatRupiah(completedOrder.totals.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#615349]">
                <span>Pajak (10%)</span>
                <span>{formatRupiah(completedOrder.totals.taxAmount)}</span>
              </div>
              <div className="border-t border-[#33251c] my-1 pt-1 flex justify-between font-extrabold text-sm text-[#1e130c]">
                <span>TOTAL</span>
                <span>{formatRupiah(completedOrder.totals.grandTotal)}</span>
              </div>
            </div>

            {/* Barcode strip simulation */}
            <div className="receipt-barcode" />
            <div className="text-center text-[10px] font-bold tracking-widest text-[#2e1a11] uppercase">
              *** LUNAS ***
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

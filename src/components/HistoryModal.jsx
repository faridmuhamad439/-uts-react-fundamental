import React, { useState } from 'react';
import Modal from './Modal';
import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationContext';
import { useToast } from '../context/ToastContext';
import { formatRupiah } from '../utils/pricing';
import { Receipt, RotateCcw, AlertTriangle, Calendar, ShoppingBag, CheckCircle, FileText } from 'lucide-react';

export default function HistoryModal({ isOpen, onClose }) {
  const { orderHistory, resetStockAndHistory } = useCart();
  const { addNotification } = useNotifications();
  const toast = useToast();

  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const totalSpentAllTime = orderHistory.reduce(
    (sum, order) => sum + (order.totals?.grandTotal || 0),
    0
  );

  const handleConfirmReset = () => {
    resetStockAndHistory();
    setConfirmResetOpen(false);
    toast.success('Stok menu dan riwayat transaksi telah dikembalikan ke awal!');
    addNotification(
      'Sistem Direset',
      'Stok seluruh menu telah dikembalikan ke jumlah semula dan daftar transaksi telah dikosongkan.',
      'warning'
    );
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={
          <div className="flex items-center gap-2">
            <Receipt size={20} className="text-[#b86b24]" />
            <span>Riwayat Transaksi Pesanan</span>
          </div>
        }
        maxWidth="650px"
        footer={
          <div className="flex items-center justify-between w-full">
            <button
              type="button"
              disabled={orderHistory.length === 0}
              onClick={() => setConfirmResetOpen(true)}
              className="px-3.5 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold flex items-center gap-1.5 disabled:opacity-40 transition-colors"
            >
              <RotateCcw size={14} />
              <span>Reset Stok & Riwayat</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#2e1a11] text-white text-xs font-bold hover:bg-[#3f2519] transition-all"
            >
              Selesai
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Summary Box */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-white border border-[#ebe3d6]">
            <div>
              <span className="block text-[10px] uppercase font-bold text-[#918175] tracking-wider">
                Total Transaksi
              </span>
              <span className="text-lg font-extrabold text-[#2a1b12]">
                {orderHistory.length} Pesanan
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-[#918175] tracking-wider">
                Total Belanja Akumulatif
              </span>
              <span className="text-lg font-extrabold text-[#b86b24]">
                {formatRupiah(totalSpentAllTime)}
              </span>
            </div>
          </div>

          {orderHistory.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-14 h-14 rounded-full bg-[#f4eee4] text-[#a49589] flex items-center justify-center mx-auto mb-3">
                <ShoppingBag size={24} />
              </div>
              <h4 className="text-sm font-bold text-[#2d1e16] mb-1">Belum Ada Transaksi</h4>
              <p className="text-xs text-[#82746a] max-w-xs mx-auto">
                Setelah Anda menyelesaikan pembayaran di keranjang, riwayat dan struk resmi akan tercatat di sini.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
              {orderHistory.map((order) => (
                <div
                  key={order.orderId}
                  className="p-4 rounded-2xl bg-white border border-[#ece4d8] shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-[#f4efe8] font-mono text-xs font-bold text-[#2e1a11]">
                          #{order.orderId}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle size={11} /> Selesai
                        </span>
                      </div>
                      <span className="text-[11px] text-[#938479] flex items-center gap-1 mt-1">
                        <Calendar size={11} /> {order.date}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedReceipt(order)}
                      className="px-3 py-1.5 rounded-xl bg-[#f6f1e8] hover:bg-[#ede5d8] text-xs font-bold text-[#44352c] flex items-center gap-1.5 border border-[#e5dcce] transition-all"
                    >
                      <FileText size={13} />
                      <span>Lihat Struk</span>
                    </button>
                  </div>

                  <div className="border-t border-b border-dashed border-[#ebe4d8] py-2 space-y-1 text-xs">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-[#44362e]">
                        <span>
                          {item.name} <span className="text-[#887a70] font-bold">x{item.quantity}</span>
                        </span>
                        <span className="font-semibold">{formatRupiah(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-[#7d6f65]">
                      Metode: <strong className="text-[#3b2d24]">{order.paymentMethod}</strong>
                    </span>
                    <div className="text-right">
                      <span className="text-[10px] text-[#938479] block">Total Pembayaran</span>
                      <span className="text-sm font-extrabold text-[#261710]">
                        {formatRupiah(order.totals.grandTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* MODAL KONFIRMASI RESET (Kustom, bukan confirm bawaan browser) */}
      <Modal
        isOpen={confirmResetOpen}
        onClose={() => setConfirmResetOpen(false)}
        title="Konfirmasi Reset Sistem"
        maxWidth="440px"
        footer={
          <div className="flex justify-end gap-2.5 w-full">
            <button
              type="button"
              onClick={() => setConfirmResetOpen(false)}
              className="px-4 py-2 rounded-xl border border-[#ded5c7] text-[#55473e] hover:bg-[#f6efe6] text-xs font-bold transition-all"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleConfirmReset}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all"
            >
              Ya, Reset Semuanya
            </button>
          </div>
        }
      >
        <div className="space-y-3 py-1">
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
            <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Tindakan ini akan mengembalikan stok seluruh menu ke jumlah awal dan menghapus semua catatan riwayat transaksi Anda.
            </p>
          </div>
          <p className="text-xs text-[#6e6056]">
            Apakah Anda yakin ingin melanjutkan reset?
          </p>
        </div>
      </Modal>

      {/* STRUK DETAIL DARI RIWAYAT PESANAN */}
      {selectedReceipt && (
        <Modal
          isOpen={Boolean(selectedReceipt)}
          onClose={() => setSelectedReceipt(null)}
          title="Struk Pembayaran"
          maxWidth="400px"
          footer={
            <div className="w-full flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="w-full py-2.5 rounded-xl bg-[#2e1a11] text-white text-xs font-bold hover:bg-[#3f2519] transition-all"
              >
                Tutup Struk
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
                <div>No: #{selectedReceipt.orderId}</div>
                <div>Tgl: {selectedReceipt.date}</div>
                <div>Metode: {selectedReceipt.paymentMethod}</div>
              </div>
              <div className="border-t border-dashed border-[#cfc5b6] my-2" />
            </div>

            <div className="space-y-2 text-xs">
              {selectedReceipt.items.map((item) => (
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
                <span>{formatRupiah(selectedReceipt.totals.subtotal)}</span>
              </div>
              {selectedReceipt.totals.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Diskon ({selectedReceipt.totals.promoCode})</span>
                  <span>-{formatRupiah(selectedReceipt.totals.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#615349]">
                <span>Pajak (10%)</span>
                <span>{formatRupiah(selectedReceipt.totals.taxAmount)}</span>
              </div>
              <div className="border-t border-[#33251c] my-1 pt-1 flex justify-between font-extrabold text-sm text-[#1e130c]">
                <span>TOTAL</span>
                <span>{formatRupiah(selectedReceipt.totals.grandTotal)}</span>
              </div>
            </div>

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

import React from 'react';
import Modal from './Modal';
import { useNotifications } from '../context/NotificationContext';
import { Bell, CheckCheck, Trash2, Clock, CheckCircle, Info, AlertTriangle, AlertCircle } from 'lucide-react';

export default function NotificationsModal({ isOpen, onClose }) {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAllNotifications
  } = useNotifications();

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={16} className="text-emerald-600" />;
      case 'warning':
        return <AlertTriangle size={16} className="text-amber-600" />;
      case 'error':
        return <AlertCircle size={16} className="text-rose-600" />;
      default:
        return <Info size={16} className="text-blue-600" />;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-[#b86b24]" />
          <span>Notifikasi Aktivitas</span>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#faedd9] text-[#b86b24] border border-[#f0d4b0]">
              {unreadCount} baru
            </span>
          )}
        </div>
      }
      maxWidth="550px"
      footer={
        <div className="flex items-center justify-between w-full">
          <button
            type="button"
            disabled={notifications.length === 0}
            onClick={clearAllNotifications}
            className="px-3 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold flex items-center gap-1.5 disabled:opacity-40 transition-colors"
          >
            <Trash2 size={13} />
            <span>Bersihkan</span>
          </button>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="px-3 py-1.5 rounded-xl bg-[#f4efe8] hover:bg-[#eae2d5] text-[#4a3b31] text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <CheckCheck size={14} />
                <span>Tandai Semua Dibaca</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-[#2e1a11] text-white text-xs font-bold hover:bg-[#3f2519] transition-all"
            >
              Tutup
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-[#f4eee4] text-[#a49589] flex items-center justify-center mx-auto mb-3">
              <Bell size={22} />
            </div>
            <h4 className="text-sm font-bold text-[#2d1e16] mb-1">Tidak Ada Notifikasi</h4>
            <p className="text-xs text-[#82746a] max-w-xs mx-auto">
              Aktivitas keranjang belanja, ulasan produk, favorit, dan kode promo akan tercatat otomatis di sini.
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
            {notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => markAsRead(item.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex gap-3 items-start ${
                  !item.read
                    ? 'bg-[#fffaf3] border-[#ecd8bf] shadow-2xs'
                    : 'bg-white border-[#ebe4d8] opacity-80 hover:opacity-100'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-[#f7f2ea] flex items-center justify-center shrink-0 mt-0.5">
                  {getIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <h5 className="text-xs font-bold text-[#2a1a12] truncate">{item.title}</h5>
                    <span className="text-[10px] text-[#938479] shrink-0 flex items-center gap-1">
                      <Clock size={10} /> {item.time || 'Baru'}
                    </span>
                  </div>
                  <p className="text-xs text-[#5f5147] leading-relaxed">{item.message}</p>
                </div>
                {!item.read && (
                  <span className="w-2 h-2 rounded-full bg-[#b86b24] shrink-0 mt-2" title="Belum dibaca" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}

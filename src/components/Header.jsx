import React from 'react';
import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationContext';
import { Coffee, Search, ShoppingBag, Bell, Receipt, X, Sparkles } from 'lucide-react';

export default function Header({
  searchQuery,
  onSearchChange,
  onOpenCart,
  onOpenNotifications,
  onOpenHistory
}) {
  const { totalQuantity, orderHistory } = useCart();
  const { unreadCount } = useNotifications();

  return (
    <header className="sticky top-0 z-40 bg-[#fdfbf7]/90 backdrop-blur-md border-b border-[#eee7dc] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4 sm:gap-6">
        
        {/* Brand Logo & Coffee Shop Identity */}
        <div className="flex items-center gap-3 cursor-pointer group select-none">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#3c2215] to-[#21110a] text-[#f4ecd8] flex items-center justify-center shadow-md shadow-[#3c2215]/20 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-[#3c2215]/30 transition-all duration-300">
            <Coffee size={22} className="text-[#e2a859] transition-transform duration-300 group-hover:rotate-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-2xl tracking-tight text-[#2b1810]">
                Kopi<span className="text-[#c0782f]">Ku</span>
              </span>
              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#eef6ec] text-[#2b7228] border border-[#d2e9cb]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34a832] animate-pulse"></span>
                Buka
              </span>
            </div>
            <p className="text-[11px] font-medium tracking-wide uppercase text-[#87786f]">
              Specialty Coffee & Eatery
            </p>
          </div>
        </div>

        {/* Search Bar - Center */}
        <div className="flex-1 max-w-lg hidden sm:block">
          <div className="relative group">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a8c82] group-focus-within:text-[#c0782f] transition-colors duration-200 pointer-events-none"
            />
            <input
              type="text"
              className="w-full pl-11 pr-10 py-2.5 rounded-full bg-[#f4eee4]/80 hover:bg-[#f4eee4] focus:bg-white text-sm text-[#2c221e] placeholder-[#9c8e84] border border-[#e4dacf] focus:border-[#c0782f] focus:outline-none focus:ring-4 focus:ring-[#c0782f]/10 transition-all duration-200"
              placeholder="Cari kopi nusantara, matcha latte, toast..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label="Cari menu"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#ded4c6] hover:bg-[#cbbfae] text-[#4a3f38] flex items-center justify-center transition-colors duration-150"
                aria-label="Hapus pencarian"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Right Navigation Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Notifications Button */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative w-10 h-10 rounded-full bg-[#f4eee4]/70 hover:bg-[#eae1d3] active:scale-95 text-[#4a3b32] flex items-center justify-center border border-[#e4dacf] transition-all duration-200"
            title="Pusat Notifikasi"
            aria-label="Notifikasi"
          >
            <Bell size={19} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[19px] h-[19px] px-1 rounded-full bg-[#d93829] text-white text-[10px] font-bold flex items-center justify-center shadow-sm animate-bounce">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Orders History Button */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="relative w-10 h-10 rounded-full bg-[#f4eee4]/70 hover:bg-[#eae1d3] active:scale-95 text-[#4a3b32] flex items-center justify-center border border-[#e4dacf] transition-all duration-200"
            title="Riwayat Pesanan & Struk"
            aria-label="Riwayat Transaksi"
          >
            <Receipt size={19} />
            {orderHistory.length > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[19px] h-[19px] px-1 rounded-full bg-[#2a6db5] text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                {orderHistory.length > 9 ? '9+' : orderHistory.length}
              </span>
            )}
          </button>

          {/* Cart Floating / Pill Button */}
          <button
            type="button"
            onClick={onOpenCart}
            className="relative flex items-center gap-2.5 pl-3.5 pr-4 py-2 rounded-full bg-gradient-to-r from-[#382013] to-[#25130b] hover:from-[#2e190e] hover:to-[#1c0e07] active:scale-95 text-[#fdfaf5] font-semibold text-sm shadow-md shadow-[#2b1810]/20 hover:shadow-lg transition-all duration-200"
            title="Buka Keranjang Belanja"
            aria-label="Keranjang Belanja"
          >
            <div className="relative">
              <ShoppingBag size={18} className="text-[#f1b773]" />
              {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-2.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#e29337] text-[#2b1810] text-[10px] font-extrabold flex items-center justify-center ring-2 ring-[#2e190e]">
                  {totalQuantity > 99 ? '99+' : totalQuantity}
                </span>
              )}
            </div>
            <span className="hidden sm:inline tracking-tight font-medium">Keranjang</span>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar View */}
      <div className="px-4 pb-3 sm:hidden">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a8c82]" />
          <input
            type="text"
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#f4eee4]/80 text-sm text-[#2c221e] placeholder-[#9c8e84] border border-[#e4dacf] focus:border-[#c0782f] focus:outline-none"
            placeholder="Cari kopi, pastry, snack..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#665a52]"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

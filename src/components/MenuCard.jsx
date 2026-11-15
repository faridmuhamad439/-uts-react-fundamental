import React from 'react';
import { formatRupiah } from '../utils/pricing';
import StarRating from './StarRating';
import { Heart, Info, MessageCircle, Plus } from 'lucide-react';

export default function MenuCard({
  menu,
  currentStock,
  isFavorite,
  onToggleFavorite,
  onOpenInfo,
  onOpenComment,
  onAddToCart,
  commentCount = 0
}) {
  const stock = currentStock !== undefined ? currentStock : menu.stock;
  const isOutOfStock = stock <= 0;

  return (
    <article className={`menu-card bg-white rounded-3xl border border-[#ebe4d8] overflow-hidden flex flex-col relative group ${isOutOfStock ? 'opacity-85' : ''}`}>
      
      {/* Gambar Menu & Badge Kategori */}
      <div className="relative w-full aspect-[4/3] bg-[#ece5d9] overflow-hidden select-none">
        <img
          src={menu.image}
          alt={menu.name}
          className="menu-card-image w-full h-full object-cover"
          loading="lazy"
        />

        {/* Gradient shadow overlay pada gambar */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

        {/* Badge Kategori Minimalis */}
        <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#1f120a]/75 backdrop-blur-md text-[#f6edd9] border border-white/10 shadow-sm">
          {menu.category}
        </span>

        {/* Tombol Favorit (Suka) */}
        <button
          type="button"
          onClick={() => onToggleFavorite(menu)}
          className={`absolute top-3.5 right-3.5 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
            isFavorite
              ? 'bg-white text-[#d63426] shadow-md shadow-red-500/20'
              : 'bg-black/40 text-white hover:bg-black/60 hover:scale-110 backdrop-blur-md'
          }`}
          aria-label={isFavorite ? 'Hapus dari favorit' : 'Tambah ke favorit'}
          title={isFavorite ? 'Disukai (Ada di Tab Favorit)' : 'Suka menu ini'}
        >
          <Heart
            size={18}
            className={`transition-transform duration-300 ${isFavorite ? 'heart-active-animate' : ''}`}
            fill={isFavorite ? '#e03126' : 'none'}
            color={isFavorite ? '#e03126' : 'currentColor'}
            strokeWidth={isFavorite ? 2.5 : 2}
          />
        </button>

        {/* Overlay Jika Stok Habis */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-[#1e130c]/75 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-4 py-1.5 rounded-full bg-red-600/90 text-white text-xs font-extrabold tracking-widest uppercase shadow-md">
              Habis Terjual
            </span>
          </div>
        )}
      </div>

      {/* Konten Kartu Menu */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating Bintang & Indikator Stok */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5">
              <StarRating rating={menu.rating} size={14} />
              <span className="text-xs font-bold text-[#35251d]">{menu.rating.toFixed(1)}</span>
              {commentCount > 0 && (
                <span className="text-[11px] text-[#8c7f76]">({commentCount})</span>
              )}
            </div>

            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                isOutOfStock
                  ? 'bg-red-50 text-red-600 border-red-200'
                  : stock <= 3
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-[#f4efe8] text-[#6d6056] border-[#e7ded2]'
              }`}
            >
              {isOutOfStock ? 'Kosong' : `Stok: ${stock}`}
            </span>
          </div>

          {/* Judul Menu */}
          <h3 className="font-bold text-base sm:text-lg text-[#261710] leading-snug tracking-tight mb-1 group-hover:text-[#b86b24] transition-colors duration-200 line-clamp-1">
            {menu.name}
          </h3>

          {/* Deskripsi Menu */}
          <p className="text-xs sm:text-[13px] text-[#6c6158] leading-relaxed line-clamp-2 mb-4">
            {menu.description}
          </p>
        </div>

        {/* Footer Kartu: Harga & 3 Tombol Aksi Wajib */}
        <div className="pt-3 border-t border-[#f0eae1] flex items-center justify-between gap-2">
          <div>
            <span className="block text-[10px] uppercase font-bold tracking-wider text-[#9f9389]">
              Harga
            </span>
            <span className="text-base sm:text-lg font-extrabold text-[#261710] tracking-tight">
              {formatRupiah(menu.price)}
            </span>
          </div>

          {/* 3 Tombol Aksi: Info, Komentar, Tambah Keranjang */}
          <div className="flex items-center gap-1.5">
            {/* Tombol Info */}
            <button
              type="button"
              onClick={() => onOpenInfo(menu)}
              className="w-9 h-9 rounded-xl bg-[#f4efe8] hover:bg-[#eae2d5] active:scale-95 text-[#5e5148] hover:text-[#2b1810] flex items-center justify-center border border-[#e4d9cc] transition-all duration-200"
              title="Detail Menu & Ulasan Lengkap"
              aria-label={`Info detail ${menu.name}`}
            >
              <Info size={16} />
            </button>

            {/* Tombol Komentar */}
            <button
              type="button"
              onClick={() => onOpenComment(menu)}
              className="w-9 h-9 rounded-xl bg-[#f4efe8] hover:bg-[#fff6e8] active:scale-95 text-[#5e5148] hover:text-[#b86b24] hover:border-[#f4d9aa] flex items-center justify-center border border-[#e4d9cc] transition-all duration-200"
              title="Tulis Ulasan & Rating"
              aria-label={`Komentari ${menu.name}`}
            >
              <MessageCircle size={16} />
            </button>

            {/* Tombol Add ke Keranjang */}
            <button
              type="button"
              disabled={isOutOfStock}
              onClick={() => onAddToCart(menu)}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#382013] to-[#21110a] hover:from-[#2a170d] hover:to-[#170a04] active:scale-90 text-white flex items-center justify-center shadow-md shadow-[#2b1810]/20 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200"
              title={isOutOfStock ? 'Stok habis' : 'Tambah ke Keranjang'}
              aria-label={`Tambah ${menu.name} ke keranjang`}
            >
              <Plus size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

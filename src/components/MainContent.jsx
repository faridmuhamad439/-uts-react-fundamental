import React, { useState, useMemo } from 'react';
import MenuCard from './MenuCard';
import Modal from './Modal';
import StarRating from './StarRating';
import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationContext';
import { useToast } from '../context/ToastContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { formatRupiah } from '../utils/pricing';
import {
  Heart,
  Info,
  MessageCircle,
  Plus,
  Sparkles,
  ArrowUpDown,
  Coffee,
  CheckCircle,
  AlertCircle,
  Send,
  Star,
  Layers,
  UtensilsCrossed,
  CupSoda,
  Cookie,
  Tag,
  Flame,
  Check
} from 'lucide-react';

const CATEGORIES = ['Semua', 'Kopi', 'Non-Kopi', 'Makanan', 'Snack', 'Favorit'];

const initialCommentsData = {
  1: [
    { id: 'c1', name: 'Rian Pratama', rating: 5, comment: 'Crema tebal, aroma fruity arabikanya terasa autentik!', date: 'Kemarin' },
    { id: 'c2', name: 'Siti Rahma', rating: 4, comment: 'Paling pas dipadukan dengan croissant hangat.', date: '3 hari lalu' }
  ],
  2: [
    { id: 'c3', name: 'Anisa Putri', rating: 5, comment: 'Manis karamelnya seimbang, tekstur susunya velvety banget.', date: '1 hari lalu' }
  ],
  5: [
    { id: 'c4', name: 'Budi Santoso', rating: 5, comment: 'Gula aren organik asli berasa harum dan pekat legit!', date: '2 hari lalu' }
  ],
  10: [
    { id: 'c5', name: 'Farhan Maulana', rating: 5, comment: 'Nasi goreng kampung bumbu rempahnya mantap pol.', date: 'Kemarin' }
  ]
};

export default function MainContent({ menuData, searchQuery, onResetSearch }) {
  const { addToCart, getStock, applyPromo } = useCart();
  const { addNotification } = useNotifications();
  const toast = useToast();

  const [activeCategory, setActiveCategory] = useState('Semua');
  const [sortBy, setSortBy] = useState('default');

  const [favorites, setFavorites] = useLocalStorage('kopiku_favorites', [
    { id: 1, addedAt: Date.now() - 3600000 },
    { id: 5, addedAt: Date.now() - 1800000 }
  ]);

  const [commentsMap, setCommentsMap] = useLocalStorage('kopiku_comments', initialCommentsData);

  const [selectedInfoMenu, setSelectedInfoMenu] = useState(null);
  const [selectedCommentMenu, setSelectedCommentMenu] = useState(null);
  const [commentRating, setCommentRating] = useState(5);
  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentFormError, setCommentFormError] = useState('');
  const [copiedVoucher, setCopiedVoucher] = useState('');

  const isMenuFavorite = (menuId) => favorites.some((f) => f.id === menuId);

  const handleToggleFavorite = (menu) => {
    const isFav = isMenuFavorite(menu.id);
    if (isFav) {
      setFavorites((prev) => prev.filter((f) => f.id !== menu.id));
      toast.info(`${menu.name} dikeluarkan dari tab Favorit`);
      addNotification('Favorit Diperbarui', `${menu.name} dihapus dari daftar favorit Anda.`, 'info');
    } else {
      setFavorites((prev) => [{ id: menu.id, addedAt: Date.now() }, ...prev]);
      toast.success(`${menu.name} masuk ke tab Favorit!`);
      addNotification('Favorit Baru', `Menu ${menu.name} berhasil disimpan ke daftar favorit.`, 'success');
    }
  };

  const handleAddToCart = (menu) => {
    const res = addToCart(menu);
    if (res.success) {
      toast.success(`${menu.name} ditambahkan ke keranjang!`);
      addNotification('Item Ditambahkan', `1x ${menu.name} masuk ke keranjang belanja Anda.`, 'success');
    } else {
      toast.warning(res.reason || 'Batas stok tercapai!');
    }
  };

  const handleQuickApplyPromo = (code) => {
    const res = applyPromo(code);
    setCopiedVoucher(code);
    setTimeout(() => setCopiedVoucher(''), 2500);

    if (res.success) {
      toast.success(`Kupon ${code} berhasil dipasang ke keranjang! Diskon ${res.promo.discountPercent}%`);
      addNotification('Promo Aktif', `Kupon diskon ${code} berhasil diterapkan ke pesanan Anda.`, 'success');
    } else {
      toast.info(`Kode promo: ${code}`);
    }
  };

  const handleOpenInfo = (menu) => setSelectedInfoMenu(menu);

  const handleOpenComment = (menu) => {
    setSelectedCommentMenu(menu);
    setCommentRating(5);
    setCommentText('');
    setCommentAuthor('');
    setCommentFormError('');
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!commentText || commentText.trim().length < 5) {
      setCommentFormError('Ulasan minimal berisi 5 karakter.');
      return;
    }

    const menuId = selectedCommentMenu.id;
    const authorName = commentAuthor.trim() || 'Pelanggan Setia';
    const newComment = {
      id: Date.now() + Math.random().toString(36).substring(2, 6),
      name: authorName,
      rating: commentRating,
      comment: commentText.trim(),
      date: 'Baru saja'
    };

    setCommentsMap((prev) => {
      const existing = prev[menuId] || [];
      return {
        ...prev,
        [menuId]: [newComment, ...existing]
      };
    });

    toast.success('Ulasan Anda telah dipublikasikan!');
    addNotification(
      'Ulasan Diterima',
      `Terima kasih! Ulasan bintang ${commentRating} untuk ${selectedCommentMenu.name} berhasil ditambahkan.`,
      'success'
    );

    setCommentText('');
    setCommentFormError('');
  };

  const categoryCounts = useMemo(() => {
    const counts = {
      Semua: menuData.length,
      Kopi: 0,
      'Non-Kopi': 0,
      Makanan: 0,
      Snack: 0,
      Favorit: favorites.length
    };
    menuData.forEach((item) => {
      if (counts[item.category] !== undefined) {
        counts[item.category] += 1;
      }
    });
    return counts;
  }, [menuData, favorites]);

  const filteredAndSortedMenu = useMemo(() => {
    let result = [...menuData];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
      );
    }

    if (activeCategory === 'Favorit') {
      const favMap = new Map(favorites.map((f) => [f.id, f.addedAt]));
      result = result.filter((item) => favMap.has(item.id));
      result = result.map((item) => ({
        ...item,
        favAddedAt: favMap.get(item.id) || 0
      }));
    } else if (activeCategory !== 'Semua') {
      result = result.filter((item) => item.category === activeCategory);
    }

    result.sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating-desc') return b.rating - a.rating;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'fav-newest' && activeCategory === 'Favorit') {
        return (b.favAddedAt || 0) - (a.favAddedAt || 0);
      }
      if (sortBy === 'fav-oldest' && activeCategory === 'Favorit') {
        return (a.favAddedAt || 0) - (b.favAddedAt || 0);
      }
      return 0;
    });

    return result;
  }, [menuData, searchQuery, activeCategory, favorites, sortBy]);

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'Kopi': return <Coffee size={14} />;
      case 'Non-Kopi': return <CupSoda size={14} />;
      case 'Makanan': return <UtensilsCrossed size={14} />;
      case 'Snack': return <Cookie size={14} />;
      case 'Favorit': return <Heart size={14} />;
      default: return <Layers size={14} />;
    }
  };

  const currentMenuComments = selectedCommentMenu
    ? commentsMap[selectedCommentMenu.id] || []
    : [];

  const currentInfoComments = selectedInfoMenu
    ? commentsMap[selectedInfoMenu.id] || []
    : [];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full">
      
      {/* Hero Atmosphere Banner */}
      <section className="hero-art-card p-6 sm:p-10 mb-8 text-[#f7f2ea]">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-[#f4d2a3] mb-4">
            <Flame size={14} className="text-[#f1aa52]" />
            <span>Seduhan Kopi Nusantara • Segar Setiap Hari</span>
          </div>
          
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight mb-3">
            Cita Rasa Kopi Istimewa, <br className="hidden sm:inline" />
            Teman Terbaik Setiap Suasana.
          </h2>
          
          <p className="text-xs sm:text-sm text-[#e0d6cb] leading-relaxed mb-6 font-normal">
            Biji kopi arabika & robusta pilihan sangrai segar, diracik presisi oleh barista berpengalaman untuk menghadirkan rasa yang kaya dan menenangkan jiwa.
          </p>

          {/* Interactive Coupon Chips */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs text-[#d3c6b8] font-medium mr-1">Voucher Aktif:</span>
            
            {[
              { code: 'UTS25', label: 'Diskon 25%' },
              { code: 'HEMAT10', label: 'Hemat 10%' },
              { code: 'KOPI15', label: 'Spesial Kopi 15%' }
            ].map((v) => (
              <button
                key={v.code}
                type="button"
                onClick={() => handleQuickApplyPromo(v.code)}
                className="voucher-ticket"
                title="Klik untuk pasang voucher ini langsung ke keranjang"
              >
                <Tag size={12} className="text-[#e2a859]" />
                <span className="font-mono text-xs font-bold text-white tracking-wider">{v.code}</span>
                <span className="text-[11px] text-[#f4d2a3] font-medium hidden sm:inline">({v.label})</span>
                {copiedVoucher === v.code && (
                  <Check size={12} className="text-emerald-400 ml-0.5" />
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Toolbar: Category Tabs & Sorting Selector */}
      <section className="bg-white rounded-2xl border border-[#ebe4d8] p-3 sm:p-4 mb-8 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Horizontal Category Pills with Scroll */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none select-none">
          {CATEGORIES.map((cat) => {
            const count = categoryCounts[cat] || 0;
            const isActive = activeCategory === cat;
            const isFav = cat === 'Favorit';

            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setActiveCategory(cat);
                  if (cat !== 'Favorit' && (sortBy === 'fav-newest' || sortBy === 'fav-oldest')) {
                    setSortBy('default');
                  }
                }}
                className={`cat-pill px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shrink-0 ${
                  isActive
                    ? isFav
                      ? 'cat-pill-favorite cat-pill-active'
                      : 'cat-pill-active'
                    : 'cat-pill-inactive'
                }`}
              >
                <span className={isActive ? 'text-[#f5c68d]' : 'text-[#87786f]'}>
                  {getCategoryIcon(cat)}
                </span>
                <span>{cat}</span>
                <span
                  className={`text-[11px] font-bold px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#ded5c7] text-[#4d4037]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center justify-end gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#f0eae1]">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#82746a]">
            <ArrowUpDown size={14} />
            <span>Urutkan:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs sm:text-sm font-medium bg-[#f6f1e8] text-[#34241b] rounded-xl px-3 py-2 border border-[#e5dcce] focus:outline-none focus:border-[#c0782f] cursor-pointer"
            aria-label="Urutkan menu"
          >
            <option value="default">Paling Populer</option>
            {activeCategory === 'Favorit' && (
              <>
                <option value="fav-newest">Favorit Terbaru Ditambahkan</option>
                <option value="fav-oldest">Favorit Terlama Ditambahkan</option>
              </>
            )}
            <option value="price-asc">Harga: Rendah ke Tinggi</option>
            <option value="price-desc">Harga: Tinggi ke Rendah</option>
            <option value="rating-desc">Rating Tertinggi</option>
            <option value="name-asc">Alfabet: A - Z</option>
          </select>
        </div>
      </section>

      {/* Grid Menu Cards */}
      <section>
        {filteredAndSortedMenu.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-[#dcd3c4] p-12 text-center max-w-md mx-auto my-12">
            <div className="w-16 h-16 rounded-full bg-[#f6efe6] text-[#b0a194] flex items-center justify-center mx-auto mb-4">
              <Coffee size={28} />
            </div>
            <h3 className="text-lg font-bold text-[#2d1e16] mb-1">Menu Tidak Ditemukan</h3>
            <p className="text-xs sm:text-sm text-[#7e7168] leading-relaxed mb-4">
              {searchQuery
                ? `Tidak ada sajian yang cocok dengan kata kunci "${searchQuery}". Coba kata kunci lainnya.`
                : activeCategory === 'Favorit'
                ? 'Belum ada menu favorit. Klik ikon hati pada kartu menu untuk memasukkannya ke sini!'
                : 'Belum ada sajian pada kategori ini.'}
            </p>
            {searchQuery && (
              <button
                type="button"
                onClick={onResetSearch}
                className="px-4 py-2 rounded-xl bg-[#2e1a11] text-white text-xs font-semibold hover:bg-[#3f2519] transition-all"
              >
                Hapus Pencarian
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredAndSortedMenu.map((item) => (
              <MenuCard
                key={item.id}
                menu={item}
                currentStock={getStock(item.id, item.stock)}
                isFavorite={isMenuFavorite(item.id)}
                onToggleFavorite={handleToggleFavorite}
                onOpenInfo={handleOpenInfo}
                onOpenComment={handleOpenComment}
                onAddToCart={handleAddToCart}
                commentCount={(commentsMap[item.id] || []).length}
              />
            ))}
          </div>
        )}
      </section>

      {/* POPUP 1: INFO DETAIL MENU */}
      {selectedInfoMenu && (
        <Modal
          isOpen={Boolean(selectedInfoMenu)}
          onClose={() => setSelectedInfoMenu(null)}
          title={`Detail Menu: ${selectedInfoMenu.name}`}
          maxWidth="600px"
          footer={
            <div className="flex items-center justify-between w-full gap-3">
              <button
                type="button"
                onClick={() => setSelectedInfoMenu(null)}
                className="px-4 py-2.5 rounded-xl border border-[#ded5c7] text-[#55473e] hover:bg-[#f6efe6] text-xs font-bold transition-all"
              >
                Tutup
              </button>
              <button
                type="button"
                disabled={getStock(selectedInfoMenu.id, selectedInfoMenu.stock) <= 0}
                onClick={() => {
                  handleAddToCart(selectedInfoMenu);
                  setSelectedInfoMenu(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#382013] to-[#25130b] hover:from-[#2e190e] hover:to-[#1b0d06] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#2b1810]/20 disabled:opacity-40 transition-all"
              >
                <Plus size={15} />
                <span>Tambah ke Keranjang ({formatRupiah(selectedInfoMenu.price)})</span>
              </button>
            </div>
          }
        >
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
              <img
                src={selectedInfoMenu.image}
                alt={selectedInfoMenu.name}
                className="w-36 h-36 rounded-2xl object-cover shrink-0 border border-[#e7ded2] shadow-sm"
              />
              <div className="flex-1 text-center sm:text-left space-y-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#2e1a11] text-[#f4d2a3]">
                  {selectedInfoMenu.category}
                </span>
                <h4 className="text-xl font-extrabold text-[#24150d] leading-snug">
                  {selectedInfoMenu.name}
                </h4>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <StarRating rating={selectedInfoMenu.rating} size={15} />
                  <span className="text-xs font-bold text-[#35251d]">{selectedInfoMenu.rating.toFixed(1)} / 5.0</span>
                </div>
                <div className="text-2xl font-extrabold text-[#b86b24]">
                  {formatRupiah(selectedInfoMenu.price)}
                </div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#f4efe8] text-[#55473e] border border-[#e4dacf]">
                    Stok Tersedia: <strong>{getStock(selectedInfoMenu.id, selectedInfoMenu.stock)} porsi</strong>
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#f4efe8] text-[#55473e] border border-[#e4dacf]">
                    Status: {isMenuFavorite(selectedInfoMenu.id) ? 'Favorit' : 'Reguler'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#fbf9f6] p-4 rounded-2xl border border-[#ebe3d6]">
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#928276] mb-1.5">Deskripsi Lengkap</h5>
              <p className="text-xs sm:text-sm text-[#493d35] leading-relaxed">
                {selectedInfoMenu.description}
              </p>
            </div>

            {/* Bagian Ulasan Pelanggan */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-sm font-bold text-[#2d1e16] flex items-center gap-1.5">
                  <MessageCircle size={15} className="text-[#b86b24]" />
                  <span>Ulasan Pelanggan ({currentInfoComments.length})</span>
                </h5>
              </div>

              {currentInfoComments.length === 0 ? (
                <p className="text-xs text-[#8f8278] italic">Belum ada ulasan untuk menu ini.</p>
              ) : (
                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {currentInfoComments.map((c) => (
                    <div key={c.id} className="p-3 rounded-xl bg-[#f7f3ec] border border-[#ebe4d8] text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[#2d1e16]">{c.name}</span>
                        <StarRating rating={c.rating} size={12} />
                      </div>
                      <p className="text-[#55483e] mb-1">{c.comment}</p>
                      <span className="text-[10px] text-[#9c8e83]">{c.date}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* POPUP 2: KOMENTAR & FORM RATING (Wajib) */}
      {selectedCommentMenu && (
        <Modal
          isOpen={Boolean(selectedCommentMenu)}
          onClose={() => setSelectedCommentMenu(null)}
          title={`Ulasan: ${selectedCommentMenu.name}`}
          maxWidth="560px"
          footer={
            <div className="flex justify-end w-full">
              <button
                type="button"
                onClick={() => setSelectedCommentMenu(null)}
                className="px-5 py-2.5 rounded-xl bg-[#2e1a11] text-white text-xs font-bold hover:bg-[#3f2519] transition-all"
              >
                Selesai
              </button>
            </div>
          }
        >
          <div className="space-y-6">
            
            {/* Form Ulasan Baru */}
            <form onSubmit={handleSubmitComment} className="bg-[#fbf9f6] p-4 sm:p-5 rounded-2xl border border-[#ebe3d6] space-y-4">
              <h4 className="text-sm font-bold text-[#2d1e16]">Bagikan Pengalaman Anda</h4>

              {/* Rating Bintang Interaktif */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-[#5a4d44]">Beri Nilai:</span>
                <StarRating
                  rating={commentRating}
                  interactive={true}
                  size={22}
                  onRatingChange={(newVal) => setCommentRating(newVal)}
                />
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#faedda] text-[#a05a18] border border-[#f0d4b0]">
                  {commentRating} Bintang
                </span>
              </div>

              {/* Nama Pengulas */}
              <div>
                <label className="block text-xs font-semibold text-[#5a4d44] mb-1" htmlFor="comment-author">
                  Nama Anda (Opsional)
                </label>
                <input
                  id="comment-author"
                  type="text"
                  placeholder="Contoh: Sarah Wijaya"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#ded5c7] text-xs text-[#2c221e] focus:outline-none focus:border-[#c0782f]"
                />
              </div>

              {/* Isi Komentar (Minimal 5 Karakter Sesuai Ketentuan) */}
              <div>
                <label className="block text-xs font-semibold text-[#5a4d44] mb-1" htmlFor="comment-text">
                  Komentar <span className="text-red-500">*</span> (Minimal 5 karakter)
                </label>
                <textarea
                  id="comment-text"
                  rows={3}
                  placeholder="Ceritakan rasa, kesegaran, atau aroma sajian ini..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#ded5c7] text-xs text-[#2c221e] focus:outline-none focus:border-[#c0782f]"
                />
                <div className="flex justify-between items-center mt-1">
                  {commentFormError ? (
                    <span className="text-[11px] font-semibold text-red-600 flex items-center gap-1">
                      <AlertCircle size={12} /> {commentFormError}
                    </span>
                  ) : <span />}
                  <span className={`text-[11px] font-medium ${commentText.length < 5 ? 'text-amber-700' : 'text-emerald-700'}`}>
                    {commentText.length} karakter (min. 5)
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#382013] to-[#25130b] text-white text-xs font-bold flex items-center gap-2 hover:shadow-md transition-all active:scale-95"
              >
                <Send size={13} />
                <span>Kirim Ulasan Sekarang</span>
              </button>
            </form>

            {/* List Ulasan Masuk (Terbaru di Paling Atas) */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#928276] mb-3">
                Daftar Ulasan Masuk ({currentMenuComments.length})
              </h4>

              {currentMenuComments.length === 0 ? (
                <div className="text-center py-6 text-xs text-[#8f8278] bg-[#fbf9f6] rounded-2xl border border-dashed border-[#ded5c7]">
                  Belum ada komentar untuk menu ini. Jadilah yang pertama memberikan review!
                </div>
              ) : (
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {currentMenuComments.map((c) => (
                    <div key={c.id} className="p-3.5 rounded-xl bg-white border border-[#ebe4d8] shadow-2xs text-xs">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#2d1e16]">{c.name}</span>
                          <span className="text-[10px] text-[#9c8e83]">{c.date}</span>
                        </div>
                        <StarRating rating={c.rating} size={12} />
                      </div>
                      <p className="text-[#55483e] leading-relaxed">{c.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </main>
  );
}

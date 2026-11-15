import React from 'react';
import { Coffee, Heart, MapPin, Phone, Mail, Clock, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#24140b] text-[#ebdccf] border-t border-[#3a2215] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Kolom 1: Profil Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#3c2215] text-[#e2a859] flex items-center justify-center border border-[#52301f]">
                <Coffee size={20} />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Kopi<span className="text-[#e2a859]">Ku</span>
              </span>
            </div>
            <p className="text-xs text-[#c4b3a4] leading-relaxed">
              Ruang hangat menyajikan racikan biji kopi terbaik Nusantara dengan sentuhan modern untuk menemani produktivitas Anda setiap hari.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold text-[#f4d2a3]">
              <ShieldCheck size={14} className="text-[#38a169]" />
              <span>UTS React Fundamental 2026 — Farid</span>
            </div>
          </div>

          {/* Kolom 2: Jam Operasional */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Jam Operasional
            </h4>
            <ul className="space-y-2 text-xs text-[#c4b3a4]">
              <li className="flex items-center gap-2">
                <Clock size={14} className="text-[#e2a859] shrink-0" />
                <span>Senin - Jumat: 08.00 - 22.00 WIB</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock size={14} className="text-[#e2a859] shrink-0" />
                <span>Sabtu - Minggu: 07.00 - 23.00 WIB</span>
              </li>
              <li className="text-[11px] text-[#9b8878] pt-1">
                Layanan pesan antar & dine-in selalu tersedia.
              </li>
            </ul>
          </div>

          {/* Kolom 3: Kontak & Lokasi */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Lokasi & Kontak
            </h4>
            <ul className="space-y-2 text-xs text-[#c4b3a4]">
              <li className="flex items-start gap-2">
                <MapPin size={14} className="text-[#e2a859] shrink-0 mt-0.5" />
                <span>Jl. Kopi Kenangan No. 45, Jakarta Selatan</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-[#e2a859] shrink-0" />
                <span>+62 812-3456-7890</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-[#e2a859] shrink-0" />
                <span>halo@kopiku-utsfarid.id</span>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Voucher Tersedia */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Kupon Hemat Aktif
            </h4>
            <div className="space-y-1.5">
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center text-xs">
                <span className="font-mono font-bold text-[#f4d2a3]">UTS25</span>
                <span className="text-[11px] text-[#c4b3a4]">Diskon 25% Semua Menu</span>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center text-xs">
                <span className="font-mono font-bold text-[#f4d2a3]">HEMAT10</span>
                <span className="text-[11px] text-[#c4b3a4]">Diskon 10% Harian</span>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center text-xs">
                <span className="font-mono font-bold text-[#f4d2a3]">KOPI15</span>
                <span className="text-[11px] text-[#c4b3a4]">Diskon 15% Menu Kopi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#3a2215] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#9a897b]">
          <p>
            &copy; 2026 <strong>KopiKu</strong> — Proyek UTS React Fundamental (uts-farid). Seluruh hak cipta dilindungi.
          </p>
          <p className="flex items-center gap-1.5">
            <span>Dibuat dengan</span>
            <Heart size={13} className="text-red-500 fill-red-500 inline" />
            <span>menggunakan React 19 & Tailwind CSS</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

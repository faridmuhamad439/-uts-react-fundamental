import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import MainContent from './components/MainContent';
import CartDrawer from './components/CartDrawer';
import NotificationsModal from './components/NotificationsModal';
import HistoryModal from './components/HistoryModal';
import { initialMenuData } from './data/menu';
import { ToastProvider } from './context/ToastContext';
import { NotificationProvider } from './context/NotificationContext';
import { CartProvider } from './context/CartContext';

function KopiKuApp() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  return (
    <div className="kopiku-app">
      {/* Header Utama KopiKu */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenNotifications={() => setIsNotifOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      {/* Main Content Utama - Data Menu Diteruskan via Props */}
      <MainContent
        menuData={initialMenuData}
        searchQuery={searchQuery}
        onResetSearch={() => setSearchQuery('')}
      />

      {/* Footer Utama */}
      <Footer />

      {/* Drawer & Modal Popups */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      <NotificationsModal
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <NotificationProvider>
        <CartProvider>
          <KopiKuApp />
        </CartProvider>
      </NotificationProvider>
    </ToastProvider>
  );
}

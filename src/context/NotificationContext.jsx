import React, { createContext, useContext, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useLocalStorage('kopiku_notifications', [
    {
      id: 'init-1',
      title: 'Selamat Datang di KopiKu!',
      message: 'Nikmati diskon spesial dengan kode UTS25, HEMAT10, atau KOPI15 saat checkout.',
      type: 'info',
      time: 'Baru saja',
      timestamp: Date.now() - 60000,
      read: false
    }
  ]);

  const addNotification = useCallback((title, message, type = 'info') => {
    const newNotif = {
      id: Date.now() + Math.random().toString(36).substring(2, 7),
      title,
      message,
      type,
      time: 'Baru saja',
      timestamp: Date.now(),
      read: false
    };

    setNotifications((prev) => [newNotif, ...prev]);
  }, [setNotifications]);

  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, [setNotifications]);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, [setNotifications]);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, [setNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAllNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

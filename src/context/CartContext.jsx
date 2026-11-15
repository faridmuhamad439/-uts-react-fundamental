import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { initialMenuData } from '../data/menu';
import { calculateCartTotals, PROMO_CODES } from '../utils/pricing';

const CartContext = createContext(null);

const STORAGE_KEY_CART = 'kopiku_cart_state';

// Inisialisasi stok awal dari menu.js
const defaultStockMap = initialMenuData.reduce((acc, item) => {
  acc[item.id] = item.stock;
  return acc;
}, {});

const initialCartState = {
  items: [],
  promoCode: '',
  stockMap: defaultStockMap,
  orderHistory: []
};

// Coba load state dari localStorage
function loadSavedCartState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CART);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        items: Array.isArray(parsed.items) ? parsed.items : [],
        promoCode: typeof parsed.promoCode === 'string' ? parsed.promoCode : '',
        stockMap: parsed.stockMap && typeof parsed.stockMap === 'object' ? parsed.stockMap : defaultStockMap,
        orderHistory: Array.isArray(parsed.orderHistory) ? parsed.orderHistory : []
      };
    }
  } catch (e) {
    console.warn('Gagal membaca cart state dari localStorage:', e);
  }
  return initialCartState;
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const item = action.payload;
      const availableStock = state.stockMap[item.id] !== undefined ? state.stockMap[item.id] : item.stock;
      const existingItem = state.items.find((i) => i.id === item.id);
      const currentQtyInCart = existingItem ? existingItem.quantity : 0;

      // Cek apakah kuantitas melebihi stok yang ada
      if (currentQtyInCart + 1 > availableStock) {
        return state;
      }

      let updatedItems;
      if (existingItem) {
        updatedItems = state.items.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        updatedItems = [...state.items, { ...item, quantity: 1 }];
      }

      return {
        ...state,
        items: updatedItems
      };
    }

    case 'INCREASE_QTY': {
      const { id } = action.payload;
      const existingItem = state.items.find((i) => i.id === id);
      if (!existingItem) return state;

      const availableStock = state.stockMap[id] !== undefined ? state.stockMap[id] : 999;
      if (existingItem.quantity + 1 > availableStock) {
        return state;
      }

      return {
        ...state,
        items: state.items.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + 1 } : i
        )
      };
    }

    case 'DECREASE_QTY': {
      const { id } = action.payload;
      const existingItem = state.items.find((i) => i.id === id);
      if (!existingItem) return state;

      if (existingItem.quantity <= 1) {
        return {
          ...state,
          items: state.items.filter((i) => i.id !== id)
        };
      }

      return {
        ...state,
        items: state.items.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity - 1 } : i
        )
      };
    }

    case 'REMOVE_FROM_CART': {
      const { id } = action.payload;
      return {
        ...state,
        items: state.items.filter((i) => i.id !== id)
      };
    }

    case 'APPLY_PROMO': {
      const rawCode = (action.payload.code || '').trim().toUpperCase();
      if (PROMO_CODES[rawCode]) {
        return {
          ...state,
          promoCode: rawCode
        };
      }
      return state;
    }

    case 'REMOVE_PROMO': {
      return {
        ...state,
        promoCode: ''
      };
    }

    case 'CHECKOUT': {
      const { order } = action.payload;
      // Kurangi stok sesuai item yang dibeli
      const newStockMap = { ...state.stockMap };
      state.items.forEach((cartItem) => {
        const cur = newStockMap[cartItem.id] ?? 0;
        newStockMap[cartItem.id] = Math.max(0, cur - cartItem.quantity);
      });

      return {
        ...state,
        items: [],
        promoCode: '',
        stockMap: newStockMap,
        orderHistory: [order, ...state.orderHistory]
      };
    }

    case 'RESET_STOCK_AND_HISTORY': {
      return {
        ...state,
        items: [],
        promoCode: '',
        stockMap: defaultStockMap,
        orderHistory: []
      };
    }

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, null, loadSavedCartState);

  // Simpan state ke localStorage setiap ada perubahan
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(state));
    } catch (e) {
      console.warn('Gagal menyimpan cart state ke localStorage:', e);
    }
  }, [state]);

  const totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const totals = calculateCartTotals(state.items, state.promoCode);

  const addToCart = (item) => {
    const curStock = state.stockMap[item.id] !== undefined ? state.stockMap[item.id] : item.stock;
    const existing = state.items.find((i) => i.id === item.id);
    const inCart = existing ? existing.quantity : 0;

    if (inCart >= curStock) {
      return { success: false, reason: 'Stok sudah mencapai batas maksimal!' };
    }
    dispatch({ type: 'ADD_TO_CART', payload: item });
    return { success: true };
  };

  const increaseQty = (id) => {
    const existing = state.items.find((i) => i.id === id);
    const curStock = state.stockMap[id] !== undefined ? state.stockMap[id] : 999;
    if (existing && existing.quantity >= curStock) {
      return { success: false, reason: 'Jumlah pesanan mencapai stok tersedia!' };
    }
    dispatch({ type: 'INCREASE_QTY', payload: { id } });
    return { success: true };
  };

  const decreaseQty = (id) => {
    dispatch({ type: 'DECREASE_QTY', payload: { id } });
  };

  const removeFromCart = (id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { id } });
  };

  const applyPromo = (code) => {
    const cleanCode = (code || '').trim().toUpperCase();
    if (PROMO_CODES[cleanCode]) {
      dispatch({ type: 'APPLY_PROMO', payload: { code: cleanCode } });
      return { success: true, promo: PROMO_CODES[cleanCode] };
    }
    return { success: false, reason: 'Kode promo tidak valid! Gunakan UTS25, HEMAT10, atau KOPI15.' };
  };

  const removePromo = () => {
    dispatch({ type: 'REMOVE_PROMO' });
  };

  const checkoutOrder = (paymentMethod = 'Tunai / Qris') => {
    if (state.items.length === 0) {
      return { success: false, reason: 'Keranjang belanja masih kosong!' };
    }

    const orderId = `KPK-${Date.now().toString().slice(-6)}`;
    const newOrder = {
      orderId,
      date: new Date().toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }),
      timestamp: Date.now(),
      items: [...state.items],
      paymentMethod,
      totals: { ...totals }
    };

    dispatch({ type: 'CHECKOUT', payload: { order: newOrder } });
    return { success: true, order: newOrder };
  };

  const resetStockAndHistory = () => {
    dispatch({ type: 'RESET_STOCK_AND_HISTORY' });
  };

  const getStock = (id, originalStock) => {
    return state.stockMap[id] !== undefined ? state.stockMap[id] : originalStock;
  };

  const value = {
    items: state.items,
    promoCode: state.promoCode,
    orderHistory: state.orderHistory,
    totalQuantity,
    totals,
    addToCart,
    increaseQty,
    decreaseQty,
    removeFromCart,
    applyPromo,
    removePromo,
    checkoutOrder,
    resetStockAndHistory,
    getStock
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

import React, { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { cartReducer, getCartTotals } from './cartReducer';
import { storage } from '../services/storage';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

const initialState = {
  items: []
};

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [hydrated, setHydrated] = useState(false);
  const persistTimer = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    storage
      .getJSON('cart', initialState)
      .then((savedCart) => {
        dispatch({ type: 'HYDRATE', payload: savedCart });
        setHydrated(true);
      })
      .catch(() => setHydrated(true));
  }, []);

  // Clear in-memory cart when user logs out to prevent cross-user contamination
  const prevUser = useRef(user);
  useEffect(() => {
    if (prevUser.current && !user) {
      dispatch({ type: 'CLEAR_CART' });
    }
    prevUser.current = user;
  }, [user]);

  // Debounced persistence to AsyncStorage
  useEffect(() => {
    if (!hydrated) return;
    if (persistTimer.current) clearTimeout(persistTimer.current);
    persistTimer.current = setTimeout(() => {
      storage.setJSON('cart', state);
    }, 500);
    return () => {
      if (persistTimer.current) clearTimeout(persistTimer.current);
    };
  }, [hydrated, state]);

  const totals = getCartTotals(state.items);

  const value = useMemo(
    () => ({
      items: state.items,
      count: totals.count,
      total: totals.total,
      hydrated,
      addItem: (product) => dispatch({ type: 'ADD_ITEM', payload: product }),
      removeItem: (productId) => dispatch({ type: 'REMOVE_ITEM', payload: productId }),
      updateQuantity: (productId, quantity) =>
        dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } }),
      clearCart: () => dispatch({ type: 'CLEAR_CART' })
    }),
    [state.items, totals.count, totals.total, hydrated]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }

  return context;
}

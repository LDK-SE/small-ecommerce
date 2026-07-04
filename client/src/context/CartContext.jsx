import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { cartReducer, getCartTotals } from './cartReducer.js';

const CartContext = createContext(null);

const initialState = {
  items: []
};

function loadCart() {
  try {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : initialState;
  } catch {
    localStorage.removeItem('cart');
    return initialState;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState, loadCart);

  useEffect(() => {
    // Persist cart changes across refreshes without requiring a backend cart model.
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  const totals = getCartTotals(state.items);

  const value = useMemo(
    () => ({
      items: state.items,
      count: totals.count,
      total: totals.total,
      addItem: (product) => dispatch({ type: 'ADD_ITEM', payload: product }),
      removeItem: (productId) => dispatch({ type: 'REMOVE_ITEM', payload: productId }),
      updateQuantity: (productId, quantity) =>
        dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } }),
      clearCart: () => dispatch({ type: 'CLEAR_CART' })
    }),
    [state.items, totals.count, totals.total]
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

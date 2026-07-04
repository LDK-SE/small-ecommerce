export function getCartTotals(items) {
  return items.reduce(
    (totals, item) => {
      const quantity = Math.max(Number(item.quantity) || 0, 0);
      const subtotal = item.price * quantity;

      return {
        count: totals.count + quantity,
        total: totals.total + subtotal
      };
    },
    { count: 0, total: 0 }
  );
}

export function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const incoming = action.payload;
      const existing = state.items.find((item) => item._id === incoming._id);

      if (existing) {
        const addQty = Math.max(Number(incoming.quantity) || 1, 1);
        return {
          ...state,
          items: state.items.map((item) =>
            item._id === incoming._id
              ? { ...item, quantity: Math.min(item.quantity + addQty, item.stock) }
              : item
          )
        };
      }

      return {
        ...state,
        items: [...state.items, { ...incoming, quantity: incoming.quantity || 1 }]
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item._id !== action.payload)
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map((item) =>
          item._id === action.payload.productId
            ? {
                ...item,
                quantity: Math.min(Math.max(Number(action.payload.quantity) || 1, 1), item.stock)
              }
            : item
        )
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };
    default:
      return state;
  }
}

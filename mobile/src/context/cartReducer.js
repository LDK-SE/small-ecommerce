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

function getItemId(item) {
  return item.productId || item._id;
}

export function cartReducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return action.payload || state;
    case 'ADD_ITEM': {
      const incoming = action.payload;
      const incomingId = incoming.productId || incoming._id;
      const existing = state.items.find((item) => getItemId(item) === incomingId);

      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            getItemId(item) === incomingId
              ? { ...item, quantity: Math.min(item.quantity + 1, item.stock) }
              : item
          )
        };
      }

      return {
        ...state,
        items: [...state.items, { ...incoming, quantity: 1 }]
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => getItemId(item) !== action.payload)
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map((item) =>
          getItemId(item) === action.payload.productId
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

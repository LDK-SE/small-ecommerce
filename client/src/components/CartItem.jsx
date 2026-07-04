import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { formatPrice } from '../utils/formatPrice.js';

export default function CartItem({ item }) {
  const { removeItem, updateQuantity } = useCart();
  const subtotal = item.price * item.quantity;
  const productLink = `/products/${item.productId || item._id}`;

  return (
    <div className="surface-card grid gap-4 p-4 sm:grid-cols-[96px_1fr_auto] sm:items-center">
      <Link to={productLink} className="aspect-square overflow-hidden rounded-md bg-surface-soft">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.src =
              'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=500&q=80';
          }}
        />
      </Link>

      <div>
        <Link to={productLink} className="font-semibold text-heading hover:text-brand-700">
          {item.name}
        </Link>
        <p className="mt-1 text-sm text-body">{formatPrice(item.price)} / 件</p>
        <p className="mt-1 text-sm text-body">库存 {item.stock}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:justify-end">
        <input
          type="number"
          min="1"
          max={item.stock}
          value={item.quantity}
          onChange={(event) => updateQuantity(item._id, event.target.value)}
          aria-label={`${item.name} 数量`}
          className="w-20 rounded-md border border-theme bg-surface-raised px-3 py-2 text-sm text-body"
        />
        <p className="price-text min-w-24 text-right font-bold">{formatPrice(subtotal)}</p>
        <button
          type="button"
          onClick={() => removeItem(item._id)}
          className="tap-target rounded-md border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
        >
          删除
        </button>
      </div>
    </div>
  );
}

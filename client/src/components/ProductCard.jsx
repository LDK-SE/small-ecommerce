import { useId } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { toast } from './Toast.tsx';
import { formatPrice } from '../utils/formatPrice.js';

function StarRating({ rating }) {
  const gradientId = useId();

  if (!rating || rating === 0) return null;

  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} 星`}>
      {Array.from({ length: fullStars }, (_, i) => (
        <svg key={`f${i}`} className="star-filled h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
        </svg>
      ))}
      {hasHalf && (
        <svg className="star-half h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
          <defs>
            <linearGradient id={gradientId}>
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="var(--color-border)" />
            </linearGradient>
          </defs>
          <path fill={`url(#${gradientId})`} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
        </svg>
      )}
      {Array.from({ length: emptyStars }, (_, i) => (
        <svg key={`e${i}`} className="star-empty h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
        </svg>
      ))}
    </span>
  );
}

function TagBadge({ tag }) {
  const className =
    tag === '热销'
      ? 'badge-tag badge-hot'
      : tag === '新品'
        ? 'badge-tag badge-new'
        : tag === '推荐'
          ? 'badge-tag badge-recommend'
          : 'badge-tag badge-discount';

  return <span className={className}>{tag}</span>;
}

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const isOutOfStock = product.stock <= 0;
  const hasDiscount = product.discount > 0;
  const discountedPrice = hasDiscount ? product.price * (1 - product.discount / 100) : product.price;
  const tags = Array.isArray(product.tags) ? product.tags : [];

  const handleAddToCart = () => {
    addItem({ ...product, price: discountedPrice, originalPrice: product.price });
    toast.success('已加入购物车', { action: '去结算', onAction: () => navigate('/cart') });
  };

  return (
    <article className="surface-card group flex h-full flex-col overflow-hidden transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link to={`/products/${product._id}`} className="relative block aspect-[4/3] overflow-hidden bg-surface-soft">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          onError={(event) => {
            const fallbacks = [
              'photo-1556742049-0cfed4f6a45d',
              'photo-1542291026-7eec264c27ff',
              'photo-1523275335684-37898b6baf30',
              'photo-1505740420928-5e560c06d30e',
              'photo-1555041469-a586c61ea9bc',
              'photo-1572635196237-14b3f281503f',
              'photo-1491553895911-0055eca6402d',
              'photo-1560343090-f0409e92791a'
            ];
            const hash = product.name.split('').reduce((s, c) => s + c.charCodeAt(0), 0);
            const id = fallbacks[hash % fallbacks.length];
            event.currentTarget.src = `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;
          }}
        />

        {/* Tag badges */}
        {tags.length > 0 && (
          <div className="absolute left-2 top-2 flex flex-wrap gap-1">
            {tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        )}

        {/* Discount badge */}
        {hasDiscount && (
          <div className="absolute right-2 top-2 rounded-full bg-red-600 dark:bg-red-700 px-2 py-0.5 text-xs font-bold text-white">
            -{product.discount}%
          </div>
        )}

        {/* Sold out overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/50">
            <span className="rounded-md bg-white/90 px-3 py-1 text-sm font-bold text-heading dark:bg-slate-800/90">已售罄</span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div>
          <p className="text-xs font-semibold text-brand-700">{product.category}</p>
          <Link
            to={`/products/${product._id}`}
            className="mt-1 block font-bold text-heading hover:text-brand-700 transition-colors"
          >
            {product.name}
          </Link>
        </div>

        {/* Star rating */}
        <div className="flex items-center gap-1.5">
          <StarRating rating={product.averageRating || 0} />
          {(product.reviewCount || 0) > 0 && (
            <span className="text-xs text-body">({product.reviewCount})</span>
          )}
        </div>

        <p className="line-clamp-2 flex-1 text-sm text-body">{product.description}</p>

        <div className="flex items-end justify-between gap-3">
          <div>
            {hasDiscount ? (
              <div>
                <span className="text-sm text-body line-through">{formatPrice(product.price)}</span>
                <p className="price-text text-xl font-black">{formatPrice(discountedPrice)}</p>
              </div>
            ) : (
              <p className="price-text text-xl font-black">{formatPrice(product.price)}</p>
            )}
            <p className="flex items-center gap-1 text-xs">
              {isOutOfStock ? (
                <span className="flex items-center gap-1 text-red-500 dark:text-red-400">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500 dark:bg-red-400" />
                  暂时售罄
                </span>
              ) : product.stock <= 50 ? (
                <span className="flex items-center gap-1 text-orange-500 dark:text-orange-400">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-orange-500 dark:bg-orange-400" />
                  仅剩 {product.stock} 件
                </span>
              ) : (
                <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-600 dark:bg-green-400" />
                  库存充足
                </span>
              )}
            </p>
          </div>

          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className="tap-target rounded-md bg-brand-600 px-3 py-2 text-sm font-bold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700 dark:disabled:text-slate-500"
          >
            加购
          </button>
        </div>
      </div>
    </article>
  );
}

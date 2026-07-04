import React, { useMemo, useState } from 'react';
import { formatPrice } from '../utils/formatPrice.js';

type Product = {
  _id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: string;
};

type Sku = {
  id: string;
  label: string;
  price: number;
  stock: number;
  imageUrl: string;
};

type ProductGallerySkuProps = {
  product: Product & { images?: string[]; skus?: Sku[] };
  onAddToCart: (item: Product & { productId?: string; selectedSku?: string; quantity?: number }) => void;
};

const categoryFallbacks: Record<string, string[]> = {
  数码家电: [
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1512499617640-c2f999098c01?auto=format&fit=crop&w=900&q=80'
  ],
  家居生活: [
    'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=80'
  ]
};

export default function ProductGallerySku({ product, onAddToCart }: ProductGallerySkuProps) {
  const images = useMemo(
    () => Array.from(new Set([product.imageUrl, ...(product.images || []), ...(categoryFallbacks[product.category] || [])])),
    [product]
  );
  const skus = useMemo(
    () =>
      product.skus && product.skus.length > 0
        ? product.skus
        : [
            {
              id: 'default',
              label: '标准款',
              price: product.price,
              stock: product.stock,
              imageUrl: product.imageUrl
            }
          ],
    [product]
  );
  const [activeImage, setActiveImage] = useState(images[0]);
  const [activeSkuId, setActiveSkuId] = useState(skus[0]?.id || '');
  const [quantity, setQuantity] = useState(1);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const selectedSku = skus.find((sku) => sku.id === activeSkuId);
  const currentStock = selectedSku?.stock || 0;
  const currentPrice = selectedSku?.price || product.price;

  const add = () => {
    if (!selectedSku || currentStock <= 0) return;
    onAddToCart({
      ...product,
      productId: product._id,
      _id: `${product._id}:${selectedSku.id}`,
      name: `${product.name} - ${selectedSku.label}`,
      imageUrl: selectedSku.imageUrl || activeImage,
      price: currentPrice,
      stock: currentStock,
      selectedSku: selectedSku.label,
      quantity
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
      <div className="grid gap-3 sm:grid-cols-[84px_1fr]">
        <div className="order-2 flex gap-2 overflow-x-auto sm:order-1 sm:flex-col">
          {images.map((image) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveImage(image)}
              className={`h-20 w-20 shrink-0 overflow-hidden rounded-md border ${
                activeImage === image ? 'border-brand-600' : 'border-theme'
              }`}
              aria-label="切换商品图片"
            >
              <img src={image} alt="" className="h-full w-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
        <div
          className="group relative order-1 overflow-hidden rounded-lg bg-surface-soft sm:order-2"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setZoomPos({
              x: ((e.clientX - rect.left) / rect.width) * 100,
              y: ((e.clientY - rect.top) / rect.height) * 100
            });
          }}
        >
          <img src={activeImage} alt={product.name} className="aspect-[4/3] w-full object-cover" />
          <div
            className="pointer-events-none absolute inset-0 hidden bg-no-repeat opacity-0 transition-opacity duration-200 group-hover:opacity-100 lg:block"
            style={{
              backgroundImage: `url(${encodeURI(activeImage)})`,
              backgroundSize: '200%',
              backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`
            }}
          />
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <p className="text-sm font-semibold text-brand-700">{product.category}</p>
          <h1 className="mt-2 text-3xl font-bold text-heading">{product.name}</h1>
        </div>

        <div className="rounded-lg bg-orange-50 p-4 dark:bg-orange-900/20">
          <p className="text-sm text-body">到手价</p>
          <p className="price-text mt-1 text-3xl font-black transition-all">{formatPrice(currentPrice)}</p>
        </div>

        <div>
          <p className="text-sm font-semibold text-heading">选择规格</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {skus.map((sku) => {
              const disabled = sku.stock <= 0;
              return (
                <button
                  key={sku.id}
                  type="button"
                  disabled={disabled}
                  title={disabled ? '该规格已售罄' : sku.label}
                  onClick={() => {
                    setActiveSkuId(sku.id);
                    setActiveImage(sku.imageUrl || activeImage);
                    setQuantity(1);
                  }}
                  className={`min-h-11 rounded-md border px-4 py-2 text-sm font-medium ${
                    activeSkuId === sku.id ? 'border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400' : 'border-theme'
                  } disabled:cursor-not-allowed disabled:bg-surface-soft disabled:text-body disabled:line-through`}
                >
                  {sku.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-theme p-3">
          <div>
            <p className="text-sm font-medium text-heading">库存</p>
            <p className="text-sm text-body">
              {currentStock > 100 ? '库存充足' : currentStock > 0 ? `仅剩 ${currentStock} 件` : '已售罄'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={quantity <= 1}
              onClick={() => setQuantity((current) => Math.max(1, current - 1))}
              className="min-h-11 min-w-11 rounded-md border border-theme text-lg disabled:opacity-40"
            >
              -
            </button>
            <span className="min-w-10 text-center font-semibold">{quantity}</span>
            <button
              type="button"
              disabled={quantity >= currentStock}
              onClick={() => setQuantity((current) => Math.min(currentStock, current + 1))}
              className="min-h-11 min-w-11 rounded-md border border-theme text-lg disabled:opacity-40"
            >
              +
            </button>
          </div>
        </div>

        <button
          type="button"
          disabled={!selectedSku || currentStock <= 0}
          onClick={add}
          className="tap-target w-full rounded-md bg-brand-600 px-4 py-3 text-sm font-bold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700 dark:disabled:text-slate-500"
        >
          {!selectedSku ? '请选择规格' : currentStock <= 0 ? '已售罄' : '加入购物车'}
        </button>
      </div>
    </div>
  );
}

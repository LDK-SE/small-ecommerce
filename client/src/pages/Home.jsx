import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { ProductGridSkeleton } from '../components/Skeleton.jsx';
import { api } from '../services/api.js';
import usePageMeta from '../hooks/usePageMeta.js';
import { formatPrice } from '../utils/formatPrice.js';
import { toast } from '../components/Toast.tsx';

const banners = [
  {
    title: '悦购商城',
    subtitle: '精选数码、家居、服饰和个护好物，支持浏览、加购、下单、模拟支付和订单追踪。',
    image: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: '好价商品，即刻开逛',
    subtitle: '合理价格、真实库存、清晰分类，适合你继续扩展成完整电商项目。',
    image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=1200&q=80'
  }
];

const features = [
  { emoji: '🚚', title: '满200免运费', desc: '全场满额即享免邮' },
  { emoji: '🔄', title: '7天无理由退换', desc: '收到商品7日内可退' },
  { emoji: '🛡️', title: '品质保证', desc: '正品保障售后无忧' }
];

const categoryIcons = {
  '数码家电': '📱',
  '服饰鞋包': '👗',
  '家居生活': '🏠',
  '运动户外': '⚽',
  '美妆个护': '💄',
  '母婴宠物': '👶',
  '食品饮品': '🍜',
  '办公学习': '📚'
};

export default function Home() {
  usePageMeta(
    '悦购商城 | 数码家居服饰好物在线选购',
    '悦购商城提供商品浏览、分类筛选、购物车、模拟支付、评价和订单管理，适合小型电商网站演示与扩展。'
  );

  const [products, setProducts] = useState([]);
  const [hotProducts, setHotProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [categories, setCategories] = useState([]);
  const [activeBanner, setActiveBanner] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [hotLoading, setHotLoading] = useState(true);

  useEffect(() => {
    api
      .getProducts({ limit: 8 })
      .then((data) => {
        setProducts(data.products || []);
        setCategories(data.categories || []);
        setTotalProducts(data.total || 0);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    api
      .getProducts({ limit: 8, sort: 'stock_desc' })
      .then((data) => setHotProducts(data.products || []))
      .catch(() => setHotProducts([]))
      .finally(() => setHotLoading(false));
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveBanner((current) => (current + 1) % banners.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, []);

  const totalStock = useMemo(
    () => products.reduce((sum, product) => sum + (Number.isFinite(product.stock) ? product.stock : 0), 0),
    [products]
  );
  const lowestPrice = useMemo(
    () => products.reduce((min, product) => Math.min(min, Number.isFinite(product.price) ? product.price : min), Number.POSITIVE_INFINITY),
    [products]
  );

  const banner = banners[activeBanner];

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-lg bg-slate-950 text-white shadow-sm">
        <img src={banner.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 to-slate-950/20" />
        <div className="relative grid gap-6 p-6 md:grid-cols-[1.1fr_0.9fr] md:p-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-orange-100">精选好物 · 快速下单 · 订单可追踪</p>
            <h1 className="mt-3 text-3xl font-black sm:text-5xl">{banner.title}</h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-100">{banner.subtitle}</p>
            <Link
              to="/products"
              className="tap-target mt-6 inline-flex items-center rounded-md bg-orange-500 px-6 py-3.5 text-base font-bold text-white hover:bg-orange-600 shadow-lg shadow-orange-500/25"
            >
              立即选购
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3 self-end rounded-lg bg-white/90 p-4 text-heading backdrop-blur dark:bg-slate-800/90">
            <div>
              <p className="text-2xl font-bold">{totalProducts}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">在售商品</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{categories.length}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">覆盖品类</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{Number.isFinite(lowestPrice) ? formatPrice(lowestPrice) : '-'}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">入手低价</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="grid gap-4 sm:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className="surface-card flex items-center gap-3 p-4 sm:p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-surface-soft text-xl">
              {feature.emoji}
            </span>
            <div>
              <p className="font-bold text-heading text-sm">{feature.title}</p>
              <p className="text-xs text-body">{feature.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Category Grid */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-heading">浏览品类</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category}
              to={`/products?category=${encodeURIComponent(category)}`}
              className="surface-card group flex items-center gap-3 p-4 font-semibold text-heading hover:border-brand-600 hover:text-brand-700 transition-colors"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">
                {categoryIcons[category] || '🛍️'}
              </span>
              {category}
            </Link>
          ))}
        </div>
      </section>

      {/* Today's Picks */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-heading">今日推荐</h2>
            <p className="text-sm text-body">为你精选 8 款好物，价格覆盖日用到高客单商品。</p>
          </div>
          <Link to="/products" className="text-sm font-medium text-brand-700 hover:text-brand-600">
            查看全部
          </Link>
        </div>

        {loading && <ProductGridSkeleton count={8} />}
        {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{error}</p>}
        {!loading && !error && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Hot Picks */}
      {hotProducts.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-heading">热销推荐</h2>
              <p className="text-sm text-body">库存充足的优质好物，最受欢迎的商品都在这里。</p>
            </div>
            <Link to="/products?sort=stock_desc" className="text-sm font-medium text-brand-700 hover:text-brand-600">
              更多热销
            </Link>
          </div>

          {hotLoading && <ProductGridSkeleton count={4} />}
          {!hotLoading && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {hotProducts.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="surface-card rounded-lg p-8 text-center">
        <h2 className="text-xl font-bold text-heading">订阅最新优惠</h2>
        <p className="mt-2 text-sm text-body">演示功能，提交后仅显示成功提示，不会存储邮箱。</p>
        <form
          className="mt-4 mx-auto flex max-w-md gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const input = e.target.elements.email;
            if (!input.value.trim() || !input.checkValidity()) {
              toast.error('请输入有效的邮箱地址。');
              return;
            }
            toast.success('感谢订阅！');
            input.value = '';
          }}
        >
          <input
            name="email"
            type="email"
            required
            placeholder="输入您的邮箱"
            className="flex-1 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2 text-sm outline-none focus:border-brand-600"
          />
          <button
            type="submit"
            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-700"
          >
            订阅
          </button>
        </form>
      </section>
    </div>
  );
}

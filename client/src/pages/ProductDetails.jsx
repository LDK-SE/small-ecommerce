import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import ProductGallerySku from '../components/ProductGallerySku.tsx';
import { ProductDetailSkeleton } from '../components/Skeleton.jsx';
import { toast } from '../components/Toast.tsx';
import { api } from '../services/api.js';
import usePageMeta from '../hooks/usePageMeta.js';
import useStructuredData from '../hooks/useStructuredData.js';
import { trackEvent } from '../services/analytics.js';

const trustItems = [
  ['安全支付', '当前为模拟支付流程，不在前端保存真实支付信息。'],
  ['7 天无忧', '符合条件的未使用商品可在 7 天内申请售后。'],
  ['品质筛选', '商品上架前统一维护图片、价格、库存和分类信息。']
];

const faqs = [
  ['多久发货？', '模拟支付完成后订单会进入已完成状态，真实项目可接入物流发货节点。'],
  ['可以退换吗？', '符合条件的商品可在 7 天内申请退换，具体规则可在页脚政策页查看。'],
  ['库存是否实时？', '结算时以后端库存为准，前端价格和库存仅用于展示。']
];

export default function ProductDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewMessage, setReviewMessage] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  usePageMeta(
    product ? `${product.name} | 悦购商城商品详情` : '商品详情 | 悦购商城',
    product?.description || '查看商品图片、价格、库存、评价，并加入购物车。'
  );

  useStructuredData(
    'product',
    product && {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      image: product.imageUrl,
      description: product.description,
      category: product.category,
      aggregateRating:
        product.reviewCount > 0
          ? {
              '@type': 'AggregateRating',
              ratingValue: product.averageRating,
              reviewCount: product.reviewCount
            }
          : undefined,
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: 'CNY',
        availability:
          product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
      }
    }
  );

  const loadProduct = () => {
    setLoading(true);
    setError('');
    setProduct(null);
    api
      .getProduct(id)
      .then(setProduct)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  const submitReview = async (event) => {
    event.preventDefault();
    if (reviewSubmitting) return;
    setReviewMessage('');
    setReviewError('');
    setReviewSubmitting(true);

    try {
      await api.createReview(id, reviewForm);
      trackEvent('review_submitted', { productId: id, rating: reviewForm.rating });
      setReviewForm({ rating: 5, comment: '' });
      setReviewMessage('评价已保存。');
      loadProduct();
    } catch (err) {
      setReviewError(err.message);
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) return <ProductDetailSkeleton />;
  if (error && !product) return <p className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{error}</p>;

  return (
    <div className="space-y-6">
      <section className="surface-card p-6">
        <div className="mb-4">
          <Link to="/products" className="text-sm font-semibold text-brand-700 hover:text-brand-600">
            返回商品列表
          </Link>
        </div>
        <ProductGallerySku
          product={product}
          onAddToCart={(item) => {
            addItem(item);
            toast.success('已加入购物车', { action: '去结算', onAction: () => navigate('/cart') });
            trackEvent('add_to_cart', { productId: product._id, name: item.name, price: item.price });
          }}
        />
        <p className="mt-5 leading-7 text-body">{product.description}</p>
        <p className="mt-2 text-sm text-body">
          评分 {product.averageRating || 0} / 5 · {product.reviewCount || 0} 条评价
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {trustItems.map(([title, text]) => (
            <div key={title} className="rounded-md border border-theme bg-surface-soft p-4">
              <p className="font-semibold text-heading">{title}</p>
              <p className="mt-1 text-sm text-body">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="surface-card p-5">
        <h2 className="text-xl font-bold text-heading">常见问题</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {faqs.map(([question, answer]) => (
            <details key={question} className="rounded-md border border-theme p-4">
              <summary className="cursor-pointer font-semibold text-heading">{question}</summary>
              <p className="mt-2 text-sm leading-6 text-body">{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="surface-card p-5">
          <h2 className="text-xl font-bold text-heading">用户评价</h2>
          <div className="mt-4 space-y-3">
            {(product.reviews || []).length === 0 && <p className="text-sm text-body">暂无评价。</p>}
            {(product.reviews || []).map((review) => (
              <div key={review._id} className="rounded-md border border-theme p-3">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-heading">{review.userId?.name || '用户'}</p>
                  <p className="text-sm text-amber-600 dark:text-amber-400" aria-label={`${review.rating} 星`}>{'★'.repeat(review.rating)}</p>
                </div>
                <p className="mt-2 text-sm text-body">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={submitReview} className="surface-card p-5">
          <h2 className="text-lg font-bold text-heading">写评价</h2>
          {!user && <p className="mt-3 text-sm text-body">登录后才能发表评价。</p>}
          <select
            disabled={!user}
            value={reviewForm.rating}
            onChange={(event) => setReviewForm((current) => ({ ...current, rating: Number(event.target.value) }))}
            className="mt-4 w-full rounded-md border border-theme px-3 py-2 text-sm"
          >
            {[5, 4, 3, 2, 1].map((rating) => (
              <option key={rating} value={rating}>
                {rating} 星
              </option>
            ))}
          </select>
          <textarea
            disabled={!user}
            value={reviewForm.comment}
            onChange={(event) => setReviewForm((current) => ({ ...current, comment: event.target.value }))}
            rows="4"
            maxLength={500}
            placeholder="分享你的使用体验（最多 500 字）"
            className="mt-3 w-full rounded-md border border-theme px-3 py-2 text-sm"
          />
          {reviewMessage && <p className="mt-3 rounded-md bg-green-50 p-2 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">{reviewMessage}</p>}
          {reviewError && <p className="mt-3 rounded-md bg-red-50 p-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{reviewError}</p>}
          <button
            disabled={!user || reviewSubmitting}
            className="tap-target mt-3 w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-bold text-white disabled:bg-slate-300 dark:disabled:bg-slate-700 dark:disabled:text-slate-500"
          >
            {reviewSubmitting ? '提交中...' : '提交评价'}
          </button>
        </form>
      </section>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';
import usePageMeta from '../hooks/usePageMeta.js';
import { trackEvent } from '../services/analytics.js';
import { OrderListSkeleton } from '../components/Skeleton.jsx';
import { toast } from '../components/Toast.tsx';
import { formatPrice } from '../utils/formatPrice.js';

const statusText = {
  pending: '待处理',
  completed: '已完成',
  canceled: '已取消'
};

const paymentText = {
  unpaid: '待支付',
  paid: '已支付',
  refunded: '已退款'
};

export default function Orders() {
  usePageMeta(
    '我的订单 | 悦购商城订单追踪',
    '查看历史订单、收货信息、支付状态，并完成模拟支付。'
  );

  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [payingId, setPayingId] = useState(null);

  const loadOrders = () => {
    if (!user) return;
    setLoading(true);
    api
      .getUserOrders(user._id)
      .then((data) => setOrders(data.orders || data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, [user]);

  const payOrder = async (orderId) => {
    setError('');
    setPayingId(orderId);
    const loadingToast = toast.loading('正在处理模拟支付...');
    try {
      await api.payOrder(orderId, 'mock');
      trackEvent('payment_completed', { orderId, method: 'mock' });
      loadOrders();
      loadingToast.update('success', '支付已完成。');
    } catch (err) {
      setError(err.message);
      loadingToast.update('error', err.message || '支付失败。');
    } finally {
      setPayingId(null);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-heading">我的订单</h1>
        <p className="mt-1 text-sm text-body">查看订单历史、支付状态和收货信息。</p>
      </div>

      {loading && <OrderListSkeleton count={3} />}
      {error && (
        <div className="space-y-3">
          <p className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{error}</p>
          <button
            type="button"
            onClick={loadOrders}
            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white"
          >
            重试
          </button>
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <p className="surface-card p-8 text-center text-body">暂无订单。</p>
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <article key={order._id} className="surface-card p-5">
            <div className="flex flex-col gap-2 border-b border-theme pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-heading">订单 #{order._id}</p>
                <p className="mt-1 text-sm text-body">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="w-fit rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-700">
                  {statusText[order.status] || order.status}
                </span>
                <span className="w-fit rounded-full bg-surface-soft px-3 py-1 text-sm font-semibold text-body">
                  {paymentText[order.paymentStatus] || order.paymentStatus}
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {order.shippingAddress && (
                <div className="rounded-md bg-surface-soft p-3 text-sm text-body">
                  <p className="font-medium text-heading">
                    {order.shippingAddress.receiverName} · {order.shippingAddress.phone}
                  </p>
                  <p className="mt-1">{order.shippingAddress.address}</p>
                </div>
              )}
              {order.items.map((item) => (
                <div
                  key={`${order._id}-${item.productId?._id || item.productId}`}
                  className="flex justify-between gap-4 text-sm text-body"
                >
                  <span>
                    {item.productId?.name || '商品'} x {item.quantity}
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-col gap-3 border-t border-theme pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="price-text font-black">合计 {formatPrice(order.totalPrice)}</p>
              {order.paymentStatus !== 'paid' && (
                <button
                  type="button"
                  disabled={payingId === order._id}
                  onClick={() => payOrder(order._id)}
                  className="tap-target rounded-md bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-60"
                >
                  {payingId === order._id ? '支付中...' : '模拟支付'}
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

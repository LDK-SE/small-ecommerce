import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { formatPrice } from '../utils/formatPrice.js';
import usePageMeta from '../hooks/usePageMeta.js';
import { toast } from '../components/Toast.tsx';

const orderStatusOptions = [
  ['pending', '待处理'],
  ['completed', '已完成'],
  ['canceled', '已取消']
];

const paymentStatusOptions = [
  ['unpaid', '待支付'],
  ['paid', '已支付'],
  ['refunded', '已退款']
];

export default function AdminOrders() {
  usePageMeta('订单管理 | 悦购商城后台', '查看和处理所有订单的状态、支付与售后。');

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOrders = () => {
    setLoading(true);
    api.getAllOrders().then((data) => setOrders(data.orders || data)).catch((err) => setError(err.message)).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateOrder = async (orderId, payload) => {
    try {
      await api.updateOrder(orderId, payload);
      loadOrders();
    } catch (err) {
      toast.error(err.message || '更新订单失败。');
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-heading">订单管理</h1>
        <p className="mt-1 text-sm text-body">处理订单状态、支付状态和售后状态。</p>
      </div>
      {loading && <p className="text-body">正在加载订单...</p>}
      {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{error}</p>}
      {!loading && !error && orders.length === 0 && <p className="text-body">暂无订单。</p>}
      <div className="space-y-4">
        {orders.map((order) => (
          <article key={order._id} className="surface-card p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="font-semibold text-heading">订单 #{order._id}</p>
                <p className="mt-1 text-sm text-body">
                  {order.userId?.name} · {order.userId?.email}
                </p>
                <p className="mt-1 text-sm text-body">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <select
                  value={order.status}
                  onChange={(event) => updateOrder(order._id, { status: event.target.value })}
                  className="min-h-11 rounded-md border border-theme bg-surface-raised px-3 py-2 text-sm text-body"
                >
                  {orderStatusOptions.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <select
                  value={order.paymentStatus}
                  onChange={(event) => updateOrder(order._id, { paymentStatus: event.target.value })}
                  className="min-h-11 rounded-md border border-theme bg-surface-raised px-3 py-2 text-sm text-body"
                >
                  {paymentStatusOptions.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <details className="mt-4 rounded-md bg-surface-soft p-3 md:hidden">
              <summary className="cursor-pointer font-semibold text-heading">订单详情</summary>
              <div className="mt-3 space-y-3 text-sm text-body">
                <p>{order.shippingAddress?.receiverName} · {order.shippingAddress?.phone}</p>
                <p>{order.shippingAddress?.address}</p>
                {order.items.map((item) => (
                  <p key={`${order._id}-${item.productId?._id || item.productId}`}>
                    {item.productId?.name || '商品'} x {item.quantity} · {formatPrice(item.price * item.quantity)}
                  </p>
                ))}
                <p className="price-text font-black">合计 {formatPrice(order.totalPrice)}</p>
              </div>
            </details>

            <div className="mt-4 hidden gap-3 md:grid md:grid-cols-2">
              <div className="rounded-md bg-surface-soft p-3 text-sm text-body">
                <p className="font-semibold text-heading">收货信息</p>
                <p>{order.shippingAddress?.receiverName} · {order.shippingAddress?.phone}</p>
                <p>{order.shippingAddress?.address}</p>
              </div>
              <div className="rounded-md bg-surface-soft p-3 text-sm text-body">
                <p className="font-semibold text-heading">商品明细</p>
                {order.items.map((item) => (
                  <p key={`${order._id}-${item.productId?._id || item.productId}`}>
                    {item.productId?.name || '商品'} x {item.quantity} · {formatPrice(item.price * item.quantity)}
                  </p>
                ))}
                <p className="price-text mt-2 font-black">合计 {formatPrice(order.totalPrice)}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

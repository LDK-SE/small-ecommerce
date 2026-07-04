import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api.js';
import usePageMeta from '../hooks/usePageMeta.js';
import { formatPrice } from '../utils/formatPrice.js';

export default function AdminDashboard() {
  usePageMeta('管理看板 | 悦购商城后台', '商城运营数据概览：订单、营收、商品和库存预警。');

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getAdminStats()
      .then(setStats)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-heading">管理看板</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="surface-card animate-pulse p-5">
              <div className="h-4 w-16 rounded bg-surface-soft" />
              <div className="mt-3 h-8 w-24 rounded bg-surface-soft" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) return <p className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{error}</p>;
  if (!stats) return null;

  const cards = [
    { label: '总订单', value: stats.totalOrders, href: '/admin/orders' },
    { label: '总营收', value: formatPrice(stats.totalRevenue), href: '/admin/orders' },
    { label: '商品数量', value: stats.totalProducts, href: '/admin/products' },
    { label: '用户数量', value: stats.totalUsers }
  ];

  const statusBadge = (status) => {
    const map = { pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400', completed: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400', canceled: 'bg-surface-soft text-body' };
    const label = { pending: '待处理', completed: '已完成', canceled: '已取消' };
    return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${map[status] || ''}`}>{label[status] || status}</span>;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-heading">管理看板</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="surface-card p-5">
            <p className="text-sm text-body">{card.label}</p>
            <p className="mt-2 text-2xl font-black text-heading">{card.value}</p>
            {card.href && (
              <Link to={card.href} className="mt-2 inline-block text-sm font-medium text-brand-700 hover:text-brand-600">
                查看详情 →
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="surface-card p-5">
          <h2 className="text-lg font-bold text-heading">订单状态分布</h2>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {Object.entries(stats.orderStats).map(([key, count]) => (
              <div key={key} className="rounded-lg bg-surface-soft p-4 text-center">
                <p className="text-2xl font-bold text-heading">{count}</p>
                <p className="mt-1 text-sm text-body">{key === 'pending' ? '待处理' : key === 'completed' ? '已完成' : '已取消'}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="surface-card p-5">
          <h2 className="text-lg font-bold text-heading">库存预警</h2>
          {stats.lowStockProducts.length === 0 ? (
            <p className="mt-4 text-sm text-body">所有商品库存充足。</p>
          ) : (
            <div className="mt-4 space-y-2">
              {stats.lowStockProducts.map((p) => (
                <div key={p._id} className="flex items-center justify-between rounded-md border border-theme p-3">
                  <span className="text-sm font-medium text-heading">{p.name}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${p.stock === 0 ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'}`}>
                    仅剩 {p.stock} 件
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="surface-card p-5">
        <h2 className="text-lg font-bold text-heading">近期订单</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-theme text-body">
              <tr>
                <th scope="col" className="py-2">订单 ID</th>
                <th scope="col">用户</th>
                <th scope="col">金额</th>
                <th scope="col">状态</th>
                <th scope="col">支付</th>
                <th scope="col">时间</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order) => (
                <tr key={order._id} className="border-b border-theme">
                  <td className="py-3 font-mono text-xs text-body">{order._id.slice(-8)}</td>
                  <td className="font-medium text-heading">{order.userId?.name || '-'}</td>
                  <td>{formatPrice(order.totalPrice)}</td>
                  <td>{statusBadge(order.status)}</td>
                  <td>
                    {order.paymentStatus === 'paid'
                      ? statusBadge('completed')
                      : order.paymentStatus === 'refunded'
                        ? statusBadge('canceled')
                        : statusBadge('pending')}
                  </td>
                  <td className="text-body">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

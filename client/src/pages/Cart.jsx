import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartItem from '../components/CartItem.jsx';
import { toast } from '../components/Toast.tsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import usePageMeta from '../hooks/usePageMeta.js';
import { api } from '../services/api.js';
import { trackEvent } from '../services/analytics.js';
import { formatPrice } from '../utils/formatPrice.js';

const steps = ['购物车', '收货信息', '确认下单'];
const FREE_SHIPPING_THRESHOLD = Number(import.meta.env.VITE_FREE_SHIPPING_THRESHOLD) || 200;

export default function Cart() {
  usePageMeta(
    '购物车与结算 | 悦购商城',
    '检查购物车商品，选择收货地址，确认订单并完成模拟支付。'
  );

  const { user } = useAuth();
  const { items, total, clearCart } = useCart();
  const [step, setStep] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [shippingAddress, setShippingAddress] = useState({
    receiverName: '',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const remainingForFreeShipping = useMemo(
    () => Math.max(0, FREE_SHIPPING_THRESHOLD - total),
    [total]
  );

  useEffect(() => {
    if (!user) return;
    setAddressesLoading(true);
    api.getAddresses().then((data) => {
      setAddresses(data);
      const defaultAddress = data.find((item) => item.isDefault) || data[0];
      if (defaultAddress) {
        setShippingAddress({
          receiverName: defaultAddress.receiverName,
          phone: defaultAddress.phone,
          address: defaultAddress.address
        });
      }
    }).catch((err) => toast.error(err.message || '加载地址失败。')).finally(() => setAddressesLoading(false));
  }, [user]);

  const canContinue = () => {
    if (step === 0) return items.length > 0;
    if (step === 1) return shippingAddress.receiverName && shippingAddress.phone && shippingAddress.address;
    return true;
  };

  const nextStep = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!canContinue()) {
      toast.warning(step === 0 ? '购物车还是空的。' : '请先补全收货信息。');
      return;
    }
    setStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!shippingAddress.receiverName || !shippingAddress.phone || !shippingAddress.address) {
      setStep(1);
      toast.warning('请先补全收货信息。');
      return;
    }

    const loading = toast.loading('正在创建订单...');
    setSubmitting(true);
    setError('');

    try {
      const orderItems = items.map((item) => ({
        productId: item.productId || item._id,
        quantity: item.quantity
      }));

      await api.createOrder(orderItems, shippingAddress);
      trackEvent('checkout_started', { itemCount: items.length, total });
      clearCart();
      loading.update('success', '订单创建成功。', {
        action: '查看订单',
        onAction: () => navigate('/orders')
      });
      setStep(0);
    } catch (err) {
      setError(err.message);
      loading.update('error', err.message || '结算失败。');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <section className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-heading">购物车结算</h1>
          <p className="mt-1 text-sm text-body">检查商品、确认收货信息，然后提交订单。</p>
        </div>

        <div className="surface-card grid gap-2 p-3 sm:grid-cols-3">
          {steps.map((label, index) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                if (index > 0 && !user) {
                  navigate('/login');
                  return;
                }
                setStep(index);
              }}
              className={`tap-target rounded-md px-3 py-2 text-sm font-semibold ${
                step === index ? 'bg-brand-600 text-white' : 'bg-surface-soft text-body'
              }`}
            >
              {index + 1}. {label}
            </button>
          ))}
        </div>

        {step === 0 && (
          <div className="space-y-4">
            {items.length === 0 ? (
              <div className="surface-card p-8 text-center">
                <p className="text-body">购物车还是空的。</p>
                <Link
                  to="/products"
                  className="tap-target mt-4 inline-flex items-center rounded-md bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-700"
                >
                  继续选购
                </Link>
              </div>
            ) : (
              items.map((item) => <CartItem key={item._id} item={item} />)
            )}
          </div>
        )}

        {step === 1 && (
          <div className="surface-card p-5">
            <h2 className="text-lg font-bold text-heading">收货地址</h2>
            {addressesLoading && <p className="mt-4 text-sm text-body">正在加载地址...</p>}
            {!addressesLoading && (
              <>
                {addresses.length > 0 && (
                  <select
                    className="mt-4 w-full rounded-md border border-theme bg-surface-raised px-3 py-2 text-sm text-body"
                    value=""
                    onChange={(event) => {
                      const selected = addresses.find((item) => item._id === event.target.value);
                      if (selected) {
                        setShippingAddress({
                          receiverName: selected.receiverName,
                          phone: selected.phone,
                          address: selected.address
                        });
                      }
                    }}
                    disabled={addressesLoading}
                  >
                    <option value="">选择已保存地址</option>
                    {addresses.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.receiverName} - {item.phone}
                      </option>
                    ))}
                  </select>
                )}

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <input
                    value={shippingAddress.receiverName}
                    onChange={(event) =>
                      setShippingAddress((current) => ({ ...current, receiverName: event.target.value }))
                    }
                    placeholder="收货人"
                    autoComplete="name"
                    className="w-full rounded-md border border-theme bg-surface-raised px-3 py-2 text-sm text-body"
                  />
                  <input
                    value={shippingAddress.phone}
                    onChange={(event) => setShippingAddress((current) => ({ ...current, phone: event.target.value }))}
                    placeholder="手机号"
                    autoComplete="tel"
                    className="w-full rounded-md border border-theme bg-surface-raised px-3 py-2 text-sm text-body"
                  />
                  <textarea
                    value={shippingAddress.address}
                    onChange={(event) =>
                      setShippingAddress((current) => ({ ...current, address: event.target.value }))
                    }
                    placeholder="详细收货地址"
                    rows="3"
                    autoComplete="street-address"
                    className="w-full rounded-md border border-theme bg-surface-raised px-3 py-2 text-sm text-body md:col-span-2"
                  />
                </div>
                <p className="mt-3 text-sm text-body">提示：可以在个人中心维护常用地址，下次结算会更快。</p>
              </>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="surface-card p-5">
            <h2 className="text-lg font-bold text-heading">确认订单</h2>
            <p className="mt-2 text-sm text-body">
              当前演示站使用模拟支付，不会收集或保存真实支付信息。
            </p>
            <div className="mt-4 rounded-md bg-surface-soft p-4 text-sm text-body">
              <p className="font-semibold text-heading">配送至</p>
              <p className="mt-1">
                {shippingAddress.receiverName} · {shippingAddress.phone}
              </p>
              <p>{shippingAddress.address}</p>
            </div>
          </div>
        )}
      </section>

      <aside className="surface-card h-fit p-5">
        <h2 className="text-lg font-bold text-heading">订单摘要</h2>
        <div className="mt-4 space-y-3 text-sm">
          {items.map((item) => (
            <div key={item._id} className="flex justify-between gap-3 text-body">
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        {remainingForFreeShipping > 0 ? (
          <p className="mt-4 rounded-md bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
            再买 {formatPrice(remainingForFreeShipping)} 即可免运费。
          </p>
        ) : (
          <p className="mt-4 rounded-md bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">已满足免运费门槛。</p>
        )}

        <div className="mt-5 flex items-center justify-between border-t border-theme pt-4">
          <span className="font-semibold text-heading">合计</span>
          <span className="price-text text-2xl font-black">{formatPrice(total)}</span>
        </div>

        {error && <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{error}</p>}

        {step < 2 ? (
          <button
            type="button"
            disabled={!canContinue()}
            onClick={nextStep}
            className="tap-target mt-5 w-full rounded-md bg-brand-600 px-4 py-3 text-sm font-bold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700 dark:disabled:text-slate-500"
          >
            继续
          </button>
        ) : (
          <button
            type="button"
            disabled={items.length === 0 || submitting}
            onClick={handleCheckout}
            className="tap-target mt-5 w-full rounded-md bg-brand-600 px-4 py-3 text-sm font-bold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700 dark:disabled:text-slate-500"
          >
            {submitting ? '正在提交...' : user ? '提交订单' : '登录后结算'}
          </button>
        )}
      </aside>
    </div>
  );
}

import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-theme bg-surface-raised">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 text-sm text-body sm:px-6 md:grid-cols-[1.2fr_1fr_1fr] lg:px-8">
        <div>
          <p className="text-base font-bold text-heading">悦购商城</p>
          <p className="mt-2">一个可继续扩展的小型电商网站，覆盖商品浏览、购物车、模拟支付、评价和订单管理。</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {['安全支付', '7 天无忧', '品质筛选'].map((item) => (
              <span key={item} className="rounded-md bg-surface-soft px-3 py-2 text-xs font-semibold text-body">
                {item}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="font-semibold text-heading">客户服务</p>
          <div className="mt-3 grid gap-2">
            <Link to="/policies/shipping" className="tap-target">配送政策</Link>
            <Link to="/policies/returns" className="tap-target">退换与退款</Link>
            <Link to="/policies/support" className="tap-target">联系客服</Link>
          </div>
        </div>
        <div>
          <p className="font-semibold text-heading">商城信息</p>
          <div className="mt-3 grid gap-2">
            <Link to="/policies/about" className="tap-target">关于悦购商城</Link>
            <Link to="/policies/privacy" className="tap-target">隐私政策</Link>
            <Link to="/products" className="tap-target">浏览全部商品</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { Link } from 'react-router-dom';
import usePageMeta from '../hooks/usePageMeta.js';

export default function NotFound() {
  usePageMeta('404 | 悦购商城', '页面未找到，返回首页或浏览全部商品。');

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center text-center">
      <p className="text-sm font-semibold text-brand-700">404</p>
      <h1 className="mt-2 text-3xl font-bold text-heading">页面不存在</h1>
      <p className="mt-3 text-body">页面可能已移动。你可以返回首页、浏览商品，或从页脚联系客服。</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link to="/" className="tap-target rounded-md bg-brand-600 px-4 py-2 text-sm font-bold text-white">
          返回首页
        </Link>
        <Link to="/products" className="tap-target rounded-md border border-theme px-4 py-2 text-sm font-semibold text-body">
          浏览商品
        </Link>
      </div>
    </section>
  );
}


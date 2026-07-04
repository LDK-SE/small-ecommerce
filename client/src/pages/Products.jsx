import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { ProductGridSkeleton } from '../components/Skeleton.jsx';
import SearchBox from '../components/SearchBox.tsx';
import { api } from '../services/api.js';
import usePageMeta from '../hooks/usePageMeta.js';
import { trackEvent } from '../services/analytics.js';

export default function Products() {
  usePageMeta(
    '全部商品 | 悦购商城分类筛选与搜索',
    '在悦购商城按关键词、分类、价格区间和排序方式查找商品，比较库存、价格和详情后加入购物车。'
  );

  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [search, setSearch] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [debouncedMinPrice, setDebouncedMinPrice] = useState('');
  const [debouncedMaxPrice, setDebouncedMaxPrice] = useState('');
  const [categories, setCategories] = useState([]);
  const debounceRef = useRef(null);
  const [popularProducts, setPopularProducts] = useState([]);
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      setDebouncedMinPrice(minPrice);
      setDebouncedMaxPrice(maxPrice);
    }, 400);
    return () => window.clearTimeout(debounceRef.current);
  }, [minPrice, maxPrice]);

  useEffect(() => {
    setLoading(true);
    setError('');

    api
      .getProducts({ page, limit: 12, category, search: submittedSearch, minPrice: debouncedMinPrice, maxPrice: debouncedMaxPrice, sort })
      .then((data) => {
        setProducts(data.products || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
        setCategories(data.categories || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [category, debouncedMaxPrice, debouncedMinPrice, page, sort, submittedSearch]);

  useEffect(() => {
    api.getProducts({ limit: 8 }).then((data) => setPopularProducts(data.products || []));
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    setSubmittedSearch(search);
    trackEvent('search_submitted', { keyword: search, category, minPrice, maxPrice });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-heading">全部商品</h1>
          <p className="mt-1 text-sm text-body">按关键词、品类、价格和库存快速找到合适商品。</p>
        </div>

        <form onSubmit={handleSearch} className="grid gap-3 sm:grid-cols-5">
          <SearchBox
            value={search}
            products={[...products, ...popularProducts]}
            categories={categories}
            onChange={setSearch}
            onSearch={(keyword) => {
              setPage(1);
              setSubmittedSearch(keyword);
              trackEvent('search_submitted', { keyword, category, minPrice, maxPrice });
            }}
          />
          <select
            value={category}
            onChange={(event) => {
              setCategory(event.target.value);
              setPage(1);
            }}
            className="min-h-11 rounded-md border border-theme bg-surface-raised px-3 py-2 text-sm text-body"
          >
            <option value="">全部分类</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
            {category && !categories.includes(category) && <option value={category}>{category}</option>}
          </select>
          <input
            type="number"
            min="0"
            value={minPrice}
            onChange={(event) => {
              setMinPrice(event.target.value);
              setPage(1);
            }}
            placeholder="最低价"
            className="min-h-11 rounded-md border border-theme bg-surface-raised px-3 py-2 text-sm text-body"
          />
          <input
            type="number"
            min="0"
            value={maxPrice}
            onChange={(event) => {
              setMaxPrice(event.target.value);
              setPage(1);
            }}
            placeholder="最高价"
            className="min-h-11 rounded-md border border-theme bg-surface-raised px-3 py-2 text-sm text-body"
          />
          <button
            type="submit"
            className="tap-target rounded-md bg-brand-600 px-3 py-2 text-sm font-bold text-white hover:bg-brand-700"
          >
            搜索
          </button>
        </form>
      </div>

      <div className="surface-card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-body">
          {loading ? '正在搜索...' : `共找到 ${total} 件商品，本页显示 ${products.length} 件`}
        </p>
        <label className="flex items-center gap-2 text-sm text-body">
          排序
          <select
            value={sort}
            onChange={(event) => {
              setSort(event.target.value);
              setPage(1);
            }}
            className="min-h-11 rounded-md border border-theme bg-surface-raised px-3 py-2 text-sm text-body"
          >
            <option value="newest">最新上架</option>
            <option value="price_asc">价格从低到高</option>
            <option value="price_desc">价格从高到低</option>
            <option value="stock_desc">库存优先</option>
          </select>
        </label>
      </div>

      {loading && <ProductGridSkeleton count={8} />}
      {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{error}</p>}

      {!loading && !error && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {products.length === 0 && (
            <div className="surface-card p-6">
              <h2 className="text-lg font-bold text-heading">没有找到匹配商品</h2>
              <p className="mt-1 text-sm text-body">可以换个关键词、移除筛选条件，或先看看热门商品。</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {['耳机', '家居', '数码', '保温杯', '跑步鞋'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setSearch(term);
                      setSubmittedSearch(term);
                      setCategory('');
                      setMinPrice('');
                      setMaxPrice('');
                    }}
                    className="tap-target rounded-full border border-theme px-3 py-2 text-sm text-body hover:bg-surface-soft"
                  >
                    {term}
                  </button>
                ))}
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {popularProducts.slice(0, 4).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
              className="rounded-md border border-theme px-3 py-2 text-sm text-body disabled:cursor-not-allowed disabled:opacity-50"
            >
              上一页
            </button>
            <span className="text-sm text-body">
              第 {page} / {totalPages || 1} 页
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((current) => current + 1)}
              className="rounded-md border border-theme px-3 py-2 text-sm text-body disabled:cursor-not-allowed disabled:opacity-50"
            >
              下一页
            </button>
          </div>
        </>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { FormField, useForm } from '../components/FormField/index.ts';
import { toast } from '../components/Toast.tsx';
import { api } from '../services/api.js';
import { formatPrice } from '../utils/formatPrice.js';
import usePageMeta from '../hooks/usePageMeta.js';
import { ProductGridSkeleton } from '../components/Skeleton.jsx';

const emptyProduct = {
  name: '',
  description: '',
  price: '',
  category: '',
  imageUrl: '',
  stock: '',
  discount: '',
  tags: ''
};

export default function AdminProducts() {
  usePageMeta('商品管理 | 悦购商城后台', '创建、编辑和删除商品，管理分类、价格与库存。');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const form = useForm(emptyProduct, {
    name: { required: true },
    description: { required: true, rules: [{ type: 'minLength', value: 8 }] },
    price: { required: true, rules: [{ type: 'decimal' }, { type: 'min', value: 0 }] },
    category: { required: true },
    imageUrl: { required: true },
    stock: { required: true, rules: [{ type: 'integer' }, { type: 'min', value: 0 }] },
    discount: { rules: [{ type: 'integer' }, { type: 'min', value: 0 }, { type: 'max', value: 99 }] }
  });
  const [editingId, setEditingId] = useState('');
  const [deletingId, setDeletingId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadProducts = () => {
    setLoading(true);
    api.getProducts({ limit: 100 }).then((data) => setProducts(data.products || [])).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const saveProduct = async (event) => {
    event.preventDefault();
    if (saving) return;
    if (!(await form.validate())) {
      toast.warning('请检查商品字段。');
      return;
    }
    setMessage('');
    setError('');
    setSaving(true);
    const payload = {
      ...form.values,
      price: Number(form.values.price),
      stock: Number(form.values.stock),
      discount: form.values.discount ? Number(form.values.discount) : 0,
      tags: form.values.tags
        ? form.values.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : []
    };

    try {
      if (editingId) {
        await api.updateProduct(editingId, payload);
      } else {
        await api.createProduct(payload);
      }
      form.setValues(emptyProduct);
      setEditingId('');
      setMessage('商品已保存。');
      toast.success('商品已保存。');
      loadProducts();
    } catch (err) {
      setError(err.message);
      toast.error(err.message || '保存商品失败。');
    } finally {
      setSaving(false);
    }
  };

  const editProduct = (product) => {
    setEditingId(product._id);
    form.setValues({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl,
      stock: product.stock,
      discount: product.discount || '',
      tags: Array.isArray(product.tags) ? product.tags.join(', ') : ''
    });
  };

  const deleteProduct = async (id) => {
    if (deletingId !== id) {
      setDeletingId(id);
      return;
    }
    setDeletingId('');
    try {
      await api.deleteProduct(id);
      toast.success('商品已删除。');
      loadProducts();
    } catch (err) {
      toast.error(err.message || '删除失败。');
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <section className="surface-card p-5">
        <h1 className="text-xl font-bold text-heading">{editingId ? '编辑商品' : '创建商品'}</h1>
        <form onSubmit={saveProduct} className="mt-4 space-y-3">
          {['name', 'category', 'imageUrl'].map((field) => (
            <FormField
              key={field}
              name={field}
              label={{ name: '商品名称', category: '分类', imageUrl: '图片地址' }[field]}
              type="TextInput"
              value={form.values[field]}
              onChange={form.setValue}
              onError={form.setError}
              required
              placeholder={{ name: '例如：轻薄无线降噪耳机', category: '例如：数码家电', imageUrl: 'https://...' }[field]}
            />
          ))}
          <FormField
            name="description"
            label="商品描述"
            type="Textarea"
            value={form.values.description}
            onChange={form.setValue}
            onError={form.setError}
            required
            rules={[{ type: 'minLength', value: 8 }]}
            placeholder="说明商品卖点、适用场景和规格信息"
            rows="4"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField
              name="price"
              label="价格"
              type="NumberInput"
              value={form.values.price}
              onChange={form.setValue}
              onError={form.setError}
              required
              rules={[{ type: 'decimal' }, { type: 'min', value: 0 }]}
              placeholder="例如：199"
            />
            <FormField
              name="stock"
              label="库存"
              type="NumberInput"
              value={form.values.stock}
              onChange={form.setValue}
              onError={form.setError}
              required
              rules={[{ type: 'integer' }, { type: 'min', value: 0 }]}
              placeholder="例如：80"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField
              name="discount"
              label="折扣 (%)"
              type="NumberInput"
              value={form.values.discount}
              onChange={form.setValue}
              onError={form.setError}
              rules={[{ type: 'integer' }, { type: 'min', value: 0 }, { type: 'max', value: 99 }]}
              placeholder="例如：20"
            />
            <FormField
              name="tags"
              label="标签"
              type="TextInput"
              value={form.values.tags}
              onChange={form.setValue}
              onError={form.setError}
              placeholder="逗号分隔，如：热销, 新品"
            />
          </div>
          <div className="flex gap-2">
            <button
              disabled={saving}
              className="tap-target flex-1 rounded-md bg-brand-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
            >
              {saving ? '保存中...' : '保存商品'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId('');
                  form.setValues(emptyProduct);
                  setMessage('');
                  setError('');
                }}
                className="tap-target rounded-md border border-theme px-4 py-2 text-sm font-medium text-body hover:bg-surface-soft"
              >
                取消编辑
              </button>
            )}
          </div>
        </form>
        {message && <p className="mt-4 rounded-md bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">{message}</p>}
        {error && <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{error}</p>}
      </section>

      <section className="surface-card p-5">
        <h2 className="text-xl font-bold text-heading">商品库存</h2>
        {loading && <ProductGridSkeleton count={8} />}
        {!loading && products.length === 0 && <p className="mt-4 text-sm text-body">暂无商品。</p>}
        <div className="mt-4 grid gap-3 md:hidden">
          {products.map((product) => (
            <article key={product._id} className="rounded-lg border border-theme p-4">
              <div className="flex gap-3">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-20 w-20 rounded-md object-cover"
                  loading="lazy"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold text-heading">{product.name}</h3>
                  <p className="mt-1 text-sm text-body">{product.category}</p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <span className="rounded-md bg-surface-soft px-2 py-1">价格 {formatPrice(product.price)}</span>
                    <span className="rounded-md bg-surface-soft px-2 py-1">库存 {product.stock}</span>
                  </div>
                  {(product.discount > 0 || (product.tags && product.tags.length > 0)) && (
                    <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs">
                      {product.discount > 0 && (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 font-bold text-red-700 dark:bg-red-900/20 dark:text-red-400">
                          -{product.discount}%
                        </span>
                      )}
                      {(Array.isArray(product.tags) ? product.tags : []).map((tag) => (
                        <span key={tag} className="rounded-full bg-brand-100 px-2 py-0.5 font-medium text-brand-700 dark:bg-brand-900/20 dark:text-brand-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <details className="mt-3 rounded-md bg-surface-soft p-3 text-sm text-body">
                <summary className="cursor-pointer font-medium text-heading">详情</summary>
                <p className="mt-2">{product.description}</p>
                {product.discount > 0 && <p className="mt-1">折扣：{product.discount}%</p>}
                {product.tags && product.tags.length > 0 && <p className="mt-1">标签：{Array.isArray(product.tags) ? product.tags.join('、') : product.tags}</p>}
              </details>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  onClick={() => editProduct(product)}
                  className="min-h-11 rounded-md border border-brand-200 px-3 py-2 text-sm font-medium text-brand-700"
                >
                  编辑
                </button>
                <button
                  onClick={() => deleteProduct(product._id)}
                  className={`min-h-11 rounded-md border px-3 py-2 text-sm font-medium ${
                    deletingId === product._id
                      ? 'border-red-500 bg-red-600 text-white'
                      : 'border-red-200 text-red-600'
                  }`}
                >
                  {deletingId === product._id ? '确认删除？' : '删除'}
                </button>
              </div>
            </article>
          ))}
        </div>
        {!loading && <div className="mt-4 hidden overflow-x-auto md:block">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-theme text-body">
              <tr>
                <th className="py-2">商品</th>
                <th>分类</th>
                <th>价格</th>
                <th>库存</th>
                <th>折扣/标签</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b border-theme">
                  <td className="py-3 font-medium text-heading">{product.name}</td>
                  <td>{product.category}</td>
                  <td>{formatPrice(product.price)}</td>
                  <td>{product.stock}</td>
                  <td className="text-xs">
                    {product.discount > 0 && (
                      <span className="mr-1 rounded-full bg-red-100 px-1.5 py-0.5 font-bold text-red-700 dark:bg-red-900/20 dark:text-red-400">
                        -{product.discount}%
                      </span>
                    )}
                    {(Array.isArray(product.tags) ? product.tags : []).map((tag) => (
                      <span key={tag} className="mr-1 rounded-full bg-brand-100 px-1.5 py-0.5 font-medium text-brand-700 dark:bg-brand-900/20 dark:text-brand-400">
                        {tag}
                      </span>
                    ))}
                  </td>
                  <td className="space-x-2">
                    <button onClick={() => editProduct(product)} className="text-brand-700">
                      编辑
                    </button>
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className={deletingId === product._id ? 'font-bold text-red-600' : 'text-red-600'}
                    >
                      {deletingId === product._id ? '确认删除？' : '删除'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>}
      </section>
    </div>
  );
}

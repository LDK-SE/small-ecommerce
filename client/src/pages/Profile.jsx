import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { FormField, useForm } from '../components/FormField/index.ts';
import { toast } from '../components/Toast.tsx';
import { api } from '../services/api.js';
import usePageMeta from '../hooks/usePageMeta.js';

const emptyAddress = {
  receiverName: '',
  phone: '',
  address: '',
  isDefault: false
};

export default function Profile() {
  usePageMeta('个人中心 | 悦购商城', '管理您的个人信息和收货地址。');

  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user?.name]);
  const [addresses, setAddresses] = useState([]);
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');
  const [addressMessage, setAddressMessage] = useState('');
  const [addressError, setAddressError] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [addressSaving, setAddressSaving] = useState(false);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const address = useForm(emptyAddress, {
    receiverName: { required: true, rules: [{ type: 'minLength', value: 2 }] },
    phone: { required: true, rules: [{ type: 'phone' }] },
    address: { required: true, rules: [{ type: 'minLength', value: 6 }] },
    isDefault: {}
  });

  const loadAddresses = () => {
    setAddressesLoading(true);
    api.getAddresses().then(setAddresses).catch((err) => setAddressError(err.message)).finally(() => setAddressesLoading(false));
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const saveProfile = async (event) => {
    event.preventDefault();
    setProfileError('');
    setProfileMessage('');
    setProfileSaving(true);
    try {
      await api.updateMe({ name });
      setProfileMessage('个人资料已更新。');
      toast.success('个人资料已更新。');
    } catch (err) {
      setProfileError(err.message);
      toast.error(err.message || '更新个人资料失败。');
    } finally {
      setProfileSaving(false);
    }
  };

  const addAddress = async (event) => {
    event.preventDefault();
    if (!(await address.validate())) {
      toast.warning('请检查地址信息。');
      return;
    }
    setAddressError('');
    setAddressMessage('');
    setAddressSaving(true);
    try {
      const data = await api.addAddress(address.values);
      setAddresses(data);
      address.setValues(emptyAddress);
      setAddressMessage('地址已保存。');
      toast.success('地址已保存。');
    } catch (err) {
      setAddressError(err.message);
      toast.error(err.message || '保存地址失败。');
    } finally {
      setAddressSaving(false);
    }
  };

  const deleteAddress = async (id) => {
    try {
      const data = await api.deleteAddress(id);
      setAddresses(data);
      toast.success('地址已删除。');
    } catch (err) {
      toast.error(err.message || '删除地址失败。');
    }
  };

  const setDefault = async (id) => {
    try {
      const data = await api.updateAddress(id, { isDefault: true });
      setAddresses(data);
    } catch (err) {
      toast.error(err.message || '设置默认地址失败。');
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <section className="surface-card p-5">
        <h1 className="text-2xl font-bold text-heading">个人中心</h1>
        <p className="mt-1 text-sm text-body">{user.email}</p>
        <form onSubmit={saveProfile} className="mt-5 space-y-3">
          <label className="block text-sm font-medium text-body">姓名</label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-md border border-theme bg-surface-raised px-3 py-2 text-sm text-body"
            placeholder="请输入姓名"
          />
          <button
            disabled={profileSaving}
            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {profileSaving ? '保存中...' : '保存资料'}
          </button>
        </form>
        {profileMessage && <p className="mt-4 rounded-md bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">{profileMessage}</p>}
        {profileError && <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{profileError}</p>}
      </section>

      <section className="surface-card p-5">
        <h2 className="text-xl font-bold text-heading">收货地址</h2>
        <form onSubmit={addAddress} className="mt-4 grid gap-3 md:grid-cols-2">
          <FormField
            name="receiverName"
            label="收货人"
            type="TextInput"
            value={address.values.receiverName}
            onChange={address.setValue}
            onError={address.setError}
            required
            placeholder="收货人姓名"
          />
          <FormField
            name="phone"
            label="手机号"
            type="PhoneInput"
            value={address.values.phone}
            onChange={address.setValue}
            onError={address.setError}
            required
            rules={[{ type: 'phone' }]}
            placeholder="手机号码"
          />
          <div className="md:col-span-2">
            <FormField
              name="address"
              label="详细地址"
              type="AddressCascader"
              value={address.values.address}
              onChange={address.setValue}
              onError={address.setError}
              required
              rules={[{ type: 'minLength', value: 6 }]}
              placeholder="省市区 + 街道门牌号"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-body">
            <input
              type="checkbox"
              checked={Boolean(address.values.isDefault)}
              onChange={(event) => address.setValue('isDefault', event.target.checked)}
            />
            设为默认地址
          </label>
          <button
            disabled={addressSaving}
            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60 md:w-fit"
          >
            {addressSaving ? '保存中...' : '添加地址'}
          </button>
        </form>

        {addressMessage && <p className="mt-4 rounded-md bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">{addressMessage}</p>}
        {addressError && <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{addressError}</p>}
        {addressesLoading && <p className="mt-5 text-sm text-body">正在加载地址...</p>}
        {!addressesLoading && addresses.length === 0 && (
          <p className="mt-5 text-sm text-body">还没有添加收货地址。</p>
        )}
        <div className="mt-5 grid gap-3">
          {addresses.map((item) => (
            <div key={item._id} className="rounded-md border border-theme p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-semibold text-heading">
                    {item.receiverName} · {item.phone}
                    {item.isDefault && <span className="ml-2 text-xs text-brand-700">默认</span>}
                  </p>
                  <p className="mt-1 text-sm text-body">{item.address}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setDefault(item._id)}
                    className="rounded-md border border-theme px-3 py-1 text-sm"
                  >
                    设为默认
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteAddress(item._id)}
                    className="rounded-md border border-red-200 px-3 py-1 text-sm text-red-600"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

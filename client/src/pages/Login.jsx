import { Link, useNavigate } from 'react-router-dom';
import { FormField, useForm } from '../components/FormField/index.ts';
import { toast } from '../components/Toast.tsx';
import { useAuth } from '../context/AuthContext.jsx';
import usePageMeta from '../hooks/usePageMeta.js';

const initialValues = {
  email: '',
  password: ''
};

export default function Login() {
  usePageMeta('登录 | 悦购商城', '登录悦购商城，管理订单、收货地址和个人资料。');

  const { login } = useAuth();
  const navigate = useNavigate();
  const form = useForm(initialValues, {
    email: { required: true, rules: [{ type: 'email' }] },
    password: { required: true, rules: [{ type: 'minLength', value: 6 }] }
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!(await form.validate())) {
      toast.warning('请检查表单错误。');
      return;
    }

    const loading = toast.loading('正在登录...');
    try {
      await login(form.values);
      loading.update('success', '欢迎回来。');
      navigate('/');
    } catch (err) {
      loading.update('error', err.message || '登录失败。');
    }
  };

  return (
    <div className="surface-card mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold text-heading">登录</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        <FormField
          name="email"
          label="邮箱"
          type="EmailInput"
          value={form.values.email}
          onChange={form.setValue}
          onError={form.setError}
          required
          validateTrigger="onBlur"
          placeholder="you@example.com"
          rules={[{ type: 'email' }]}
        />
        <FormField
          name="password"
          label="密码"
          type="PasswordInput"
          value={form.values.password}
          onChange={form.setValue}
          onError={form.setError}
          required
          validateTrigger="onBlur"
          placeholder="至少 6 位字符"
          rules={[{ type: 'minLength', value: 6 }]}
        />
        <button
          type="submit"
          className="tap-target w-full rounded-md bg-brand-600 px-4 py-3 text-sm font-bold text-white hover:bg-brand-700"
        >
          登录
        </button>
      </form>
      <p className="mt-3 text-right text-sm">
        <button
          type="button"
          className="text-body hover:text-brand-700"
          onClick={() => toast.info('演示环境暂不支持自助重置密码，请联系管理员。')}
        >
          忘记密码？
        </button>
      </p>
      <p className="mt-2 text-sm text-body">
        还没有账号？{' '}
        <Link to="/register" className="font-semibold text-brand-700 hover:text-brand-600">
          立即注册
        </Link>
      </p>
    </div>
  );
}


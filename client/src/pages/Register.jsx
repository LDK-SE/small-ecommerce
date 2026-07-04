import { Link, useNavigate } from 'react-router-dom';
import { FormField, useForm } from '../components/FormField/index.ts';
import { toast } from '../components/Toast.tsx';
import { useAuth } from '../context/AuthContext.jsx';
import usePageMeta from '../hooks/usePageMeta.js';

const initialValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
};

export default function Register() {
  usePageMeta('注册 | 悦购商城', '创建悦购商城账号，开始选购数码、家居、服饰和个护好物。');

  const { register } = useAuth();
  const navigate = useNavigate();
  const form = useForm(initialValues, {
    name: { required: true, rules: [{ type: 'minLength', value: 2 }] },
    email: { required: true, rules: [{ type: 'email' }] },
    password: { required: true, rules: [{ type: 'minLength', value: 6 }] },
    confirmPassword: {
      required: true,
      rules: [
        {
          type: 'validator',
          validator(value) {
            if (value !== form.values.password) return '两次输入的密码不一致。';
            return true;
          }
        }
      ]
    }
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!(await form.validate())) {
      toast.warning('请检查表单错误。');
      return;
    }

    const loading = toast.loading('正在创建账号...');
    try {
      await register(form.values);
      loading.update('success', '账号创建成功。');
      navigate('/');
    } catch (err) {
      loading.update('error', err.message || '注册失败。');
    }
  };

  return (
    <div className="surface-card mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold text-heading">注册</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        <FormField
          name="name"
          label="姓名"
          type="TextInput"
          value={form.values.name}
          onChange={form.setValue}
          onError={form.setError}
          required
          rules={[{ type: 'minLength', value: 2 }]}
          placeholder="请输入姓名"
        />
        <FormField
          name="email"
          label="邮箱"
          type="EmailInput"
          value={form.values.email}
          onChange={form.setValue}
          onError={form.setError}
          required
          rules={[{ type: 'email' }]}
          placeholder="you@example.com"
        />
        <FormField
          name="password"
          label="密码"
          type="PasswordInput"
          value={form.values.password}
          onChange={form.setValue}
          onError={form.setError}
          required
          rules={[{ type: 'minLength', value: 6 }]}
          placeholder="至少 6 位字符"
        />
        <FormField
          name="confirmPassword"
          label="确认密码"
          type="PasswordInput"
          value={form.values.confirmPassword}
          onChange={form.setValue}
          onError={form.setError}
          required
          deps={{ password: form.values.password }}
          validateOnDepsChange={(value, deps) => {
            if (value !== deps.password) return '两次输入的密码不一致。';
            return true;
          }}
          placeholder="请再次输入密码"
        />
        <button
          type="submit"
          className="tap-target w-full rounded-md bg-brand-600 px-4 py-3 text-sm font-bold text-white hover:bg-brand-700"
        >
          注册并登录
        </button>
      </form>
      <p className="mt-4 text-sm text-body">
        已有账号？{' '}
        <Link to="/login" className="font-semibold text-brand-700 hover:text-brand-600">
          去登录
        </Link>
      </p>
    </div>
  );
}


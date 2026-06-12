import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import Input, { Checkbox } from '@components/Input';
import Button from '@components/Button';
import { useAuth } from '@context/AuthContext';
import { useToast } from '@context/ToastContext';
import { SYSTEM_ROLE_DEVOTEE } from '@data/permissions';

export default function Login() {
  const [showPwd, setShowPwd] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const { login, loading } = useAuth();
  const { toast } = useToast();
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const signed = await login(form);
      const isDevotee = signed.roleId === SYSTEM_ROLE_DEVOTEE;
      toast.success(isDevotee ? 'Jai Jinendra! Welcome back.' : `Welcome back, ${signed.name}!`);
      nav(isDevotee ? '/user' : '/dashboard');
    } catch (err) {
      toast.error(err.message || 'Login failed. Check your email and password.');
    }
  };

  return (
    <div>
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-100 dark:bg-saffron-500/15 text-saffron-700 dark:text-saffron-400 text-xs font-semibold tracking-wider uppercase">
        🙏 Jai Jinendra
      </div>
      <h1 className="font-serif text-3xl font-bold text-neutral-900 dark:text-white mt-3">Welcome back</h1>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1.5">
        Sign in to continue your seva admins, staff and devotees all use the same login.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <Input
          label="Email address"
          icon={Mail}
          type="email"
          placeholder="you@mandir.org"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <Input
          label="Password"
          icon={Lock}
          type={showPwd ? 'text' : 'password'}
          placeholder="Enter your password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          trailing={
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              aria-label={showPwd ? 'Hide password' : 'Show password'}
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors focus:outline-none"
            >
              {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
        />
        <div className="flex items-center justify-between">
          <Checkbox label="Remember me" defaultChecked />
          <Link to="/auth/forgot-password" className="text-sm font-medium text-saffron-600 hover:text-saffron-700">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" loading={loading} fullWidth size="lg" icon={LogIn}>
          Sign in
        </Button>

        <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-6">
          Don't have an account?{' '}
          <Link to="/auth/register" className="font-semibold text-saffron-600 hover:text-saffron-700">
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, KeyRound } from 'lucide-react';
import Input from '@components/Input';
import Button from '@components/Button';
import { useToast } from '@context/ToastContext';

export default function ResetPassword() {
  const [form, setForm] = useState({ password: '', confirm: '' });
  const { toast } = useToast();
  const nav = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    toast.success('Password updated successfully');
    nav('/auth/login');
  };

  const strength = (() => {
    let s = 0;
    if (form.password.length >= 8) s++;
    if (/[A-Z]/.test(form.password)) s++;
    if (/[0-9]/.test(form.password)) s++;
    if (/[^A-Za-z0-9]/.test(form.password)) s++;
    return s;
  })();

  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-rose-500', 'bg-amber-500', 'bg-sky-500', 'bg-emerald-500'];

  return (
    <div>
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-saffron-500 to-maroon-600 flex items-center justify-center text-white mb-5 shadow-glow">
        <KeyRound className="w-7 h-7" />
      </div>
      <h1 className="font-serif text-3xl font-bold">Reset password</h1>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1.5">
        Choose a strong new password to secure your account.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        <div>
          <Input
            label="New password"
            icon={Lock}
            type="password"
            placeholder="Min 8 characters"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          {form.password && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className={`flex-1 h-1 rounded-full ${i < strength ? strengthColors[strength - 1] : 'bg-sand-200 dark:bg-neutral-700'}`} />
                ))}
              </div>
              <span className="text-xs font-medium text-neutral-500">{strengthLabels[strength - 1] || ''}</span>
            </div>
          )}
        </div>
        <Input
          label="Confirm password"
          icon={Lock}
          type="password"
          placeholder="Re-enter password"
          value={form.confirm}
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          required
        />
        <Button type="submit" fullWidth size="lg">Update password</Button>
        <p className="text-center text-sm text-neutral-500 mt-4">
          <Link to="/auth/login" className="text-saffron-600 font-semibold">Back to login</Link>
        </p>
      </form>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, UserPlus } from 'lucide-react';
import Input, { Checkbox } from '@components/Input';
import Button from '@components/Button';
import { useAuth } from '@context/AuthContext';
import { useToast } from '@context/ToastContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const { register, loading } = useAuth();
  const { toast } = useToast();
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await register(form);
      toast.success(res?.message || 'Registration received! An admin will approve your account shortly.');
      // Account is pending approval — send them to the login screen, not the portal.
      nav('/auth/login');
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold">Create your account</h1>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1.5">
        Join the divine seva community
      </p>
      <p className="mt-3 text-xs text-saffron-700 dark:text-saffron-400 bg-saffron-50 dark:bg-saffron-500/10 border border-saffron-200/60 dark:border-saffron-500/20 rounded-xl px-3 py-2">
        New accounts need <strong>admin approval</strong> before you can sign in.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <Input label="Full Name" icon={User} placeholder="Ramesh Sharma" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <Input label="Email" icon={Mail} type="email" placeholder="you@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <Input label="Mobile" icon={Phone} type="tel" placeholder="+91 98765-43210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
        <Input label="Password" icon={Lock} type="password" placeholder="At least 8 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />

        <Checkbox label={<span>I agree to the <Link to="/terms" className="text-saffron-600">Terms & Privacy Policy</Link></span>} defaultChecked />

        <Button type="submit" loading={loading} fullWidth size="lg" icon={UserPlus}>
          Create account
        </Button>

        <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-6">
          Already a member?{' '}
          <Link to="/auth/login" className="font-semibold text-saffron-600 hover:text-saffron-700">Sign in</Link>
        </p>
      </form>
    </div>
  );
}

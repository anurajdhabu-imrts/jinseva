import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { useState } from 'react';
import Input from '@components/Input';
import Button from '@components/Button';
import { useToast } from '@context/ToastContext';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const { toast } = useToast();
  const nav = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    toast.success('OTP sent to your email');
    nav('/auth/otp');
  };

  return (
    <div>
      <Link to="/auth/login" className="inline-flex items-center text-sm text-neutral-500 hover:text-saffron-600 mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to login
      </Link>
      <h1 className="font-serif text-3xl font-bold">Forgot password?</h1>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1.5">
        No worries — we'll send you a one-time code to reset it.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        <Input
          label="Email address"
          icon={Mail}
          type="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" fullWidth size="lg" icon={Send}>Send reset code</Button>
        <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-4">
          Remember your password?{' '}
          <Link to="/auth/login" className="font-semibold text-saffron-600 hover:text-saffron-700">Sign in</Link>
        </p>
      </form>
    </div>
  );
}

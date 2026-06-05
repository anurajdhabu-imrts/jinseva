import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import Button from '@components/Button';
import { useToast } from '@context/ToastContext';

export default function OtpVerification() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const refs = useRef([]);
  const [timer, setTimer] = useState(30);
  const { toast } = useToast();
  const nav = useNavigate();

  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const onChange = (i, v) => {
    if (!/^[0-9]?$/.test(v)) return;
    const newOtp = [...otp];
    newOtp[i] = v;
    setOtp(newOtp);
    if (v && i < 5) refs.current[i + 1]?.focus();
  };

  const onKey = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const submit = (e) => {
    e.preventDefault();
    toast.success('OTP verified successfully');
    nav('/auth/reset-password');
  };

  return (
    <div>
      <Link to="/auth/forgot-password" className="inline-flex items-center text-sm text-neutral-500 hover:text-saffron-600 mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </Link>
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-saffron-500 to-maroon-600 flex items-center justify-center text-white mb-5 shadow-glow">
        <ShieldCheck className="w-7 h-7" />
      </div>
      <h1 className="font-serif text-3xl font-bold">Verify your identity</h1>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1.5">
        Enter the 6-digit code we just sent to <strong className="text-neutral-700 dark:text-neutral-200">priya@email.com</strong>
      </p>

      <form onSubmit={submit} className="mt-8 space-y-6">
        <div className="flex justify-between gap-2">
          {otp.map((d, i) => (
            <input
              key={i}
              ref={(el) => (refs.current[i] = el)}
              value={d}
              onChange={(e) => onChange(i, e.target.value)}
              onKeyDown={(e) => onKey(i, e)}
              maxLength={1}
              type="text"
              inputMode="numeric"
              className="w-12 h-14 md:w-14 md:h-16 text-center text-xl font-bold rounded-xl bg-white dark:bg-neutral-900 border border-sand-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-saffron-500/40 focus:border-saffron-500"
            />
          ))}
        </div>
        <Button type="submit" fullWidth size="lg">Verify code</Button>
        <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
          Didn't receive it?{' '}
          {timer > 0 ? (
            <span className="text-saffron-600">Resend in {timer}s</span>
          ) : (
            <button type="button" onClick={() => { setTimer(30); toast.info('OTP resent'); }} className="text-saffron-600 font-semibold hover:underline">
              Resend code
            </button>
          )}
        </p>
      </form>
    </div>
  );
}

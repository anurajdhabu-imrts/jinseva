import { Link } from 'react-router-dom';
import { Home, Flame } from 'lucide-react';
import Button from '@components/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-sand-50 dark:bg-neutral-950 flex items-center justify-center p-6 overflow-hidden relative">
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-saffron-300/20 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-maroon-400/20 blur-3xl" />
      <div className="relative text-center max-w-md">
        <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-saffron-500 via-saffron-600 to-maroon-700 flex items-center justify-center shadow-glow animate-float">
          <Flame className="w-12 h-12 text-white" />
        </div>
        <h1 className="font-display text-8xl font-bold gradient-text mt-6">404</h1>
        <h2 className="font-serif text-2xl font-semibold mt-2 text-neutral-900 dark:text-white">Path not found</h2>
        <p className="text-neutral-500 dark:text-neutral-400 mt-3">
          The page you seek has wandered to a different temple.
          Let us guide you back to the sanctum.
        </p>
        <Link to="/dashboard" className="inline-block mt-6">
          <Button icon={Home} size="lg">Return to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}

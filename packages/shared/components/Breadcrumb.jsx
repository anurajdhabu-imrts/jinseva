import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../utils/cn';

export default function Breadcrumb({ items = [], className = '' }) {
  return (
    <nav className={cn('flex items-center text-sm text-neutral-500 dark:text-neutral-400', className)}>
      <Link to="/" className="hover:text-saffron-600 inline-flex items-center">
        <Home className="w-4 h-4" />
      </Link>
      {items.map((item, i) => (
        <span key={i} className="inline-flex items-center">
          <ChevronRight className="w-4 h-4 mx-1.5 text-neutral-400" />
          {item.to && i < items.length - 1 ? (
            <Link to={item.to} className="hover:text-saffron-600">
              {item.label}
            </Link>
          ) : (
            <span className="text-neutral-700 dark:text-neutral-200 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

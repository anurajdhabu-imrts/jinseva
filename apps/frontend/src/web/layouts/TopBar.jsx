import { Sunrise, Sunset, MapPin, Phone, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';
import JainFlagStripe from '@web/components/JainFlagStripe';

export default function TopBar() {
  return (
    <>
      {/* Decorative 5-color Jain flag ribbon */}
      <JainFlagStripe height="h-1" />

      <div className="hidden lg:block bg-jain-white-200 dark:bg-jain-black-900 border-b border-jain-white-300 dark:border-jain-black-800 text-xs">
        <div className="max-w-[1400px] mx-auto px-6 h-10 flex items-center gap-6 text-jain-black-700 dark:text-jain-white-300">
          <span className="inline-flex items-center gap-2">
            <Sunrise className="w-4 h-4 text-jain-red-600" />
            <span className="text-jain-black-500">Sunrise at</span>
            <strong className="text-jain-black-900 dark:text-jain-white-100 font-semibold">5:42 AM</strong>
          </span>
          <span className="inline-flex items-center gap-2">
            <Sunset className="w-4 h-4 text-jain-yellow-600" />
            <span className="text-jain-black-500">Sunset at</span>
            <strong className="text-jain-black-900 dark:text-jain-white-100 font-semibold">7:08 PM</strong>
          </span>

          <span className="ml-auto inline-flex items-center gap-6">
            <span className="inline-flex items-center gap-2">
              <MapPin className="w-4 h-4 text-jain-green-600" />
              <span>123 Derasar Marg, Walkeshwar, Mumbai</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-jain-red-600" />
            <span className="inline-flex items-center gap-2">
              <Phone className="w-4 h-4 text-jain-red-600" />
              <span className="font-semibold text-jain-black-900 dark:text-jain-white-100">+91 22 9876 5432</span>
            </span>
          </span>

          <div className="flex items-center gap-1.5 pl-4 ml-2 border-l border-jain-white-300 dark:border-jain-black-800">
            {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-7 h-7 rounded-full bg-jain-black-900 dark:bg-jain-black-800 text-white hover:bg-jain-red-600 flex items-center justify-center transition-colors"
              >
                <Icon className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

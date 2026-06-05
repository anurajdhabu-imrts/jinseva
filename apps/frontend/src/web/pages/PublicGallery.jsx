import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Share2, Download } from 'lucide-react';
import { galleryImages } from '@data/mockData';

const categories = ['All', 'Daily Darshan', 'Mahaparvas', 'Seva', 'Architecture', 'Events'];

export default function PublicGallery() {
  const [active, setActive] = useState('All');
  const [preview, setPreview] = useState(null);

  const filtered = active === 'All' ? galleryImages : galleryImages.filter((g) => g.category === active);

  return (
    <div>
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-saffron-50 via-sand-50 to-gold-50 dark:from-saffron-900/10 dark:via-neutral-950 dark:to-gold-900/10 overflow-hidden">
        <div className="absolute inset-0 bg-mandala opacity-25" />
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-saffron-700">Darshan</span>
          <h1 className="font-display text-5xl md:text-6xl font-bold mt-3 gradient-text">Sacred Moments</h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-300 mt-5 max-w-2xl mx-auto">
            A glimpse into the daily life of our derasar — every aarti, every aangi, every smile captured forever.
          </p>
          <div className="flex flex-wrap gap-2 justify-center mt-8">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  active === c
                    ? 'bg-gradient-to-r from-saffron-500 to-saffron-600 text-white shadow-md'
                    : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 border border-sand-200 dark:border-neutral-800 hover:border-saffron-400'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {filtered.map((img, i) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (i % 8) * 0.04 }}
                onClick={() => setPreview(img)}
                className="relative break-inside-avoid rounded-2xl overflow-hidden group cursor-pointer shadow-card hover:shadow-xl transition"
                style={{ marginBottom: '1rem' }}
              >
                <img src={img.src} alt={img.caption} className="w-full group-hover:scale-105 transition-transform duration-700" style={{ height: 200 + ((i * 37) % 180) }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-4">
                  <div className="text-white">
                    <p className="text-[10px] uppercase tracking-wider opacity-75">{img.category}</p>
                    <p className="font-medium text-sm">{img.caption}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreview(null)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={preview.src} alt={preview.caption} className="w-full rounded-2xl" />
              <div className="mt-4 flex items-center justify-between text-white">
                <div>
                  <p className="text-xs uppercase tracking-wider opacity-75">{preview.category}</p>
                  <h3 className="font-serif text-xl font-semibold">{preview.caption}</h3>
                </div>
                <div className="flex gap-2">
                  <button className="p-2.5 rounded-xl bg-white/15 hover:bg-white/25"><Heart className="w-5 h-5" /></button>
                  <button className="p-2.5 rounded-xl bg-white/15 hover:bg-white/25"><Share2 className="w-5 h-5" /></button>
                  <button className="p-2.5 rounded-xl bg-white/15 hover:bg-white/25"><Download className="w-5 h-5" /></button>
                  <button onClick={() => setPreview(null)} className="p-2.5 rounded-xl bg-white/15 hover:bg-white/25"><X className="w-5 h-5" /></button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Video, Image as ImageIcon, Heart, Share2, Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '@components/PageHeader';
import Card, { CardBody } from '@components/Card';
import Button from '@components/Button';
import SearchBar from '@components/SearchBar';
import { galleryImages } from '@data/mockData';

const categories = ['All', 'Daily Rituals', 'Festivals', 'Seva', 'Architecture', 'Events'];

export default function PhotoGallery() {
  const [active, setActive] = useState('All');
  const [search, setSearch] = useState('');
  const [preview, setPreview] = useState(null);

  const filtered = galleryImages.filter((img) => {
    const matchCat = active === 'All' || img.category === active;
    const matchSearch = !search || img.caption.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Media Gallery"
        subtitle="Sacred memories captured forever"
        breadcrumb={[{ label: 'Media' }]}
        actions={
          <>
            <Link to="/media/videos"><Button variant="secondary" icon={Video}>Videos</Button></Link>
            <Link to="/media/upload"><Button icon={Upload}>Upload</Button></Link>
          </>
        }
      />

      <Card>
        <CardBody>
          <div className="flex flex-col md:flex-row gap-3">
            <SearchBar value={search} onChange={setSearch} placeholder="Search captions…" className="md:max-w-sm" />
            <div className="flex flex-wrap gap-2 md:ml-auto">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setActive(c)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    active === c
                      ? 'bg-gradient-to-r from-saffron-500 to-saffron-600 text-white shadow-md'
                      : 'bg-sand-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((img) => (
          <motion.div
            layout
            key={img.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-square rounded-2xl overflow-hidden group cursor-pointer relative"
            onClick={() => setPreview(img)}
          >
            <img src={img.src} alt={img.caption} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-4">
              <div className="text-white">
                <p className="text-xs uppercase tracking-wider opacity-75">{img.category}</p>
                <p className="font-medium text-sm">{img.caption}</p>
              </div>
            </div>
            <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition">
              <button className="p-1.5 rounded-lg bg-white/20 backdrop-blur text-white hover:bg-white/30"><Heart className="w-4 h-4" /></button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setPreview(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={preview.src} alt={preview.caption} className="w-full rounded-2xl" />
              <div className="mt-4 flex items-center justify-between text-white">
                <div>
                  <p className="text-xs uppercase opacity-75">{preview.category}</p>
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

import { useState } from 'react';
import { Image as ImageIcon, Upload, Search } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import Card from '@components/Card';
import Button from '@components/Button';
import SearchBar from '@components/SearchBar';
import { galleryImages } from '@data/mockData';

export default function EventGallery() {
  const [search, setSearch] = useState('');
  const filtered = galleryImages.filter((g) => !search || g.caption.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Event Gallery"
        subtitle="A visual archive of sacred moments"
        breadcrumb={[{ label: 'Events', to: '/events' }, { label: 'Gallery' }]}
        actions={<Button icon={Upload}>Upload</Button>}
      />
      <Card className="p-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search captions…" />
      </Card>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((img) => (
          <div key={img.id} className="break-inside-avoid rounded-2xl overflow-hidden group cursor-pointer relative">
            <img src={img.src} alt={img.caption} className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-4">
              <div className="text-white">
                <p className="text-xs uppercase tracking-wider opacity-75">{img.category}</p>
                <p className="font-medium">{img.caption}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

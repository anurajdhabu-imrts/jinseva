import { Link } from 'react-router-dom';
import { Play, Upload, Eye, Clock } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import Card, { CardBody } from '@components/Card';
import Button from '@components/Button';
import Badge from '@components/Badge';

const videos = [
  { id: 1, title: 'Maha Aarti — Janmashtami 2025',     duration: '12:45', views: 24580, thumb: 'https://images.unsplash.com/photo-1582558508092-c7a39fd14d05?w=800', category: 'Aarti' },
  { id: 2, title: 'Bhajan Sandhya with Anup Jalota',  duration: '1:24:32', views: 18450, thumb: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800', category: 'Bhajan' },
  { id: 3, title: 'Diwali Lakshmi Pooja Live',         duration: '45:18', views: 32100, thumb: 'https://images.unsplash.com/photo-1604608672516-f1b9b1e5e7e9?w=800', category: 'Pooja' },
  { id: 4, title: 'Rudra Abhishekam — Full Ceremony',  duration: '2:15:42', views: 15680, thumb: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=800', category: 'Pooja' },
  { id: 5, title: 'Holi Celebration Highlights',       duration: '8:32', views: 11250, thumb: 'https://images.unsplash.com/photo-1599627388842-0e94f5d04c0d?w=800', category: 'Festival' },
  { id: 6, title: 'Bhagavad Gita Discourse Ep. 14',    duration: '52:18', views: 8920, thumb: 'https://images.unsplash.com/photo-1604608672516-f1b9b1e5e7e9?w=800', category: 'Discourse' },
];

export default function VideoGallery() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Video Library"
        subtitle="Sacred ceremonies & discourses on demand"
        breadcrumb={[{ label: 'Media', to: '/media' }, { label: 'Videos' }]}
        actions={<Link to="/media/upload"><Button icon={Upload}>Upload Video</Button></Link>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {videos.map((v) => (
          <Card key={v.id} hover className="overflow-hidden group">
            <div className="relative aspect-video overflow-hidden cursor-pointer">
              <img src={v.thumb} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center opacity-90 group-hover:scale-110 transition-transform">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center ring-4 ring-white/30">
                  <Play className="w-7 h-7 text-white fill-current ml-0.5" />
                </div>
              </div>
              <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/75 text-white text-xs font-mono">{v.duration}</span>
              <Badge variant="primary" className="absolute top-3 left-3">{v.category}</Badge>
            </div>
            <CardBody>
              <h3 className="font-serif font-semibold text-neutral-900 dark:text-white line-clamp-2">{v.title}</h3>
              <div className="flex items-center gap-3 text-xs text-neutral-500 mt-2">
                <span className="inline-flex items-center gap-1"><Eye className="w-3 h-3" />{v.views.toLocaleString('en-IN')} views</span>
                <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{v.duration}</span>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

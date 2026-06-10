import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Play, Upload, Eye, Clock, Trash2 } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import Card, { CardBody } from '@components/Card';
import Button from '@components/Button';
import Badge from '@components/Badge';
import { useToast } from '@context/ToastContext';
import { mediaApi, resolveMedia, apiError } from '@services/rbacService';
import { onImgError } from '@utils/constants';

export default function VideoGallery() {
  const { toast } = useToast();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setVideos(await mediaApi.list({ type: 'video' }));
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const remove = async (v) => {
    if (!window.confirm('Delete this video?')) return;
    try {
      await mediaApi.remove(v.id);
      toast.success('Video deleted.');
      setVideos((list) => list.filter((x) => x.id !== v.id));
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Video Library"
        subtitle="Sacred ceremonies & discourses on demand"
        breadcrumb={[{ label: 'Media', to: '/media' }, { label: 'Videos' }]}
        actions={<Link to="/media/upload"><Button icon={Upload}>Upload Video</Button></Link>}
      />

      {loading && <p className="py-6 text-center text-sm text-neutral-500">Loading videos…</p>}
      {!loading && videos.length === 0 && <p className="py-10 text-center text-sm text-neutral-500">No videos yet.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {videos.map((v) => (
          <Card key={v.id} hover className="overflow-hidden group">
            <div className="relative aspect-video overflow-hidden cursor-pointer">
              <img src={resolveMedia(v.thumb)} onError={onImgError} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <button onClick={() => remove(v)} className="absolute top-3 right-3 z-10 p-1.5 rounded-lg bg-black/40 backdrop-blur text-white hover:bg-rose-500/70 opacity-0 group-hover:opacity-100 transition"><Trash2 className="w-4 h-4" /></button>
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

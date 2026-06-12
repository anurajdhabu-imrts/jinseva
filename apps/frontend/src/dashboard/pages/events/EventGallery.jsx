import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Upload, ImagePlus, Trash2 } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import Card from '@components/Card';
import Button from '@components/Button';
import SearchBar from '@components/SearchBar';
import Modal from '@components/Modal';
import { Select } from '@components/Input';
import { cn } from '@utils/cn';
import { useToast } from '@context/ToastContext';
import { eventsApi, mediaApi, resolveMedia, apiError } from '@services/rbacService';
import { onImgError } from '@utils/constants';

const GENERAL = 'General';

export default function EventGallery() {
  const { toast } = useToast();
  const [events, setEvents] = useState([]);
  const [images, setImages] = useState([]); // media photo records
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeEvent, setActiveEvent] = useState('all'); // 'all' | 'General' | <event title>
  const [uploadOpen, setUploadOpen] = useState(false);

  const eventTitles = useMemo(() => new Set(events.map((e) => e.title)), [events]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [evs, photos] = await Promise.all([
        eventsApi.list().catch(() => []),
        mediaApi.list({ type: 'photo' }),
      ]);
      setEvents(evs || []);
      setImages(photos || []);
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  // Chips: All, one per event (by title), then General (photos not tied to an event)
  const eventChips = useMemo(() => {
    const countFor = (title) => images.filter((img) => img.category === title).length;
    return [
      { id: 'all', label: 'All', count: images.length },
      ...events.map((e) => ({ id: e.title, label: e.title, count: countFor(e.title) })),
      { id: GENERAL, label: GENERAL, count: images.filter((img) => !eventTitles.has(img.category)).length },
    ];
  }, [images, events, eventTitles]);

  const filtered = images.filter((g) => {
    const matchesEvent =
      activeEvent === 'all' ||
      (activeEvent === GENERAL ? !eventTitles.has(g.category) : g.category === activeEvent);
    const matchesSearch = !search || (g.caption || '').toLowerCase().includes(search.toLowerCase());
    return matchesEvent && matchesSearch;
  });

  const handleDelete = async (img) => {
    if (!window.confirm(`Delete "${img.caption}" from the gallery?`)) return;
    try {
      await mediaApi.remove(img.id);
      setImages((prev) => prev.filter((i) => i.id !== img.id));
      toast.success('Photo deleted.');
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Event Gallery"
        subtitle="A visual archive of sacred moments, organised by event — also shown in Media"
        breadcrumb={[{ label: 'Events', to: '/events' }, { label: 'Gallery' }]}
        actions={<Button icon={Upload} onClick={() => setUploadOpen(true)}>Add Images</Button>}
      />

      <Card className="p-4 space-y-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search captions…" />
        <div className="flex flex-wrap gap-2">
          {eventChips.map((chip) => (
            <button
              key={chip.id}
              onClick={() => setActiveEvent(chip.id)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium border transition-colors',
                activeEvent === chip.id
                  ? 'bg-saffron-500 border-saffron-500 text-white'
                  : 'bg-white dark:bg-neutral-900 border-sand-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-saffron-400'
              )}
            >
              {chip.label}
              <span className="ml-1.5 opacity-70">{chip.count}</span>
            </button>
          ))}
        </div>
      </Card>

      {loading ? (
        <p className="py-12 text-center text-sm text-neutral-500">Loading gallery…</p>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center text-neutral-500 dark:text-neutral-400">
          No images yet for this event. Click <span className="font-medium">Add Images</span> to upload.
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((img) => (
            <div key={img.id} className="break-inside-avoid rounded-2xl overflow-hidden group cursor-pointer relative">
              <img src={resolveMedia(img.src)} onError={onImgError} alt={img.caption} className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500" />
              <button
                type="button"
                onClick={() => handleDelete(img)}
                aria-label={`Delete ${img.caption}`}
                className="absolute top-2 right-2 z-10 p-2 rounded-lg bg-black/55 text-white opacity-0 group-hover:opacity-100 hover:bg-jain-red-600 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-4">
                <div className="text-white">
                  <p className="text-xs uppercase tracking-wider opacity-75">{img.category}</p>
                  <p className="font-medium">{img.caption}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        events={events}
        defaultEvent={eventTitles.has(activeEvent) ? activeEvent : ''}
        onUploaded={load}
      />
    </div>
  );
}

function UploadModal({ open, onClose, events, defaultEvent, onUploaded }) {
  const { toast } = useToast();
  const fileRef = useRef(null);
  const [category, setCategory] = useState(defaultEvent || '');
  const [files, setFiles] = useState([]); // { file, preview }
  const [saving, setSaving] = useState(false);

  const reset = () => {
    files.forEach((f) => URL.revokeObjectURL(f.preview));
    setFiles([]);
    setCategory(defaultEvent || '');
  };

  const close = () => {
    reset();
    onClose();
  };

  const addFiles = (list) => {
    const next = Array.from(list)
      .filter((f) => f.type.startsWith('image/'))
      .map((f) => ({ file: f, preview: URL.createObjectURL(f) }));
    setFiles((prev) => [...prev, ...next]);
  };

  const removeFile = (idx) => {
    setFiles((prev) => {
      const f = prev[idx];
      if (f) URL.revokeObjectURL(f.preview);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const save = async () => {
    if (!files.length) return;
    setSaving(true);
    try {
      await mediaApi.upload(files.map((f) => f.file), category || GENERAL);
      toast.success(`${files.length} photo${files.length > 1 ? 's' : ''} added — also visible in Media.`);
      reset();
      onClose();
      onUploaded?.();
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title="Add Images to Event"
      subtitle="Tag photos to an event so they appear under it here and in Media"
      footer={
        <>
          <Button variant="secondary" onClick={close}>Cancel</Button>
          <Button icon={Upload} onClick={save} loading={saving} disabled={!files.length}>
            Add {files.length || ''} {files.length === 1 ? 'image' : 'images'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Select
          label="Event"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={[
            { value: '', label: `${GENERAL} (no specific event)` },
            ...events.map((e) => ({ value: e.title, label: e.title })),
          ]}
        />

        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Images</label>
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
            className="border-2 border-dashed border-sand-300 dark:border-neutral-700 rounded-xl p-8 text-center cursor-pointer hover:border-saffron-400 transition-colors"
          >
            <ImagePlus className="w-8 h-8 mx-auto text-neutral-400 mb-2" />
            <p className="text-sm text-neutral-600 dark:text-neutral-300 font-medium">Click to choose or drag &amp; drop images</p>
            <p className="text-xs text-neutral-400 mt-1">Any image format</p>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
          </div>
        </div>

        {files.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {files.map((f, i) => (
              <div key={i} className="relative rounded-lg overflow-hidden group aspect-square">
                <img src={f.preview} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="absolute top-1 right-1 p-1 rounded-md bg-black/60 text-white opacity-0 group-hover:opacity-100 transition"
                  aria-label="Remove image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}

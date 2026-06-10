import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Image as ImageIcon, Video, X } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import Card, { CardBody, CardHeader } from '@components/Card';
import { Select } from '@components/Input';
import Button from '@components/Button';
import { useToast } from '@context/ToastContext';
import { mediaApi, apiError } from '@services/rbacService';

const CATEGORIES = ['Daily Rituals', 'Festivals', 'Seva', 'Architecture', 'Events', 'Aarti', 'Pooja', 'Discourse'];

export default function MediaUpload() {
  const nav = useNavigate();
  const [files, setFiles] = useState([]); // real File objects
  const [dragging, setDragging] = useState(false);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFiles = (list) => {
    const arr = Array.from(list);
    if (!arr.length) return;
    setFiles((prev) => [...prev, ...arr]);
    toast.success(`${arr.length} file(s) added`);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const upload = async () => {
    if (files.length === 0) return toast.error('Add at least one file.');
    setUploading(true);
    try {
      const res = await mediaApi.upload(files, category);
      toast.success(`Uploaded ${res.count} file(s) to the archive.`);
      setFiles([]);
      nav('/media');
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Upload Media"
        subtitle="Add photos & videos to the temple archive"
        breadcrumb={[{ label: 'Media', to: '/media' }, { label: 'Upload' }]}
      />

      <Card>
        <CardBody>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
              dragging ? 'border-saffron-500 bg-saffron-50 dark:bg-saffron-500/10 scale-[1.01]' : 'border-sand-300 dark:border-neutral-700 hover:border-saffron-400'
            }`}
          >
            <input type="file" multiple accept="image/*,video/*" onChange={(e) => handleFiles(e.target.files)} className="absolute inset-0 opacity-0 cursor-pointer" />
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-saffron-100 to-gold-100 dark:from-saffron-500/20 dark:to-gold-500/20 flex items-center justify-center mb-4">
              <Upload className="w-9 h-9 text-saffron-600" />
            </div>
            <h3 className="font-serif font-semibold text-lg">Drag & drop your files here</h3>
            <p className="text-sm text-neutral-500 mt-1">or click to browse from your device</p>
            <p className="text-xs text-neutral-400 mt-3">JPG, PNG, WebP, MP4, MOV up to 50 MB per file</p>
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {files.length > 0 ? (
            <Card>
              <CardHeader title="Upload queue" subtitle={`${files.length} files`} />
              <CardBody className="space-y-3">
                {files.map((f, i) => {
                  const isImage = (f.type || '').startsWith('image');
                  return (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-sand-50 dark:bg-neutral-800/50">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${
                      isImage ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' : 'bg-gradient-to-br from-violet-400 to-violet-600'
                    }`}>
                      {isImage ? <ImageIcon className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{f.name}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">{(f.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))} className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-500">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  );
                })}
              </CardBody>
            </Card>
          ) : (
            <Card>
              <CardBody>
                <p className="text-center text-neutral-500 py-10">No files added yet.</p>
              </CardBody>
            </Card>
          )}
        </div>
        <Card>
          <CardHeader title="Metadata" subtitle="Applied to all uploads" />
          <CardBody className="space-y-3">
            <Select label="Category" options={CATEGORIES} value={category} onChange={(e) => setCategory(e.target.value)} />
            <Button fullWidth icon={Upload} loading={uploading} onClick={upload} disabled={files.length === 0}>
              Upload {files.length > 0 ? `${files.length} file(s)` : ''}
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

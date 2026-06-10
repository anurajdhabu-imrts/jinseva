import { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { useToast } from '@context/ToastContext';
import { mediaApi, resolveMedia, apiError } from '@services/rbacService';
import { onImgError } from '@utils/constants';

/**
 * Image picker that uploads the selected file to the backend and returns its
 * stored URL via onChange. `value` is the current image URL (relative or absolute).
 */
export default function ImageUpload({ value, onChange, label = 'Banner image', hint = 'PNG, JPG, WebP up to 5 MB' }) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const upload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image')) return toast.error('Please choose an image file.');
    setUploading(true);
    try {
      const url = await mediaApi.uploadFile(file);
      onChange(url);
      toast.success('Image uploaded.');
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">{label}</label>
      )}

      {value ? (
        <div className="relative rounded-2xl overflow-hidden border border-sand-200 dark:border-neutral-800 group">
          <img src={resolveMedia(value)} onError={onImgError} alt="Selected" className="w-full h-48 object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 backdrop-blur text-white hover:bg-rose-500/80"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
          <label className="absolute bottom-2 right-2 px-3 py-1.5 rounded-lg bg-white/90 text-jain-black-900 text-xs font-semibold cursor-pointer hover:bg-white inline-flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5" /> Replace
            <input type="file" accept="image/*" className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
          </label>
        </div>
      ) : (
        <label
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); upload(e.dataTransfer.files?.[0]); }}
          className={`block border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            dragging ? 'border-saffron-500 bg-saffron-50 dark:bg-saffron-500/10' : 'border-sand-300 dark:border-neutral-700 hover:border-saffron-400'
          }`}
        >
          <input type="file" accept="image/*" className="hidden" onChange={(e) => upload(e.target.files?.[0])} disabled={uploading} />
          <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-saffron-100 to-gold-100 dark:from-saffron-500/20 dark:to-gold-500/20 flex items-center justify-center mb-3">
            {uploading ? <Loader2 className="w-6 h-6 text-saffron-600 animate-spin" /> : <Upload className="w-6 h-6 text-saffron-600" />}
          </div>
          <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
            {uploading ? 'Uploading…' : 'Click or drag an image to upload'}
          </p>
          <p className="text-xs text-neutral-500 mt-1">{hint}</p>
        </label>
      )}
    </div>
  );
}

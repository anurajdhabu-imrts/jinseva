import { useEffect, useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { useToast } from '@context/ToastContext';
import { resolveMedia } from '@services/rbacService';
import { onImgError } from '@utils/constants';

/**
 * Reads an image File entirely in the browser, downscales it to `maxDim` and
 * returns a compressed JPEG data URL. No network, no temp file — so it always
 * renders and can't be lost. Works for any input format the browser can decode
 * (PNG/JPG/WebP/GIF/AVIF/HEIC where supported).
 */
function fileToDataUrl(file, maxDim = 1280, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const objUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objUrl);
      let { width, height } = img;
      if (Math.max(width, height) > maxDim) {
        const s = maxDim / Math.max(width, height);
        width = Math.round(width * s);
        height = Math.round(height * s);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff'; // flatten any transparency
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => { URL.revokeObjectURL(objUrl); reject(new Error('That file could not be read as an image.')); };
    img.src = objUrl;
  });
}

/**
 * Image picker. Stores the chosen image inline as a compressed data URL via
 * onChange — there is no separate upload step, so the image can never end up
 * un-linked, missing on disk, or in an unrenderable format. `value` may be a
 * data URL or a legacy "/uploads/.." URL; both display.
 */
export default function ImageUpload({ value, onChange, onUploadingChange, onPending, label = 'Banner image', hint = 'Any image format' }) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [localPreview, setLocalPreview] = useState(null); // object URL of the just-picked file

  // Revoke the object URL when it changes / on unmount.
  useEffect(() => () => { if (localPreview) URL.revokeObjectURL(localPreview); }, [localPreview]);

  const setBusy = (v) => { setUploading(v); onUploadingChange?.(v); };

  const upload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image')) return toast.error('Please choose an image file.');
    // Show the picked image instantly.
    const preview = URL.createObjectURL(file);
    setLocalPreview(preview);
    setBusy(true);
    // Expose the processing task so a parent's Save can await it (no race).
    const task = (async () => {
      const dataUrl = await fileToDataUrl(file);
      onChange(dataUrl);
      return dataUrl;
    })();
    onPending?.(task);
    try {
      await task;
      toast.success('Image added.');
    } catch (err) {
      setLocalPreview(null);
      toast.error(err.message || 'Could not read that image.');
    } finally {
      setBusy(false);
      onPending?.(null);
    }
  };

  const clear = () => {
    setLocalPreview(null);
    onChange('');
  };

  const displaySrc = localPreview || resolveMedia(value);
  const hasImage = !!(localPreview || value);

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">{label}</label>
      )}

      {hasImage ? (
        <div className="relative rounded-2xl overflow-hidden border border-sand-200 dark:border-neutral-800 group">
          <img src={displaySrc} onError={onImgError} alt="Selected" className="w-full h-48 object-cover" />
          {uploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Loader2 className="w-7 h-7 text-white animate-spin" />
            </div>
          )}
          <button
            type="button"
            onClick={clear}
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

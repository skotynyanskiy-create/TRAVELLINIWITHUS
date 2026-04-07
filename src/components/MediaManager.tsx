import { useState, useEffect } from 'react';
import { ref, uploadBytes, listAll, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../lib/firebaseStorage';
import { Upload, Trash2, Loader2 } from 'lucide-react';

export default function MediaManager() {
  const [files, setFiles] = useState<{ name: string; url: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    const listRef = ref(storage, 'uploads/');
    try {
      const res = await listAll(listRef);
      const filePromises = res.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        return { name: itemRef.name, url };
      });
      const fetchedFiles = await Promise.all(filePromises);
      setFiles(fetchedFiles);
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    const file = e.target.files[0];
    const storageRef = ref(storage, `uploads/${file.name}`);
    try {
      await uploadBytes(storageRef, file);
      await fetchFiles();
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (name: string) => {
    if (!window.confirm("Sei sicuro di voler eliminare questo file?")) return;
    const fileRef = ref(storage, `uploads/${name}`);
    try {
      await deleteObject(fileRef);
      await fetchFiles();
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-serif">Media Manager</h2>
        <label className="bg-[var(--color-ink)] text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-[var(--color-accent)] transition-colors cursor-pointer">
          {uploading ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
          {uploading ? 'Caricamento...' : 'Carica File'}
          <input type="file" className="hidden" onChange={handleUpload} />
        </label>
      </div>

      {loading ? (
        <div className="text-center py-12">Caricamento...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {files.map(file => (
            <div key={file.name} className="group relative rounded-2xl overflow-hidden border border-zinc-200">
              <img src={file.url} alt={file.name} className="w-full h-32 object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button onClick={() => handleDelete(file.name)} className="p-2 bg-white rounded-full text-red-500 hover:bg-red-50">
                  <Trash2 size={18} />
                </button>
              </div>
              <p className="p-2 text-xs truncate">{file.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

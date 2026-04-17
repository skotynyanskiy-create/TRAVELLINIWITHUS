import { motion } from 'motion/react';
import { Instagram } from 'lucide-react';
import { CONTACTS } from '../config/site';

const INSTA_IMAGES = [
  'https://images.unsplash.com/photo-1516483638261-f40af5aa34ce?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1498307833015-e7b400441eb8?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=800&auto=format&fit=crop',
];

export default function InstagramGrid() {
  return (
    <section className="bg-white pb-0 pt-0">
      <div className="flex w-full items-center justify-between px-6 pb-6 md:px-12">
        <div>
          <h3 className="text-2xl font-serif text-ink md:text-3xl">Seguici su Instagram</h3>
          <p className="mt-1 text-sm text-black/60">
            Ispirazione quotidiana per il prossimo viaggio.
          </p>
        </div>
        <a
          href={CONTACTS.instagramUrl}
          target="_blank"
          rel="noreferrer"
          className="hidden md:inline-flex items-center gap-2 rounded-full border border-black/10 px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-ink transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
        >
          <Instagram size={14} /> {CONTACTS.instagramHandle}
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 border-b border-t border-black/5">
        {INSTA_IMAGES.map((src, idx) => (
          <motion.a
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.6 }}
            key={idx}
            href={CONTACTS.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="group relative aspect-square overflow-hidden bg-ink"
          >
            <img
              src={src}
              alt="Travelliniwithus Instagram post"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <Instagram size={32} className="text-white" />
            </div>
          </motion.a>
        ))}
      </div>

      <div className="flex justify-center pt-6 pb-6 md:hidden">
        <a
          href={CONTACTS.instagramUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-black/10 px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-ink transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
        >
          <Instagram size={14} /> {CONTACTS.instagramHandle}
        </a>
      </div>
    </section>
  );
}

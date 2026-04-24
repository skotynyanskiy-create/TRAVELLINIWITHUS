import { motion } from 'motion/react';
import { ArrowUpRight, Instagram } from 'lucide-react';
import OptimizedImage from '../OptimizedImage';
import { BRAND_STATS, CONTACTS } from '../../config/site';
import { trackEvent } from '../../services/analytics';

export interface InstagramPost {
  id: string;
  image: string;
  caption: string;
  permalink: string;
}

const DEMO_POSTS: InstagramPost[] = [
  {
    id: 'demo-1',
    image:
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1400&auto=format&fit=crop',
    caption: 'Tramonto sui tetti di Parigi',
    permalink: CONTACTS.instagramUrl,
  },
  {
    id: 'demo-2',
    image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1400&auto=format&fit=crop',
    caption: 'Sentieri dolomitici all alba',
    permalink: CONTACTS.instagramUrl,
  },
  {
    id: 'demo-3',
    image:
      'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1400&auto=format&fit=crop',
    caption: 'Borgo bianco di Puglia',
    permalink: CONTACTS.instagramUrl,
  },
  {
    id: 'demo-4',
    image:
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1400&auto=format&fit=crop',
    caption: 'Spiagge nascoste della Sardegna',
    permalink: CONTACTS.instagramUrl,
  },
  {
    id: 'demo-5',
    image:
      'https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=1400&auto=format&fit=crop',
    caption: 'Cicladi: luce di mezzogiorno',
    permalink: CONTACTS.instagramUrl,
  },
  {
    id: 'demo-6',
    image:
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1400&auto=format&fit=crop',
    caption: 'Street food a Napoli',
    permalink: CONTACTS.instagramUrl,
  },
];

interface InstagramFeedProps {
  posts?: InstagramPost[];
}

export default function InstagramFeed({ posts }: InstagramFeedProps) {
  const items = posts && posts.length > 0 ? posts.slice(0, 6) : DEMO_POSTS;

  return (
    <section className="bg-sand py-20 md:py-28">
      <div className="mx-auto max-w-328 px-6 md:px-10 xl:px-12">
        <motion.div
          className="mb-10 grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-end"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-text">
              Dietro le quinte
            </span>
            <h2 className="mt-4 text-4xl font-serif leading-[1.05] text-ink md:text-5xl">
              Segui i nostri viaggi
              <span className="italic text-black/55"> giorno per giorno.</span>
            </h2>
          </div>
          <div className="flex flex-col items-start gap-4 md:items-end">
            <p className="max-w-md text-base leading-relaxed text-black/62 md:text-right">
              Foto, video e piccole scoperte che non finiscono nelle guide. Su Instagram siamo
              {` ${BRAND_STATS.instagramFollowers} `}
              persone a viaggiare insieme.
            </p>
            <a
              href={CONTACTS.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent('instagram_follow_click', { placement: 'home_feed_header' })
              }
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-accent"
            >
              <Instagram size={16} />
              Seguici su Instagram
            </a>
          </div>
        </motion.div>

        <motion.ul
          role="list"
          className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          {items.map((post) => (
            <li key={post.id} className="contents">
              <a
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent('instagram_post_click', {
                    post_id: post.id,
                    placement: 'home_feed_grid',
                  })
                }
                className="group relative aspect-square overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-500 hover:-translate-y-0.5 hover:shadow-lg"
                aria-label={post.caption}
              >
                <OptimizedImage
                  src={post.image}
                  alt={post.caption}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-end justify-end bg-linear-to-t from-black/60 via-black/0 to-black/0 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-ink shadow-md">
                    <ArrowUpRight size={16} />
                  </span>
                </div>
              </a>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

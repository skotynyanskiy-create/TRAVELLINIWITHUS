import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { renderToFile } from '@react-pdf/renderer';
import { CONTACTS, BRAND_STATS, SITE_URL } from '../src/config/site';
import { siteContentDefaults } from '../src/config/siteContent';
import {
  MediaKitDocument,
  type MediaKitFormat,
  type MediaKitStat,
} from '../src/pdf/MediaKitDocument';

dotenv.config();

const outputPath = path.join(process.cwd(), 'public', 'media-kit.pdf');

function getFallbackAudienceStats(): MediaKitStat[] {
  return [
    { label: 'Follower Instagram', value: BRAND_STATS.instagramFollowers },
    { label: 'Follower TikTok', value: BRAND_STATS.tiktokFollowers },
    { label: 'Reach mensile', value: BRAND_STATS.monthlyReach },
    { label: 'Engagement rate', value: BRAND_STATS.engagementRate },
  ];
}

function getFormats(): MediaKitFormat[] {
  return siteContentDefaults.collaborations.collaborationFormats.map((format) => ({
    title: format.title,
    subtitle: format.subtitle,
    features: format.features,
    highlight: format.highlight,
  }));
}

async function main() {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  /* I numeri del PDF vengono SOLO da `BRAND_STATS`, costante di build.
   *
   * Qui c'era `fetchLiveAudienceStats()`, che leggeva il documento Firestore
   * `settings/stats` — lo stesso che la tab «stats» del pannello admin apre
   * pre-compilata con valori mai misurati. Il PDF parte via email a un partner:
   * e' l'ultimo posto in cui un numero puo' essere il residuo di un form
   * salvato per sbaglio. Stessa recisione fatta su `/collaborazioni` il
   * 2026-08-15, per lo stesso motivo.
   *
   * Quando ci saranno numeri veri da export Meta/TikTok, la strada e'
   * aggiornare `BRAND_STATS` con una modifica che si vede in un diff. */
  const audienceStats = getFallbackAudienceStats();
  const formats = getFormats();
  const services = siteContentDefaults.collaborations.services.map((service) => service.title);
  const downloadUrl =
    process.env.MEDIA_KIT_URL || `${process.env.APP_URL || SITE_URL}/media-kit.pdf`;

  await renderToFile(
    <MediaKitDocument
      generatedAt={new Intl.DateTimeFormat('it-IT', { dateStyle: 'long' }).format(new Date())}
      downloadUrl={downloadUrl}
      audienceStats={audienceStats}
      brandHighlights={[
        'Posti particolari raccontati con taglio editoriale e consigli pratici.',
        'Community reale costruita tra Instagram, TikTok e sito proprietario.',
        'Collaborazioni selezionate con piena libertà editoriale e disclosure chiara.',
      ]}
      services={services}
      formats={formats}
      contacts={{
        email: CONTACTS.email,
        instagram: CONTACTS.instagramUrl,
        tiktok: CONTACTS.tiktokUrl,
        website: SITE_URL,
        whatsapp: CONTACTS.whatsappDisplay,
      }}
    />,
    outputPath
  );

  const stat = fs.statSync(outputPath);
  console.log(
    `[generate-media-kit] PDF generated: ${outputPath} (${Math.round(stat.size / 1024)} KB)`
  );
}

void main().catch((error) => {
  console.error('[generate-media-kit] Failed to generate media kit PDF.', error);
  process.exitCode = 1;
});

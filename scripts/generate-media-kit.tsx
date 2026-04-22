import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { renderToFile } from '@react-pdf/renderer';
import { CONTACTS, BRAND_STATS, SITE_URL } from '../src/config/site';
import { siteContentDefaults } from '../src/config/siteContent';
import { MediaKitDocument, type MediaKitFormat, type MediaKitStat } from '../src/pdf/MediaKitDocument';

dotenv.config();

interface FirestoreValue {
  stringValue?: string;
}

interface FirestoreDocument {
  fields?: Record<string, FirestoreValue>;
}

const outputPath = path.join(process.cwd(), 'public', 'media-kit.pdf');
const firebaseConfigPath = path.join(process.cwd(), 'firebase-applet-config.json');

function getString(fields: Record<string, FirestoreValue> | undefined, key: string) {
  return fields?.[key]?.stringValue?.trim() || '';
}

async function fetchLiveAudienceStats(): Promise<MediaKitStat[] | null> {
  if (!fs.existsSync(firebaseConfigPath)) {
    return null;
  }

  try {
    const firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, 'utf8')) as {
      projectId?: string;
      firestoreDatabaseId?: string;
    };

    if (!firebaseConfig.projectId || !firebaseConfig.firestoreDatabaseId) {
      return null;
    }

    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${firebaseConfig.firestoreDatabaseId}/documents/settings/stats`,
    );

    if (!response.ok) {
      return null;
    }

    const doc = (await response.json()) as FirestoreDocument;
    const fields = doc.fields;
    const stats = [
      { label: 'Follower Instagram', value: getString(fields, 'igFollowers') },
      { label: 'Reach mensile', value: getString(fields, 'monthlyReach') },
      { label: 'Audience totale', value: getString(fields, 'uniqueUsers') },
      { label: 'Engagement rate', value: getString(fields, 'engagementRate') },
    ].filter((item) => item.value);

    return stats.length > 0 ? stats : null;
  } catch (error) {
    console.warn('[generate-media-kit] Impossibile leggere stats live, uso fallback locale.', error);
    return null;
  }
}

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

  const audienceStats = (await fetchLiveAudienceStats()) ?? getFallbackAudienceStats();
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
    outputPath,
  );

  const stat = fs.statSync(outputPath);
  console.log(`[generate-media-kit] PDF generated: ${outputPath} (${Math.round(stat.size / 1024)} KB)`);
}

void main().catch((error) => {
  console.error('[generate-media-kit] Failed to generate media kit PDF.', error);
  process.exitCode = 1;
});

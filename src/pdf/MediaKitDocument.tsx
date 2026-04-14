import React from 'react';
import { Document, Link, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

export interface MediaKitStat {
  label: string;
  value: string;
}

export interface MediaKitFormat {
  title: string;
  subtitle: string;
  features: string[];
  highlight?: string;
}

interface MediaKitDocumentProps {
  generatedAt: string;
  downloadUrl: string;
  audienceStats: MediaKitStat[];
  brandHighlights: string[];
  services: string[];
  formats: MediaKitFormat[];
  contacts: {
    email: string;
    instagram: string;
    tiktok: string;
    website: string;
    whatsapp: string;
  };
}

const colors = {
  ink: '#171717',
  body: '#3f3f46',
  sand: '#f6f1e8',
  line: '#e7dcc9',
  accent: '#b08b63',
  accentSoft: '#f1e6d6',
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 42,
    paddingHorizontal: 40,
    fontSize: 11,
    lineHeight: 1.5,
    color: colors.body,
    backgroundColor: '#ffffff',
  },
  cover: {
    backgroundColor: colors.sand,
  },
  eyebrow: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.accent,
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 28,
    lineHeight: 1.2,
    color: colors.ink,
    marginBottom: 14,
  },
  heroSubtitle: {
    fontSize: 13,
    lineHeight: 1.6,
    marginBottom: 28,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: '#ffffff',
    color: colors.ink,
    borderWidth: 1,
    borderColor: colors.line,
    fontSize: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 17,
    color: colors.ink,
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    width: '48%',
    padding: 14,
    borderRadius: 12,
    backgroundColor: colors.sand,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: 10,
  },
  statValue: {
    fontSize: 18,
    color: colors.ink,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  listItem: {
    marginBottom: 8,
  },
  bullet: {
    color: colors.accent,
  },
  formatCard: {
    marginBottom: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
  },
  formatTitle: {
    fontSize: 14,
    color: colors.ink,
    marginBottom: 4,
  },
  formatSubtitle: {
    marginBottom: 8,
  },
  highlight: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    backgroundColor: colors.accentSoft,
    color: colors.ink,
    borderRadius: 8,
    fontSize: 10,
    marginBottom: 8,
  },
  footerBand: {
    marginTop: 'auto',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    fontSize: 10,
    color: colors.body,
  },
  link: {
    color: colors.accent,
    textDecoration: 'none',
  },
});

function BulletList({ items }: { items: string[] }) {
  return (
    <View>
      {items.map((item) => (
        <Text key={item} style={styles.listItem}>
          <Text style={styles.bullet}>• </Text>
          {item}
        </Text>
      ))}
    </View>
  );
}

export function MediaKitDocument({
  generatedAt,
  downloadUrl,
  audienceStats,
  brandHighlights,
  services,
  formats,
  contacts,
}: MediaKitDocumentProps) {
  return (
    <Document
      title="Travelliniwithus Media Kit"
      author="Travelliniwithus"
      subject="Media kit brand collaborations"
      keywords="travel, media kit, collaborations, creator"
    >
      <Page size="A4" style={[styles.page, styles.cover]}>
        <Text style={styles.eyebrow}>Travelliniwithus Media Kit</Text>
        <Text style={styles.heroTitle}>Posti particolari, raccontati con criterio.</Text>
        <Text style={styles.heroSubtitle}>
          Rodrigo & Betta costruiscono contenuti travel editoriali che uniscono utilità,
          storytelling visivo e fiducia. Questo documento raccoglie il quadro minimo per valutare
          una collaborazione coerente.
        </Text>

        <View style={styles.chipRow}>
          <Text style={styles.chip}>Travel creator couple</Text>
          <Text style={styles.chip}>Editorial travel content</Text>
          <Text style={styles.chip}>Hospitality + destinations + lifestyle</Text>
          <Text style={styles.chip}>Italian audience</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Perché funziona</Text>
          <BulletList items={brandHighlights} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ambiti principali</Text>
          <BulletList items={services} />
        </View>

        <View style={styles.footerBand}>
          <Text>Versione generata il {generatedAt}</Text>
          <Text>
            Download pubblico: <Link src={downloadUrl} style={styles.link}>{downloadUrl}</Link>
          </Text>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Audience snapshot</Text>
          <View style={styles.grid}>
            {audienceStats.map((stat) => (
              <View key={stat.label} style={styles.statCard}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Approccio editoriale</Text>
          <BulletList
            items={[
              'Visitato davvero: i consigli nascono da viaggi e sopralluoghi reali.',
              'Linguaggio accessibile ma curato, con taglio magazine e utility concreta.',
              'Nessun contenuto pubblicato senza coerenza con il brand e il pubblico.',
              'Formati pensati per raccontare il luogo, non solo mostrare il brand.',
            ]}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Canali e contatto</Text>
          <BulletList
            items={[
              `Website: ${contacts.website}`,
              `Instagram: ${contacts.instagram}`,
              `TikTok: ${contacts.tiktok}`,
              `Email: ${contacts.email}`,
              `WhatsApp: ${contacts.whatsapp}`,
            ]}
          />
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Formati di collaborazione</Text>
          {formats.map((format) => (
            <View key={format.title} style={styles.formatCard}>
              <Text style={styles.formatTitle}>{format.title}</Text>
              <Text style={styles.formatSubtitle}>{format.subtitle}</Text>
              {format.highlight ? <Text style={styles.highlight}>{format.highlight}</Text> : null}
              <BulletList items={format.features} />
            </View>
          ))}
        </View>

        <View style={styles.footerBand}>
          <Text>
            Per richieste partnership: <Link src={`mailto:${contacts.email}`} style={styles.link}>{contacts.email}</Link>
          </Text>
        </View>
      </Page>
    </Document>
  );
}

export default MediaKitDocument;

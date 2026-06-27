import React from 'react';
import { Document, Link, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

/**
 * ItineraryDocument — PDF brand-coherent per piano viaggio costruito
 * con ItineraryBuilder (Marathon FASE 3.A 2026-05-18).
 *
 * Pattern visivo allineato a LeadMagnetDocument: stessa palette,
 * stessa tipografia, footer + cover coerenti.
 *
 * Layout:
 * - Page 1 (cover): brand + titolo destinazione + giorni + dek
 * - Page 2..N: una pagina per giorno con POI numerati + note R+B
 * - Footer ogni pagina: handle social + URL
 */

export interface ItineraryPdfPoi {
  number: string; // "01", "02", ...
  name: string;
  category: string;
  durationMin: number;
  description: string;
  rbNote?: string;
}

export interface ItineraryPdfDay {
  day: number;
  totalHours: number;
  pois: ItineraryPdfPoi[];
}

interface ItineraryDocumentProps {
  destinationName: string;
  daysCount: number;
  generatedAt: string; // ISO date
  days: ItineraryPdfDay[];
  contacts: {
    instagram: string;
    tiktok: string;
    website: string;
  };
}

const colors = {
  ink: '#0a0a0a',
  ink2: '#44403c',
  body: '#57534e',
  muted: '#78716c',
  sand: '#fafafa',
  sandWarm: '#f6f1e8',
  line: '#e7e5e4',
  accent: '#ea580c',
  accentText: '#9a3412',
  accentSoft: '#fff7ed',
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 44,
    paddingBottom: 56,
    paddingHorizontal: 44,
    fontSize: 11,
    lineHeight: 1.6,
    color: colors.body,
    backgroundColor: '#ffffff',
  },

  // ─── Cover ────────────────────────────────────────────────────
  cover: {
    backgroundColor: colors.sandWarm,
    justifyContent: 'space-between',
  },
  coverTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandName: {
    fontSize: 14,
    color: colors.ink,
    letterSpacing: 0.5,
  },
  brandTag: {
    fontSize: 9,
    color: colors.accentText,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  coverHeader: {
    marginTop: 80,
  },
  coverEyebrow: {
    fontSize: 10,
    color: colors.accentText,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 20,
  },
  coverTitle: {
    fontSize: 42,
    lineHeight: 1.05,
    color: colors.ink,
    marginBottom: 14,
  },
  coverTitleItalic: {
    fontStyle: 'italic',
    color: colors.ink2,
  },
  coverDek: {
    fontSize: 13,
    lineHeight: 1.6,
    color: colors.ink2,
    maxWidth: 380,
  },
  coverMeta: {
    marginTop: 50,
    flexDirection: 'row',
    gap: 30,
  },
  coverMetaItem: {
    flexDirection: 'column',
  },
  coverMetaLabel: {
    fontSize: 8,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 4,
  },
  coverMetaValue: {
    fontSize: 22,
    color: colors.ink,
  },
  coverFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  coverNote: {
    fontSize: 10,
    color: colors.body,
    maxWidth: 340,
    lineHeight: 1.5,
  },
  coverDate: {
    fontSize: 9,
    color: colors.muted,
    letterSpacing: 0.5,
  },

  // ─── Day pages ────────────────────────────────────────────────
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: 14,
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  dayHeaderLeft: {
    flexDirection: 'column',
  },
  dayLabel: {
    fontSize: 9,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 2.5,
    marginBottom: 6,
  },
  dayTitle: {
    fontSize: 26,
    color: colors.ink,
    lineHeight: 1.1,
  },
  dayMeta: {
    fontSize: 10,
    color: colors.muted,
    letterSpacing: 0.5,
  },

  poiBlock: {
    marginBottom: 18,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  poiHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  poiNumber: {
    fontSize: 9,
    color: colors.muted,
    letterSpacing: 1.5,
    width: 28,
  },
  poiName: {
    fontSize: 15,
    color: colors.ink,
    flex: 1,
  },
  poiMeta: {
    fontSize: 9,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginLeft: 28,
    marginBottom: 6,
  },
  poiDescription: {
    fontSize: 10.5,
    color: colors.body,
    lineHeight: 1.55,
    marginLeft: 28,
  },
  poiRbNote: {
    fontSize: 10,
    color: colors.accentText,
    backgroundColor: colors.accentSoft,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 28,
    marginTop: 10,
    borderLeftWidth: 2,
    borderLeftColor: colors.accent,
    lineHeight: 1.5,
  },
  poiRbNoteLabel: {
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.accent,
    marginBottom: 4,
  },

  emptyDay: {
    backgroundColor: colors.sand,
    paddingHorizontal: 24,
    paddingVertical: 28,
    fontSize: 10.5,
    color: colors.body,
    fontStyle: 'italic',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: colors.line,
  },

  // ─── Page footer ──────────────────────────────────────────────
  pageFooter: {
    position: 'absolute',
    bottom: 24,
    left: 44,
    right: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  footerHandle: {
    fontSize: 9,
    color: colors.muted,
    letterSpacing: 0.5,
  },
  footerUrl: {
    fontSize: 9,
    color: colors.accentText,
    textDecoration: 'none',
    letterSpacing: 0.5,
  },
});

function formatDate(iso: string): string {
  const date = new Date(iso);
  const months = [
    'gennaio',
    'febbraio',
    'marzo',
    'aprile',
    'maggio',
    'giugno',
    'luglio',
    'agosto',
    'settembre',
    'ottobre',
    'novembre',
    'dicembre',
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function PageFooter({ contacts }: { contacts: ItineraryDocumentProps['contacts'] }) {
  return (
    <View style={styles.pageFooter} fixed>
      <Text style={styles.footerHandle}>
        @travelliniwithus · {contacts.instagram} · {contacts.tiktok}
      </Text>
      <Link src={contacts.website} style={styles.footerUrl}>
        {contacts.website.replace(/^https?:\/\//, '')}
      </Link>
    </View>
  );
}

export default function ItineraryDocument({
  destinationName,
  daysCount,
  generatedAt,
  days,
  contacts,
}: ItineraryDocumentProps) {
  const totalPois = days.reduce((sum, d) => sum + d.pois.length, 0);
  const totalHours = days.reduce((sum, d) => sum + d.totalHours, 0);

  return (
    <Document
      title={`Itinerario ${destinationName} — Travelliniwithus`}
      author="Travelliniwithus"
      subject={`Itinerario ${destinationName} ${daysCount} giorni`}
      creator="Travelliniwithus / ItineraryBuilder"
      keywords={`viaggio,${destinationName.toLowerCase()},itinerario,coppia,travelliniwithus`}
    >
      {/* Cover */}
      <Page size="A4" style={[styles.page, styles.cover]}>
        <View style={styles.coverTopRow}>
          <Text style={styles.brandName}>Travelliniwithus</Text>
          <Text style={styles.brandTag}>Itinerario costruito a mano</Text>
        </View>

        <View>
          <View style={styles.coverHeader}>
            <Text style={styles.coverEyebrow}>Il vostro piano</Text>
            <Text style={styles.coverTitle}>
              {daysCount} giorni in {destinationName},{'\n'}
              <Text style={styles.coverTitleItalic}>su tappe che abbiamo provato.</Text>
            </Text>
            <Text style={styles.coverDek}>
              Catalogo curato a mano da Rodrigo &amp; Betta. Ogni tappa con dettagli pratici, orari,
              prezzi e indicazioni operative dai nostri field report.
            </Text>
          </View>

          <View style={styles.coverMeta}>
            <View style={styles.coverMetaItem}>
              <Text style={styles.coverMetaLabel}>Giorni</Text>
              <Text style={styles.coverMetaValue}>{daysCount}</Text>
            </View>
            <View style={styles.coverMetaItem}>
              <Text style={styles.coverMetaLabel}>Tappe totali</Text>
              <Text style={styles.coverMetaValue}>{totalPois}</Text>
            </View>
            <View style={styles.coverMetaItem}>
              <Text style={styles.coverMetaLabel}>Ore stimate</Text>
              <Text style={styles.coverMetaValue}>{Math.round(totalHours)}h</Text>
            </View>
          </View>
        </View>

        <View style={styles.coverFooter}>
          <Text style={styles.coverNote}>
            Questo PDF è un piano modificabile. I dati pratici (prezzi, orari) sono riferiti al
            periodo dei nostri viaggi. Verifica freschezza prima della partenza.
          </Text>
          <Text style={styles.coverDate}>{formatDate(generatedAt)}</Text>
        </View>
      </Page>

      {/* Day pages */}
      {days.map((day) => (
        <Page key={day.day} size="A4" style={styles.page} wrap>
          <View style={styles.dayHeader}>
            <View style={styles.dayHeaderLeft}>
              <Text style={styles.dayLabel}>
                Giorno {day.day} di {daysCount}
              </Text>
              <Text style={styles.dayTitle}>
                {day.pois.length} {day.pois.length === 1 ? 'tappa' : 'tappe'} · {destinationName}
              </Text>
            </View>
            <Text style={styles.dayMeta}>
              {day.totalHours > 0 ? `~${Math.round(day.totalHours)}h totali` : 'da pianificare'}
            </Text>
          </View>

          {day.pois.length === 0 ? (
            <Text style={styles.emptyDay}>
              Giorno libero. Lo riempirete in viaggio o lo lasciate così di proposito.
            </Text>
          ) : (
            day.pois.map((poi) => (
              <View key={`${day.day}-${poi.number}`} style={styles.poiBlock} wrap={false}>
                <View style={styles.poiHeader}>
                  <Text style={styles.poiNumber}>{poi.number}</Text>
                  <Text style={styles.poiName}>{poi.name}</Text>
                </View>
                <Text style={styles.poiMeta}>
                  {poi.category} ·{' '}
                  {poi.durationMin >= 60
                    ? `${Math.round((poi.durationMin / 60) * 10) / 10}h`
                    : `${poi.durationMin}m`}
                </Text>
                <Text style={styles.poiDescription}>{poi.description}</Text>
                {poi.rbNote && (
                  <View style={styles.poiRbNote}>
                    <Text style={styles.poiRbNoteLabel}>Nota R+B</Text>
                    <Text>{poi.rbNote}</Text>
                  </View>
                )}
              </View>
            ))
          )}

          <PageFooter contacts={contacts} />
        </Page>
      ))}
    </Document>
  );
}

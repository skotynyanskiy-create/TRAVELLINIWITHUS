import React from 'react';
import { Document, Link, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

export interface LeadMagnetLocation {
  /** Numero d'ordine, es. "01" */
  number: string;
  /** Nome del luogo */
  name: string;
  /** Regione / paese */
  region: string;
  /** 2-3 frasi: perché vale la pena, atmosfera */
  why: string;
  /** Come arrivare (treno/auto/aereo + ultimo miglio) */
  howToReach: string;
  /** Mesi migliori e perché */
  bestTime: string;
  /** Stima costo per coppia (notte / viaggio breve) */
  costEstimate: string;
  /** Consiglio insider — 1 frase */
  insiderTip: string;
}

interface LeadMagnetDocumentProps {
  generatedAt: string;
  landingUrl: string;
  locations: LeadMagnetLocation[];
  contacts: {
    email: string;
    instagram: string;
    tiktok: string;
    website: string;
  };
}

const colors = {
  ink: '#0a0a0a',
  ink2: '#44403c',
  body: '#57534e',
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
    paddingBottom: 44,
    paddingHorizontal: 44,
    fontSize: 11,
    lineHeight: 1.6,
    color: colors.body,
    backgroundColor: '#ffffff',
  },
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
  coverTitle: {
    fontSize: 38,
    lineHeight: 1.1,
    color: colors.ink,
    marginBottom: 16,
    marginTop: 'auto',
  },
  coverSubtitle: {
    fontSize: 14,
    lineHeight: 1.6,
    color: colors.ink2,
    marginBottom: 32,
    maxWidth: 380,
  },
  coverFooter: {
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 9,
  },
  intro: {
    paddingTop: 60,
  },
  introEyebrow: {
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.accent,
    marginBottom: 14,
  },
  introTitle: {
    fontSize: 22,
    lineHeight: 1.3,
    color: colors.ink,
    marginBottom: 16,
  },
  introParagraph: {
    fontSize: 12,
    lineHeight: 1.7,
    marginBottom: 14,
  },
  tocList: {
    marginTop: 28,
  },
  tocItem: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  tocNumber: {
    width: 32,
    fontSize: 10,
    color: colors.accent,
  },
  tocName: {
    flex: 1,
    fontSize: 12,
    color: colors.ink,
  },
  tocRegion: {
    fontSize: 10,
    color: colors.body,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 6,
  },
  locationNumber: {
    fontSize: 48,
    lineHeight: 1,
    color: colors.accentSoft,
  },
  locationRegion: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: colors.accentText,
  },
  locationName: {
    fontSize: 28,
    lineHeight: 1.15,
    color: colors.ink,
    marginTop: 6,
    marginBottom: 18,
  },
  locationWhy: {
    fontSize: 12,
    lineHeight: 1.7,
    color: colors.ink2,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    gap: 18,
    marginBottom: 14,
  },
  detailCol: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: colors.accent,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 11,
    lineHeight: 1.5,
    color: colors.ink2,
  },
  tipBlock: {
    marginTop: 'auto',
    padding: 14,
    backgroundColor: colors.accentSoft,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  tipLabel: {
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: colors.accent,
    marginBottom: 4,
  },
  tipText: {
    fontSize: 11,
    lineHeight: 1.6,
    color: colors.ink,
  },
  finalPage: {
    backgroundColor: colors.sandWarm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  finalEyebrow: {
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.accent,
    marginBottom: 14,
  },
  finalTitle: {
    fontSize: 26,
    lineHeight: 1.2,
    color: colors.ink,
    marginBottom: 14,
    textAlign: 'center',
    maxWidth: 380,
  },
  finalParagraph: {
    fontSize: 12,
    lineHeight: 1.7,
    color: colors.ink2,
    textAlign: 'center',
    maxWidth: 380,
    marginBottom: 24,
  },
  ctaButton: {
    padding: 12,
    backgroundColor: colors.ink,
    color: '#ffffff',
    borderRadius: 6,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  channels: {
    marginTop: 32,
    fontSize: 10,
    color: colors.body,
    textAlign: 'center',
  },
  link: {
    color: colors.accentText,
    textDecoration: 'none',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    right: 44,
    fontSize: 9,
    color: colors.body,
  },
});

export function LeadMagnetDocument({
  generatedAt,
  landingUrl,
  locations,
  contacts,
}: LeadMagnetDocumentProps) {
  return (
    <Document
      title="10 posti italiani non ovvi — Travelliniwithus"
      author="Travelliniwithus (Rodrigo & Betta)"
      subject="Mini guida Italia per chi viaggia in coppia"
      keywords="viaggi, italia, coppia, posti particolari, guida"
    >
      {/* Cover */}
      <Page size="A4" style={[styles.page, styles.cover]}>
        <View style={styles.coverTopRow}>
          <Text style={styles.brandName}>Travelliniwithus</Text>
          <Text style={styles.brandTag}>Mini-guida 2026</Text>
        </View>
        <View>
          <Text style={styles.coverTitle}>10 posti italiani non ovvi</Text>
          <Text style={styles.coverSubtitle}>
            Una lista corta, scelta dopo 8 anni di viaggi reali. Per chi viaggia in coppia e cerca
            posti veri, non liste su Pinterest.
          </Text>
          <Text style={[styles.brandTag, { color: colors.ink }]}>By Rodrigo &amp; Betta</Text>
        </View>
        <View style={styles.coverFooter}>
          <Text>Versione {generatedAt}</Text>
          <Link src={landingUrl} style={styles.link}>
            travelliniwithus.it
          </Link>
        </View>
      </Page>

      {/* Intro + TOC */}
      <Page size="A4" style={styles.page}>
        <View style={styles.intro}>
          <Text style={styles.introEyebrow}>Come è fatta questa guida</Text>
          <Text style={styles.introTitle}>
            10 posti, 10 pagine. Ognuna risponde alle stesse 5 domande.
          </Text>
          <Text style={styles.introParagraph}>
            Niente liste da SEO. Per ogni posto trovi: dove si trova davvero, perché ci siamo
            tornati, come arrivare senza stress, quando vale la pena partire e quanto costa
            indicativamente per una coppia. In fondo, un consiglio insider che non scriviamo
            altrove.
          </Text>
          <Text style={styles.introParagraph}>
            Sono dieci scelte, non dieci classifiche. Salvaci la pagina che ti serve, manda la guida
            a chi viaggia con te.
          </Text>

          <Text style={[styles.introEyebrow, { marginTop: 32 }]}>Indice</Text>
          <View style={styles.tocList}>
            {locations.map((loc) => (
              <View key={loc.number} style={styles.tocItem}>
                <Text style={styles.tocNumber}>{loc.number}</Text>
                <Text style={styles.tocName}>{loc.name}</Text>
                <Text style={styles.tocRegion}>{loc.region}</Text>
              </View>
            ))}
          </View>
        </View>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>

      {/* Location pages */}
      {locations.map((loc) => (
        <Page key={loc.number} size="A4" style={styles.page}>
          <View style={styles.locationHeader}>
            <Text style={styles.locationNumber}>{loc.number}</Text>
            <Text style={styles.locationRegion}>{loc.region}</Text>
          </View>
          <Text style={styles.locationName}>{loc.name}</Text>
          <Text style={styles.locationWhy}>{loc.why}</Text>

          <View style={styles.detailRow}>
            <View style={styles.detailCol}>
              <Text style={styles.detailLabel}>Come arrivare</Text>
              <Text style={styles.detailValue}>{loc.howToReach}</Text>
            </View>
            <View style={styles.detailCol}>
              <Text style={styles.detailLabel}>Quando andare</Text>
              <Text style={styles.detailValue}>{loc.bestTime}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailCol}>
              <Text style={styles.detailLabel}>Costo medio (coppia)</Text>
              <Text style={styles.detailValue}>{loc.costEstimate}</Text>
            </View>
          </View>

          <View style={styles.tipBlock}>
            <Text style={styles.tipLabel}>Consiglio insider</Text>
            <Text style={styles.tipText}>{loc.insiderTip}</Text>
          </View>

          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
            fixed
          />
        </Page>
      ))}

      {/* Final CTA */}
      <Page size="A4" style={[styles.page, styles.finalPage]}>
        <Text style={styles.finalEyebrow}>Continua con noi</Text>
        <Text style={styles.finalTitle}>Se ti è servita, ce ne sono altri sul sito.</Text>
        <Text style={styles.finalParagraph}>
          Guide pratiche, itinerari, e un quiz per capire dove andare la prossima volta. Niente
          newsletter aggressiva: scriviamo solo quando c'è qualcosa da salvare davvero.
        </Text>
        <Link src={landingUrl} style={styles.ctaButton}>
          Esplora le destinazioni
        </Link>
        <Text style={styles.channels}>
          Instagram:{' '}
          <Link src={contacts.instagram} style={styles.link}>
            {contacts.instagram}
          </Link>
          {'\n'}
          TikTok:{' '}
          <Link src={contacts.tiktok} style={styles.link}>
            {contacts.tiktok}
          </Link>
          {'\n'}
          Email:{' '}
          <Link src={`mailto:${contacts.email}`} style={styles.link}>
            {contacts.email}
          </Link>
        </Text>
      </Page>
    </Document>
  );
}

export default LeadMagnetDocument;

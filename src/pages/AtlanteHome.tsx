import SEO from '@/src/components/SEO';
import CinematicHomepage from '@/src/components/home/cinematic/CinematicHomepage';
import { CONTACTS, SITE_URL } from '@/src/config/site';

/**
 * Home "Atlante Vivo" — la home ufficiale (/) dal cutover del 2026-07-04.
 * Navbar/Footer arrivano da Layout: qui solo il contenuto. Nessuno <style>
 * che nasconde il chrome: la hero convive con la navbar.
 */
export default function AtlanteHome() {
  return (
    <>
      <SEO
        title="Viaggi reali e posti particolari in Italia e nel mondo"
        description="La casa di Rodrigo e Betta: posti particolari provati sul campo, con atmosfera, costi reali e il consiglio onesto se un posto merita il viaggio."
        canonical={`${SITE_URL}/`}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Travelliniwithus',
            url: SITE_URL,
            inLanguage: 'it-IT',
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: `${SITE_URL}/esplora?q={search_term_string}`,
              },
              'query-input': 'required name=search_term_string',
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Travelliniwithus',
            url: SITE_URL,
            logo: `${SITE_URL}/og/default.jpg`,
            email: CONTACTS.email,
            sameAs: [CONTACTS.instagramUrl, CONTACTS.tiktokUrl, CONTACTS.facebookUrl],
          },
        ]}
      />

      <CinematicHomepage />
    </>
  );
}

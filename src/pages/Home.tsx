import SEO from '../components/SEO';
import { SITE_URL } from '../config/site';
import SentieroExperience from '../experience/sentiero/SentieroExperience';

export default function Home() {
  return (
    <>
      <SEO
        title="Le Tracce — viaggi reali e posti particolari"
        description="Entra nel mondo Travelliniwithus: un'esperienza interattiva tra posti provati, mappe, reel e tracce reali di Rodrigo e Betta."
        canonical={`${SITE_URL}/`}
      />
      <style>{`
        html,
        body,
        #root,
        body > div {
          height: 100vh !important;
          height: 100dvh !important;
          overflow: hidden !important;
          margin: 0;
          padding: 0;
        }
        body > div nav,
        body > div footer,
        #ai-assistant-bubble,
        #scroll-progress-bar {
          display: none !important;
        }
        main#main-content {
          height: 100vh;
          height: 100dvh;
          overflow: hidden;
          background: #0b0805;
        }
      `}</style>
      <SentieroExperience />
    </>
  );
}

import SEO from '../../components/SEO';
import { SITE_URL } from '../../config/site';
import AtlanteExperience from '../../experience/atlante/AtlanteExperience';

export default function HomeV2() {
  return (
    <>
      {/* /v2 è il prototipo dell'Atlante: noindex finché non sostituisce la
          home (/), per non competere come duplicate content con la home live. */}
      <SEO
        title="L'Atlante — viaggi reali e tracce certificate"
        description="Esplora le tracce di viaggio certificate di Rodrigo & Betta attraverso un atlante interattivo 3D. Masserie pugliesi, rifugi dolomitici ed etna slow."
        canonical={`${SITE_URL}/v2`}
        noindex
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
      <AtlanteExperience />
    </>
  );
}

import SEO from '../../components/SEO';
import ControluceExperience from './ControluceExperience';

export default function ManifestoPage() {
  return (
    <>
      {/* Lab: manifesto cinematico Controluce. noindex, fuori dal sito pubblico. */}
      <SEO
        title="Controluce — manifesto"
        description="Un giorno di luce attraverso un telo di lino: il manifesto di viaggio di Rodrigo & Betta."
        noindex
      />
      <ControluceExperience />
    </>
  );
}

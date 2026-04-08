import Breadcrumbs from '../../components/Breadcrumbs';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import SEO from '../../components/SEO';

export default function Privacy() {
  const breadcrumbItems = [{ label: 'Privacy Policy' }];

  return (
    <PageLayout>
      <SEO
        title="Privacy Policy"
        description="Informativa sulla privacy di Travelliniwithus. Scopri quali dati possiamo raccogliere, come li gestiamo e come contattarci."
      />
      <Section className="pt-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="mt-8 rounded-3xl border border-black/5 bg-white p-10 shadow-sm md:p-16">
          <h1 className="mb-8 font-serif text-4xl md:text-5xl">Privacy Policy</h1>
          <div className="prose prose-slate max-w-none space-y-6 font-light leading-relaxed text-black/70">
            <p>
              Questa informativa spiega in modo chiaro quali dati personali possono essere raccolti tramite il sito
              Travelliniwithus, per quali motivi vengono trattati e come puoi esercitare i tuoi diritti.
            </p>

            <h2 className="mt-10 mb-4 font-serif text-2xl text-black">1. Titolare del trattamento</h2>
            <p>
              Il titolare del trattamento è Travelliniwithus. Per richieste relative ai dati personali puoi
              scrivere a <a href="mailto:info@travelliniwithus.it">info@travelliniwithus.it</a>.
            </p>

            <h2 className="mt-10 mb-4 font-serif text-2xl text-black">2. Dati che possiamo raccogliere</h2>
            <p>
              Possiamo raccogliere dati forniti volontariamente dall&apos;utente, come nome, email, azienda, messaggio
              e informazioni condivise tramite form di contatto, media kit o iscrizione alla newsletter. Possiamo
              inoltre raccogliere dati tecnici di navigazione, come indirizzo IP, dispositivo, browser e dati
              aggregati sull&apos;uso del sito.
            </p>

            <h2 className="mt-10 mb-4 font-serif text-2xl text-black">3. Finalità del trattamento</h2>
            <p>
              I dati vengono trattati per rispondere alle richieste ricevute, gestire eventuali contatti commerciali,
              valutare collaborazioni, migliorare il sito, proteggere i servizi e analizzare in forma aggregata come
              viene utilizzato il progetto.
            </p>

            <h2 className="mt-10 mb-4 font-serif text-2xl text-black">4. Base giuridica</h2>
            <p>
              Il trattamento può basarsi sul consenso espresso dall&apos;utente, su misure precontrattuali richieste,
              su obblighi di legge oppure sul legittimo interesse a mantenere e migliorare il sito e i servizi
              collegati.
            </p>

            <h2 className="mt-10 mb-4 font-serif text-2xl text-black">5. Conservazione dei dati</h2>
            <p>
              I dati vengono conservati per il tempo strettamente necessario a gestire la richiesta ricevuta, a
              rispettare obblighi organizzativi o normativi e a mantenere traccia delle interazioni utili al progetto.
              Quando non sono più necessari, vengono eliminati o anonimizzati.
            </p>

            <h2 className="mt-10 mb-4 font-serif text-2xl text-black">6. Condivisione dei dati</h2>
            <p>
              I dati non vengono diffusi pubblicamente. Possono essere trattati da fornitori tecnici o piattaforme
              necessarie al funzionamento del sito, all&apos;invio di comunicazioni o alla gestione di servizi collegati,
              nei limiti necessari a erogare tali funzioni.
            </p>

            <h2 className="mt-10 mb-4 font-serif text-2xl text-black">7. Diritti dell&apos;interessato</h2>
            <p>
              Puoi chiedere accesso, rettifica, aggiornamento, cancellazione, limitazione del trattamento o
              opposizione, nei limiti previsti dalla normativa applicabile. Per esercitare i tuoi diritti puoi
              scrivere a <a href="mailto:info@travelliniwithus.it">info@travelliniwithus.it</a>.
            </p>

            <h2 className="mt-10 mb-4 font-serif text-2xl text-black">8. Aggiornamenti</h2>
            <p>
              Questa pagina può essere aggiornata nel tempo per riflettere modifiche del sito, dei servizi o degli
              obblighi normativi. La versione pubblicata su questa pagina è quella da considerare attuale.
            </p>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}

import { ArrowDown, ArrowRight, Check, Compass, MapPin } from 'lucide-react';
import { Link } from '@/src/components/TransitionLink';

const chapterLinks = [
  { number: '01', label: 'Partenza', href: '#capitolo-01' },
  { number: '02', label: 'Soglia', href: '#capitolo-02' },
  { number: '03', label: 'Deviazione', href: '#capitolo-03' },
];

export default function CinematicHomepage() {
  return (
    <article className="trace-home">
      <header className="trace-header">
        <Link to="/" className="trace-wordmark" aria-label="Travelliniwithus — homepage">
          Travelliniwithus
        </Link>
        <nav aria-label="Navigazione homepage" className="trace-header__nav">
          <Link to="/chi-siamo">Chi siamo</Link>
          <a href="#capitolo-01">Tracce</a>
          <Link to="/esplora">Diario</Link>
        </nav>
        <a href="#capitolo-01" className="trace-header__cta">
          Segui la traccia <ArrowDown size={14} aria-hidden="true" />
        </a>
      </header>

      <aside className="trace-rail" aria-label="Indice dei capitoli">
        <span className="trace-rail__start" aria-hidden="true" />
        <span className="trace-rail__line" aria-hidden="true" />
        {chapterLinks.map((chapter) => (
          <a
            key={chapter.number}
            href={chapter.href}
            aria-label={`${chapter.number} ${chapter.label}`}
          >
            <span aria-hidden="true" />
          </a>
        ))}
      </aside>

      <section className="trace-hero" aria-labelledby="trace-title">
        <img
          src="/images/home-cinematic/batu-hero.webp"
          alt="Betta davanti alla statua dorata e alla scalinata delle Batu Caves"
          className="trace-hero__image"
          fetchPriority="high"
        />
        <div className="trace-hero__shade" aria-hidden="true" />
        <div className="trace-hero__content">
          <p className="trace-eyebrow trace-eyebrow--light">Partenza</p>
          <h1 id="trace-title">
            Non era
            <br />
            nei piani.
          </h1>
          <p>Ed è per questo che vale il viaggio.</p>
          <a href="#capitolo-01" className="trace-button trace-button--accent">
            Segui la traccia <ArrowRight size={18} aria-hidden="true" />
          </a>
          <div className="trace-proof">
            <img src="/images/brand/couple-travel-320.webp" alt="Rodrigo e Betta" />
            <span>
              Rodrigo &amp; Betta · Ci andiamo prima
              <br />
              di consigliarlo.
            </span>
          </div>
        </div>
      </section>

      <section id="capitolo-01" className="trace-section trace-section--paper">
        <div className="trace-number">
          <strong>01</strong>
          <span>Partenza</span>
        </div>
        <div className="trace-section__copy">
          <h2>
            Ogni traccia
            <br />
            inizia
            <br />
            con un istante.
          </h2>
          <p>
            A volte è un odore, una strada, uno sguardo.
            <br />
            Non serve un piano perfetto,
            <br />
            serve la voglia di esserci.
          </p>
        </div>
        <figure className="trace-frame trace-frame--departure">
          <img
            src="/images/home-cinematic/batu-departure.webp"
            alt="Betta si volta sorridendo all'ingresso delle Batu Caves"
            loading="lazy"
          />
          <figcaption>12 — Batu Caves</figcaption>
        </figure>
      </section>

      <section id="capitolo-02" className="trace-section trace-section--ink">
        <div className="trace-number trace-number--light">
          <strong>02</strong>
          <span>Soglia</span>
        </div>
        <figure className="trace-frame trace-frame--tavernal-small">
          <img
            src="/images/home-cinematic/tavernal-stained-glass.webp"
            alt="Vetrata fantasy con drago rosso e Torre di Pisa al Tavernal"
            loading="lazy"
          />
        </figure>
        <div className="trace-section__copy trace-section__copy--light">
          <h2>
            C’è sempre un
            <br />
            luogo che cambia
            <br />
            prospettiva.
          </h2>
          <p>
            Attraversa la soglia e<br />
            lasciati sorprendere dai dettagli
            <br />
            che non trovi sulle guide.
          </p>
          <Link to="/posto/malesia-batu-caves" className="trace-inline-link">
            Apri la prima traccia <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section
        id="capitolo-03"
        className="trace-section trace-section--paper trace-section--reverse"
      >
        <div className="trace-number">
          <strong>03</strong>
          <span>Deviazione</span>
        </div>
        <div className="trace-section__copy">
          <h2>
            Le deviazioni
            <br />
            sono la mappa
            <br />
            migliore.
          </h2>
          <p>
            Non tutto va come previsto.
            <br />
            Ed è spesso lì che succedono
            <br />
            le cose migliori.
          </p>
          <Link to="/destinazione/italia" className="trace-inline-link trace-inline-link--dark">
            Toscana insolita <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <figure className="trace-frame trace-frame--tavernal-wide">
          <img
            src="/images/home-cinematic/tavernal-stained-glass.webp"
            alt="Lampadine ambrate e vetrata fantasy nell'interno del Tavernal"
            loading="lazy"
          />
          <figcaption>Tavernal · Toscana</figcaption>
        </figure>
      </section>

      <section className="trace-final" aria-labelledby="trace-final-title">
        <Compass size={48} strokeWidth={1} aria-hidden="true" />
        <div>
          <p className="trace-eyebrow trace-eyebrow--light">La prossima partenza</p>
          <h2 id="trace-final-title">
            La tua prossima
            <br />
            traccia inizia qui.
          </h2>
          <Link to="/destinazione" className="trace-button trace-button--outline">
            Segui la traccia <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <ul>
          <li>
            <Check size={16} /> Itinerari vissuti davvero
          </li>
          <li>
            <Check size={16} /> Diari onesti, senza filtri
          </li>
          <li>
            <Check size={16} /> Consigli testati sul campo
          </li>
          <li>
            <MapPin size={16} /> Storie che ispirano partenze
          </li>
        </ul>
        <img
          src="/images/brand/couple-travel.webp"
          alt="Una coppia in viaggio verso la prossima destinazione"
        />
      </section>

      <footer className="trace-footer">
        <span>Travelliniwithus</span>
        <nav aria-label="Navigazione finale">
          <Link to="/chi-siamo">Chi siamo</Link>
          <Link to="/destinazione">Tracce</Link>
          <Link to="/esplora">Diario</Link>
          <Link to="/contatti">Contatti</Link>
        </nav>
      </footer>
    </article>
  );
}

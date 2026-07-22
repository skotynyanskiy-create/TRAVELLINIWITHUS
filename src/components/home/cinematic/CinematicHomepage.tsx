import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowDown, ArrowRight, BookOpen, Compass, Map, Menu, Sparkles } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { Link } from '@/src/components/TransitionLink';

const pages = [
  { number: '01', label: 'Sembra impossibile', href: '#pagina-01' },
  { number: '02', label: 'Altrove, vicino', href: '#pagina-02' },
  { number: '03', label: 'Dentro una storia', href: '#pagina-03' },
  { number: '04', label: 'Vale davvero?', href: '#pagina-04' },
  { number: '05', label: 'Prossima traccia', href: '#pagina-05' },
];

interface EditorialImageProps {
  name: 'hero-impossible' | 'altrove-vicino' | 'dentro-storia';
  alt: string;
  className?: string;
  eager?: boolean;
}

function EditorialImage({ name, alt, className, eager = false }: EditorialImageProps) {
  return (
    <picture>
      <source srcSet={`/images/home-journal/${name}.avif`} type="image/avif" />
      <source srcSet={`/images/home-journal/${name}.webp`} type="image/webp" />
      <img
        src={`/images/home-journal/${name}.png`}
        alt={alt}
        className={className}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : 'auto'}
      />
    </picture>
  );
}

interface TurningPageProps {
  id: string;
  className?: string;
  labelledBy: string;
  children: ReactNode;
}

function TurningPage({ id, className = '', labelledBy, children }: TurningPageProps) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const rawRotate = useTransform(scrollYProgress, [0, 0.16, 0.78, 1], [5, 0, 0, -4]);
  const rawY = useTransform(scrollYProgress, [0, 0.18, 0.78, 1], [32, 0, 0, -18]);
  const rotateX = useSpring(rawRotate, { stiffness: 110, damping: 24, mass: 0.55 });
  const y = useSpring(rawY, { stiffness: 110, damping: 24, mass: 0.55 });

  return (
    <section ref={ref} id={id} className="journal-step" aria-labelledby={labelledBy}>
      <motion.div
        className={`journal-page ${className}`}
        style={reduceMotion ? undefined : { rotateX, y }}
      >
        {children}
      </motion.div>
    </section>
  );
}

export default function CinematicHomepage() {
  const [activePage, setActivePage] = useState(1);

  useEffect(() => {
    const sections = pages
      .map((page) => document.querySelector<HTMLElement>(page.href))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!current) return;
        const index = sections.indexOf(current.target as HTMLElement);
        if (index >= 0) setActivePage(index + 1);
      },
      { rootMargin: '-28% 0px -54% 0px', threshold: [0, 0.2, 0.5, 0.8] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <article className="journal-home">
      <a className="journal-skip" href="#pagina-01">
        Vai al contenuto
      </a>

      <div className="journal-binding" aria-hidden="true">
        <img src="/images/home-journal/notebook-reference.webp" alt="" />
      </div>

      <header className="journal-header">
        <Link to="/" className="journal-wordmark" aria-label="Travelliniwithus — homepage">
          Travelliniwithus
        </Link>

        <nav className="journal-nav" aria-label="Navigazione principale">
          <a href="#pagina-02">Diario</a>
          <Link to="/mappa">Mappa</Link>
          <Link to="/chi-siamo">Chi siamo</Link>
          <Link to="/collaborazioni">Collaborazioni</Link>
        </nav>

        <div className="journal-progress" aria-live="polite">
          Pagina {String(activePage).padStart(2, '0')} <span>/ 05</span>
        </div>

        <details className="journal-menu">
          <summary aria-label="Apri il menu">
            <Menu size={20} aria-hidden="true" />
          </summary>
          <nav aria-label="Navigazione mobile">
            <a href="#pagina-02">Diario</a>
            <Link to="/mappa">Mappa</Link>
            <Link to="/chi-siamo">Noi</Link>
            <Link to="/collaborazioni">Collabora</Link>
          </nav>
        </details>
      </header>

      <main>
        <section id="pagina-01" className="journal-hero" aria-labelledby="journal-title">
          <div className="journal-hero__copy">
            <p className="journal-kicker">Taccuino 01 — sembra impossibile</p>
            <h1 id="journal-title">Posti che sembrano inventati. Ma esistono davvero.</h1>
            <p className="journal-deck">
              Siamo Rodrigo e Betta. Li proviamo prima, poi ti diciamo cosa vale davvero.
            </p>
            <div className="journal-actions">
              <a href="#pagina-02" className="journal-button journal-button--primary">
                Apri la prima traccia <ArrowDown size={18} aria-hidden="true" />
              </a>
              <Link to="/mappa" className="journal-button journal-button--text">
                Vai alla mappa <Map size={17} aria-hidden="true" />
              </Link>
            </div>
            <p className="journal-proof">Esperienze reali · prezzi · periodo giusto</p>
          </div>

          <figure className="journal-hero__visual">
            <EditorialImage
              name="hero-impossible"
              alt="Betta seduta su una poltrona-trono nella sala a scacchi giganti del ristorante The Burton Juice"
              className="journal-hero__image"
              eager
            />
            <figcaption>The Burton Juice · Somma Vesuviana</figcaption>
          </figure>

          <p className="journal-handnote journal-handnote--hero">
            La strada giusta
            <br />
            non è quella più breve.
          </p>
          <p className="journal-date">21 lug 2026</p>
          <span className="journal-stamp" aria-hidden="true">
            Provato
          </span>

          <a
            href="#pagina-02"
            className="journal-next-peek"
            aria-label="Vai a pagina 2: Altrove, vicino"
          >
            <span>
              Taccuino 02
              <strong>Altrove, vicino</strong>
            </span>
            <EditorialImage name="altrove-vicino" alt="" />
          </a>

          <a href="#pagina-02" className="journal-scroll-cue">
            <span>Scorri per girare pagina</span>
            <ArrowDown size={15} aria-hidden="true" />
          </a>
        </section>

        <TurningPage id="pagina-02" className="journal-page--coast" labelledBy="page-02-title">
          <div className="journal-folio">02 / 05</div>
          <figure className="journal-photo journal-photo--coast">
            <EditorialImage
              name="altrove-vicino"
              alt="Betta su una poltrona sospesa tra le palme del Caribe Bay, a Jesolo"
            />
            <figcaption>Caribe Bay · Jesolo, a due passi da casa</figcaption>
          </figure>
          <div className="journal-chapter-copy">
            <p className="journal-kicker">Taccuino 02 — vicino, ma altrove</p>
            <h2 id="page-02-title">Ti porta lontano. Senza andare lontano.</h2>
            <p>
              Borghi, coste e deviazioni italiane che sembrano appartenere a un altro continente. Le
              cerchiamo per chi vuole stupirsi, non solo spuntare una lista.
            </p>
            <Link to="/destinazione/italia" className="journal-button journal-button--ink">
              Esplora l’Italia insolita <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <p className="journal-handnote journal-handnote--coast">Qui il telefono può aspettare.</p>
          <span className="journal-ticket">48 ore · fuori rotta</span>
        </TurningPage>

        <TurningPage id="pagina-03" className="journal-page--story" labelledBy="page-03-title">
          <div className="journal-folio">03 / 05</div>
          <div className="journal-chapter-copy journal-chapter-copy--story">
            <p className="journal-kicker">Taccuino 03 — dentro una storia</p>
            <h2 id="page-03-title">Non cerchiamo camere. Cerchiamo ricordi.</h2>
            <p>
              Una tavola per due, una locanda scavata nella roccia, una finestra che cambia la
              serata. Il posto giusto è quello che continui a raccontare quando torni.
            </p>
            <Link to="/esplora" className="journal-button journal-button--ink">
              Leggi le storie <BookOpen size={18} aria-hidden="true" />
            </Link>
          </div>
          <figure className="journal-photo journal-photo--story">
            <EditorialImage
              name="dentro-storia"
              alt="Rodrigo lungo il torrente del glamping Garden Village, con le case-tenda immerse nel bosco a Bled"
            />
            <figcaption>Garden Village · Lago di Bled, Slovenia</figcaption>
          </figure>
          <blockquote className="journal-quote">
            “Il lusso, a volte,
            <br />è avere una storia da raccontare.”
          </blockquote>
        </TurningPage>

        <TurningPage id="pagina-04" className="journal-page--verdict" labelledBy="page-04-title">
          <div className="journal-folio">04 / 05</div>
          <div className="journal-verdict-intro">
            <p className="journal-kicker journal-kicker--light">Taccuino 04 — il verdetto</p>
            <h2 id="page-04-title">Bello, sì. Ma vale davvero?</h2>
            <p>
              La parte che sui social non entra: quanto costa, quando andare, per chi è e qual è il
              limite che devi sapere prima di partire.
            </p>
          </div>

          <ol className="journal-ledger" aria-label="Il nostro metodo di verifica">
            <li>
              <span>01</span>
              <div>
                <strong>Ci andiamo</strong>
                <p>Prima l’esperienza, poi il consiglio.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <strong>Segniamo tutto</strong>
                <p>Prezzi, tempi, periodo e piccoli intoppi.</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <strong>Ti diciamo per chi è</strong>
                <p>Senza filtri, con un verdetto semplice.</p>
              </div>
            </li>
          </ol>

          <Link to="/mappa" className="journal-map-card">
            <Compass size={32} strokeWidth={1.4} aria-hidden="true" />
            <span>
              <small>Apri l’atlante</small>
              <strong>Trova il posto giusto per te</strong>
            </span>
            <ArrowRight size={20} aria-hidden="true" />
          </Link>
        </TurningPage>

        <TurningPage id="pagina-05" className="journal-page--closing" labelledBy="page-05-title">
          <div className="journal-folio">05 / 05</div>
          <div className="journal-closing-copy">
            <Sparkles size={30} strokeWidth={1.3} aria-hidden="true" />
            <p className="journal-kicker">L’ultima pagina non esiste</p>
            <h2 id="page-05-title">La prossima traccia possiamo sceglierla insieme.</h2>
            <p>
              Segui il diario, cerca sulla mappa oppure raccontaci il luogo particolare che non
              dovremmo perderci.
            </p>
          </div>

          <div className="journal-closing-actions">
            <Link to="/mappa" className="journal-closing-link">
              <span>01</span>
              <strong>Apri la mappa</strong>
              <ArrowRight size={19} aria-hidden="true" />
            </Link>
            <Link to="/chi-siamo" className="journal-closing-link">
              <span>02</span>
              <strong>Conosci Rodrigo e Betta</strong>
              <ArrowRight size={19} aria-hidden="true" />
            </Link>
            <Link to="/collaborazioni" className="journal-closing-link">
              <span>03</span>
              <strong>Costruiamo una storia</strong>
              <ArrowRight size={19} aria-hidden="true" />
            </Link>
          </div>

          <footer className="journal-footer">
            <span>Travelliniwithus</span>
            <span>Posti particolari · giudizi sinceri</span>
            <span>Rodrigo &amp; Betta</span>
          </footer>
        </TurningPage>
      </main>

      <aside className="journal-page-dots" aria-label="Indice delle pagine">
        {pages.map((page, index) => (
          <a
            key={page.number}
            href={page.href}
            aria-label={`Pagina ${page.number}: ${page.label}`}
            aria-current={activePage === index + 1 ? 'step' : undefined}
          >
            <span aria-hidden="true" />
          </a>
        ))}
      </aside>
    </article>
  );
}

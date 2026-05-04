import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Copy, ExternalLink, Percent } from 'lucide-react';

interface PromoCode {
  partner: string;
  code: string;
  discount: string;
  description: string;
  url: string;
  color: string;
}

const PROMO_CODES: PromoCode[] = [
  {
    partner: 'GetYourGuide',
    code: 'TRAVELLINIWITHUS5',
    discount: '-5%',
    description: 'Escursioni, tour e attività in tutto il mondo',
    url: 'https://gyg.me/travelliniwithus-app',
    color: '#FF5533',
  },
  {
    partner: 'Heymondo',
    code: 'TRAVELLINIWITHUS',
    discount: '-10%',
    description: 'Assicurazione viaggio per partire tranquilli',
    url: 'https://heymondo.it/?utm_medium=Afiliado&utm_source=TRAVELLINIWITHUS&utm_campaign=PRINCIPAL&cod_descuento=TRAVELLINIWITHUS&ag_campaign=TRAVELLINI&agencia=JG4Tepc5b47oLeK3xGDmbAX9I25ExoDeoc8cbPFt',
    color: '#00B4D8',
  },
  {
    partner: 'ParkingMyCar',
    code: 'TRAVELLINI10',
    discount: '-10%',
    description: 'Parcheggi economici in tutta Italia',
    url: 'https://www.parkingmycar.it',
    color: '#2D6A4F',
  },
];

export default function HomePromoCodesBanner() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section className="bg-[var(--color-ink)] py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <div className="mb-12 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <Percent size={16} className="text-[var(--color-accent)]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-accent)]">
                I nostri codici sconto
              </span>
            </div>
            <h2 className="max-w-lg font-serif text-3xl leading-tight text-white md:text-4xl">
              Risparmia con i nostri{' '}
              <span className="italic text-white/70">partner selezionati</span>
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-white/55">
            Codici sconto reali e verificati. Per te non cambia il costo, per noi è un modo per
            sostenere il progetto.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {PROMO_CODES.map((promo, index) => (
            <motion.div
              key={promo.partner}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/5 p-6 transition-all duration-300 hover:border-white/15 hover:bg-white/8"
            >
              {/* Discount badge */}
              <div
                className="mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5"
                style={{ backgroundColor: `${promo.color}20` }}
              >
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: promo.color }} />
                <span
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: promo.color }}
                >
                  {promo.discount}
                </span>
              </div>

              <h3 className="mb-2 font-serif text-xl text-white">{promo.partner}</h3>
              <p className="mb-6 text-sm leading-relaxed text-white/55">{promo.description}</p>

              {/* Code copy box */}
              <div className="mb-4 flex items-center gap-2">
                <div className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5">
                  <code className="text-sm font-bold tracking-wider text-[var(--color-accent)]">
                    {promo.code}
                  </code>
                </div>
                <button
                  onClick={() => handleCopy(promo.code, index)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/60 transition-all hover:bg-white/10 hover:text-white"
                  aria-label={`Copia codice ${promo.code}`}
                >
                  {copiedIndex === index ? (
                    <CheckCircle2 size={16} className="text-[var(--color-accent)]" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>

              {/* Use link */}
              <a
                href={promo.url}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 transition-colors hover:text-[var(--color-accent)]"
              >
                Usa il codice <ExternalLink size={12} />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

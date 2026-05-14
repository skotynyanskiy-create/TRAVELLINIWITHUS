import { motion } from 'motion/react';
import { Activity, ArrowDownRight, ArrowUpRight, Eye, Mail, TrendingUp, Users } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

/**
 * Admin metrics overview — demo data widget.
 *
 * Visualizza KPI di traffico, lead funnel, articoli top e web vitals.
 * Tutti i numeri sono placeholder per mostrare l esperienza finale.
 * Quando i dati reali saranno collegati (RUM Firestore + GA4 export),
 * basta sostituire le costanti DEMO_* con fetch hooks.
 */

const TRAFFIC_TREND = [
  { day: 'Lun', sessions: 1240, articles: 380, leads: 28 },
  { day: 'Mar', sessions: 1380, articles: 410, leads: 31 },
  { day: 'Mer', sessions: 1580, articles: 520, leads: 42 },
  { day: 'Gio', sessions: 1720, articles: 610, leads: 38 },
  { day: 'Ven', sessions: 1480, articles: 470, leads: 33 },
  { day: 'Sab', sessions: 2150, articles: 820, leads: 56 },
  { day: 'Dom', sessions: 2380, articles: 910, leads: 64 },
];

const FUNNEL = [
  { step: 'Sessioni', value: 11930, color: '#1c1a17' },
  { step: 'Articoli letti', value: 4120, color: '#7d5a3a' },
  { step: 'Lead', value: 292, color: '#b08b63' },
  { step: 'Conversioni', value: 47, color: '#d4af7a' },
];

const TOP_ARTICLES = [
  { title: 'Dolomiti: rifugi di design e sentieri da salvare', views: 4820, growth: 18 },
  { title: 'Andalusia in 7 giorni', views: 3640, growth: 12 },
  { title: 'Sicilia orientale in 5 giorni', views: 3210, growth: 24 },
  { title: 'Cosa vedere a Catania', views: 2710, growth: -6 },
  { title: 'Weekend romantico in Toscana', views: 2380, growth: 9 },
];

const LEAD_PIPELINE = [
  { label: 'Hot', count: 12, color: '#b08b63' },
  { label: 'Warm', count: 34, color: '#d4af7a' },
  { label: 'Cold', count: 58, color: '#e8d4b8' },
];

const WEB_VITALS = [
  { metric: 'LCP', value: '1.9s', rating: 'good', target: '< 2.5s' },
  { metric: 'INP', value: '120ms', rating: 'good', target: '< 200ms' },
  { metric: 'CLS', value: '0.04', rating: 'good', target: '< 0.1' },
];

export default function AdminMetricsOverview() {
  return (
    <section className="mb-12">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-serif text-[var(--color-ink)]">Metriche del progetto</h2>
          <p className="text-sm text-black/55">
            Vista demo · sostituibile con dati reali GA4 + RUM Firestore quando connessi.
          </p>
        </div>
        <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-700">
          Demo data
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard
          icon={Activity}
          label="Sessioni 7gg"
          value="11.930"
          deltaPct={14}
          color="bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
        />
        <KpiCard
          icon={Eye}
          label="Articoli letti"
          value="4.120"
          deltaPct={9}
          color="bg-blue-50 text-blue-600"
        />
        <KpiCard
          icon={Mail}
          label="Lead 7gg"
          value="292"
          deltaPct={22}
          color="bg-emerald-50 text-emerald-700"
        />
        <KpiCard
          icon={Users}
          label="Club waitlist"
          value="184"
          deltaPct={31}
          color="bg-purple-50 text-purple-700"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-serif text-lg">Trend 7 giorni</h3>
            <TrendingUp size={16} className="text-[var(--color-accent)]" />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={TRAFFIC_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(28,26,23,0.06)" />
              <XAxis dataKey="day" stroke="rgba(28,26,23,0.45)" fontSize={11} />
              <YAxis stroke="rgba(28,26,23,0.45)" fontSize={11} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid rgba(28,26,23,0.08)',
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line
                type="monotone"
                dataKey="sessions"
                stroke="#1c1a17"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="articles"
                stroke="#b08b63"
                strokeWidth={2}
                dot={false}
              />
              <Line type="monotone" dataKey="leads" stroke="#d4af7a" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-serif text-lg">Funnel conversione</h3>
            <span className="text-xs text-black/45">7gg</span>
          </div>
          <div className="space-y-3">
            {FUNNEL.map((step, idx) => {
              const prev = idx > 0 ? FUNNEL[idx - 1].value : step.value;
              const conversion = prev > 0 ? ((step.value / prev) * 100).toFixed(1) : '100';
              return (
                <div key={step.step}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium text-black/70">{step.step}</span>
                    <span className="text-black/45">
                      {step.value.toLocaleString('it-IT')} ({idx === 0 ? '100' : conversion}%)
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-zinc-100">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(step.value / FUNNEL[0].value) * 100}%` }}
                      transition={{ duration: 0.7, delay: idx * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: step.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm"
        >
          <h3 className="mb-5 font-serif text-lg">Top 5 articoli (settimana)</h3>
          <ul className="space-y-3">
            {TOP_ARTICLES.map((article, idx) => (
              <li
                key={article.title}
                className="flex items-center justify-between gap-3 rounded-xl border border-zinc-50 p-3 text-sm"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-xs font-bold text-[var(--color-accent-text)]">
                    {idx + 1}
                  </span>
                  <span className="truncate font-medium text-black/70">{article.title}</span>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-xs text-black/45">
                    {article.views.toLocaleString('it-IT')}
                  </span>
                  <span
                    className={`inline-flex items-center gap-0.5 text-[10px] font-bold ${
                      article.growth >= 0 ? 'text-emerald-600' : 'text-rose-500'
                    }`}
                  >
                    {article.growth >= 0 ? (
                      <ArrowUpRight size={11} />
                    ) : (
                      <ArrowDownRight size={11} />
                    )}
                    {Math.abs(article.growth)}%
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm"
        >
          <h3 className="mb-5 font-serif text-lg">Lead pipeline</h3>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={LEAD_PIPELINE} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(28,26,23,0.06)" />
              <XAxis type="number" stroke="rgba(28,26,23,0.45)" fontSize={11} />
              <YAxis dataKey="label" type="category" stroke="rgba(28,26,23,0.45)" fontSize={11} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid rgba(28,26,23,0.08)',
                  fontSize: 12,
                }}
              />
              <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                {LEAD_PIPELINE.map((entry) => (
                  <Cell key={entry.label} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-5 border-t border-zinc-100 pt-5">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-black/55">
              Web vitals p75
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {WEB_VITALS.map((vital) => (
                <div
                  key={vital.metric}
                  className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-center"
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                    {vital.metric}
                  </p>
                  <p className="mt-1 font-serif text-xl text-emerald-900">{vital.value}</p>
                  <p className="text-[10px] text-emerald-600">{vital.target}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

interface KpiCardProps {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  value: string;
  deltaPct: number;
  color: string;
}

function KpiCard({ icon: Icon, label, value, deltaPct, color }: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm"
    >
      <div className="mb-4 flex items-start justify-between">
        <div className={`rounded-xl p-2.5 ${color}`}>
          <Icon size={20} />
        </div>
        <span
          className={`inline-flex items-center gap-0.5 text-[10px] font-bold ${
            deltaPct >= 0 ? 'text-emerald-600' : 'text-rose-500'
          }`}
        >
          {deltaPct >= 0 ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
          {Math.abs(deltaPct)}%
        </span>
      </div>
      <h3 className="text-xs font-medium uppercase tracking-wider text-zinc-500">{label}</h3>
      <p className="mt-1 font-serif text-3xl text-[var(--color-ink)]">{value}</p>
    </motion.div>
  );
}

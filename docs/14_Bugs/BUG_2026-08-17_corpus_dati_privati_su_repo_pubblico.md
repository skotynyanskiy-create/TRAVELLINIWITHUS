---
type: bug
status: open
area: delivery
priority: p0
owner: Skott
created: 2026-08-17
related:
  - '[[superpowers/specs/2026-08-14-corpus-e-modello-media-design]]'
  - '[[10_Projects/PROJECT_FIREBASE_HARDENING]]'
tags:
  - bug
  - sicurezza
  - corpus
---

# Il corpus Instagram sta in chiaro su un repository pubblico

Trovato il 2026-08-17 da un audit di sicurezza, **verificato riga per riga prima
di essere scritto qui**. Questa nota esiste perché la conversazione in cui è
emerso non è un posto dove una cosa del genere può restare.

## I fatti, ognuno verificato

| Cosa | Verifica |
| --- | --- |
| Il repository è **pubblico** | `gh repo view --json visibility` → `PUBLIC`, `isPrivate: false` |
| `src/data/instagram-corpus.json` è tracciato, 1,45 MB | `git ls-files`; entrato con `6f9e7b0` |
| `src/data/corpus-places.json` è tracciato | `git ls-files`; entrato con `ce50dd4` (2026-08-15) |
| Entrambi sono su `origin`, ramo della PR #27 | `git ls-tree -r origin/chore/config-hardening-2026-07-26` |
| **Non** sono su `origin/main` | stesso comando su `origin/main`: nessun file corpus |
| Riferimenti a strutture sanitarie | 8 in `instagram-corpus.json`, 2 in `corpus-places.json` |
| **Zero fork, zero osservatori, zero stelle** | `gh api .../forks` → `0`; `gh repo view` |

## Il limite reale all'esposizione

**Nessun codice dell'applicazione importa questi file.** L'unico consumatore è
`scripts/geocode-corpus-places.mjs`, che gira offline. La stringa non compare in
nessun chunk compilato: verificato su `dist/assets/*.js`.

Quindi il dato **non è sul sito**: è nel repository. È una distinzione che cambia
l'urgenza, non la sostanza.

E i fork a zero sono il fatto più fortunato: nessuno ha copiato. Rendere privato
il repository chiude davvero l'accesso invece di spostarlo altrove — con un fork
la bonifica sarebbe stata molto peggiore.

## Perché fa male più del solito

La regola c'era già. La spec del corpus — scritta il 2026-08-15, **prima** che
il problema si manifestasse — descrive esattamente questo caso e dice che
l'importatore deve scartarlo, mai proporlo. Il difetto non è che nessuno ci
avesse pensato: è che la regola è stata scritta per un importatore che non
esiste ancora, mentre il dato grezzo era già stato committato da un'altra strada.

## Cosa è stato fatto

- **2026-08-17**: verificato e portato all'owner, che ha scelto di rendere
  privato il repository come primo intervento.

## Cosa resta da fare, e da chi

1. **[OWNER] Rendere privato il repository.** È l'unica azione che riduce
   l'esposizione in un minuto.
2. **[OWNER + backend-engineer] Bonifica della storia.** Riscrittura su ogni ref
   che li contiene, poi force-push. È fra le operazioni che questo repo vieta
   senza conferma esplicita dell'owner, comando per comando. Da fare **insieme**
   alla purga della chiave Firebase Web (`PROJECT_FIREBASE_HARDENING`, tre
   occorrenze da aprile-maggio): stessa operazione, un giro solo.
3. **La scelta di struttura, prima di rimettere qualcosa.** Il corpus grezzo non
   serve all'applicazione. La strada pulita non è ripulirlo record per record ma
   **tenerlo fuori dal repository** (`.gitignore`) e committare solo il
   sottoinsieme già filtrato e rivisto che diventa `content-seed.json`. Meno
   superficie, e la regola della spec smette di dipendere da un filtro che
   qualcuno deve ricordarsi di scrivere.
4. **[VERIFY]** Nessuno ha ancora riletto tutte le 1.283 didascalie e i 624
   luoghi cercando casi che una parola chiave non intercetta — per esempio un
   luogo che porta il nome di una persona. La ricerca fatta finora copre
   ospedali, cliniche, poliambulatori.

## Le altre voci dello stesso audit

Tutte **preesistenti**, nessuna nata dal lavoro di questi giorni: la chiave
Firebase Web nella storia, una sintassi che il validatore Firebase segnala in
`firestore.rules:101` dal primo commit di aprile, e `unsafe-inline` nella CSP.
Stripe (firma, idempotenza, integrità del prezzo), CORS, rate limit, header di
sicurezza, esposizione `VITE_*` e gate admin sono risultati solidi.

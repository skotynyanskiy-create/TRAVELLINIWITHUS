---
title: HANDOFF_webapp-travelliniwithus_data-analyst_to_divergenza
status: consumed
created: 2026-09-29
from: travellini-data-analyst
to: travellini-ui-designer (direzione e architettura), travellini-growth-revenue-operator, travellini-social-content-operator, travellini-seo-conversion-strategist, travellini-asset-curator
slug: webapp-travelliniwithus
expires: 2026-10-13
type: handoff
area: delivery
round: R0 (fact pack, prima della divergenza)
consumes: HANDOFF_webapp-travelliniwithus_orchestrator_to_data-analyst
---

# Handoff: fact pack del corpus per il brainstorming "Travelliniwithus webapp"

Documento interno. Nessuna cifra qui va sul sito senza una fonte datata
(`docs/20_Decisions/DECISION_PUBLIC_METRICS_SOURCE_TRAVELLINIWITHUS_2026-06-07.md`
nel ramo PR #27). Ogni numero ha, sotto la sua tabella, lo script che lo produce.
Ignoto = `[VERIFY: ...]`. Niente idee di prodotto o di UI: solo fatti.

## Esito in testa

- **Corpus tracciato in git: sì.** `src/data/instagram-corpus.json` (1.516.164 byte) e
  `src/data/corpus-places.json` (107.952 byte) sono nell'albero di `4fe1794`, non sono
  ignorati, e sono entrati con `6f9e7b0` (14 ago 2026) e `ce50dd4` (15 ago 2026). Il
  `[VERIFY]` del brief ("corpus forse non tracciato") è chiuso; la frase «non committato»
  della spec del 14 ago è superata. **Nessun rischio di fattibilità** per un indice
  derivato costruito in CI dal JSON tracciato (sezione 11).
- **Due limiti reali per la CI**: `instagram-corpus.json` non si rigenera (feed Instagram
  autenticato, sessione dell'owner); i campi `citta/regione/paese/amministrativo` di
  `corpus-places.json` vengono da Nominatim (rete, 1 richiesta/s, ~10 minuti): in CI si
  legge il file committato, non si rifà la geocodifica.
- **Il JSON tracciato contiene ancora le voci in deny-list** (2 post; 1 chiave in
  `corpus-places.json`). Oggi la deny-list è una regola, non è nei dati. Il repository
  remoto è su GitHub; `[VERIFY: visibilità pubblica o privata del repo]` non è
  determinabile offline. Se è pubblico, quelle voci sono già leggibili nel file.
- **Cifra da usare per "posti che possono avere una scheda con un reel": 409** nuovi
  luoghi (per coordinata), 297 in Italia (sezione 1). 533 è un tetto, non un dato d'uso.

## Cornice del brief (rispettata)

- **Decisioni già prese**: Travelliniwithus diventa una webapp; base di codice = ramo PR #27,
  commit `4fe1794`, checkout in sola lettura (`BEST`); fact pack interno; deny-list privacy
  della spec corpus (§1) valida per l'analisi.
- **Nota sul checkout**: `src/lib/seo.ts` ha una modifica locale non committata (funzione
  aggiunta dal main thread). Non è stata letta né usata.
- **Fuori scope, rispettato**: nessuna idea di prodotto o UI; nessun file di `BEST` né del
  codice modificato; nessuna riga aggiunta al repo (gli script stanno in un'area
  temporanea di sessione e sono riprodotti per intero in questo file); nessun numero social
  pubblico (follower, reach): non stanno nel corpus e non sono stimati.
- **Per l'owner** (non bloccante): (a) la sezione 14 è la base per la decisione privacy
  sull'area di casa, solo conteggi; (b) la deny-list contiene 1 luogo sanitario/estetico
  che nessuna regex per nome coglie, segnalato a mano: serve la conferma dell'owner
  (sezione 12); (c) `[VERIFY]` visibilità del repo (vedi sopra).
- **Prossimo passaggio**: giro 1 in parallelo (ui-designer x2, growth, social, seo,
  asset-curator). Trigger: questo file su disco con le 15 sezioni.

## Incongruenze con i "fatti verificati" del brief e della spec (vince il dato)

| Dichiarato | Dato ricalcolato | Dove |
| --- | --- | --- |
| 1.192 reel + 84 caroselli + 6 foto = 1.283 post | La somma dà 1.282: manca 1 post con `tipo: "video"`. Il totale 1.283 è giusto | 2 |
| "1.017 reel citano un luogo" | 1.017 è il numero di reel **con coordinate**. Reel con un'etichetta di luogo: 1.043 (26 senza coordinate). Reel senza alcun luogo: 149 | 4, 15 |
| "circa 186 milioni di plays" | 186.303.699 = solo i 1.017 reel con coordinate. Tutti i 1.192 reel: 211.941.714 plays; gli altri 25.638.015 (12,1%) stanno su 175 reel non mappabili | 4 |
| Spec: 1.085 post con coordinate | 1.087 | 1 |
| Commit `ce50dd4`: «624 luoghi distinti per coordinata» | 624 è per **nome**; per coordinata sono 640 (come dice la spec). Due unità diverse | 1 |
| Spec: 31 luoghi nuovi «esistono solo come post» (30 caroselli, 2 foto, 1 video) | 29 cluster solo-post (contengono quei 33 post) **più** 2 cluster con soli reel di classe `listicle`: 29 + 2 = 31. Il 533 è "≥1 reel classe candidato", mentre "≥1 reel di qualsiasi classe" è 535 | 1 |
| Spec: 545 luoghi con indirizzo preciso (564 − 19 grappoli, 200 post) | **Non riproducibile**: nessun campo "generico" nei file. Il flag `amministrativo` di `corpus-places.json` (aggiunto dopo, `ce50dd4`) toglie 120 cluster / 366 post tra i 564 nuovi, non 19 / 200 | 1 |
| `docs/13_Content/ARCHIVIO_REEL_DA_PROMUOVERE_2026-08-15.md`: 404 luoghi girati e mai pubblicati (606 − 112 − 90) | 112 amministrativi riprodotto; 606 e 90 no (595 e 62). Più vicino: 421 per nome, 409 per coordinata (88,7 M plays contro i 90,4 M del doc) | 1 |
| Spec: Sardegna, Marche, FVG, Molise, Basilicata, Norvegia a zero | Sei regioni italiane a zero **reel**: le cinque più **Puglia**. Basilicata e Puglia hanno 3 luoghi ma solo caroselli. Norvegia: nessun luogo norvegese nel file | 7 |
| "84 cover in `public/images/reels/`" | 86 stem distinti; 84 hanno la variante 768 px | 10 |
| Spec: corpus «non committato» | Tracciato | 11 |
| Spec: 76 luoghi già in registro | 76 sono **coordinate**; i post `inRegistro` sono 86 (9 senza coordinate); le schede nel registro sono 110: 86 con codice reel nel corpus (79 visibili + 7 segnaposto) e 24 con solo il link al profilo (tutte segnaposto) | 1, 10 |

Confermati senza scarti: 1.283 post dal 25 lug 2021 al 13 ago 2026; 624 luoghi (chiave =
nome); 120 amministrativi; per paese sui 624: Italia 463, Spagna 31, Regno Unito 17, Emirati
15, Francia 11, Egitto 10 (sezione 7); 79 schede visibili su 110; `reels.ts` con 67 voci.

## Basi di calcolo e convenzioni (valgono per tutte le sezioni)

| Nome | Definizione | Numero |
| --- | --- | --- |
| Corpus intero | `instagram-corpus.json` | 1.283 post: 1.192 reel, 84 caroselli, 6 foto, 1 video |
| Corpus usabile | corpus meno i 2 post in deny-list | 1.281 post; 1.190 reel; 1.016 reel con coordinate |
| Luogo (nome) | nome dell'etichetta con `trim()`; è la chiave di `corpus-places.json` | 624 (596 con ≥1 reel; 595 senza deny-list) |
| Luogo (coordinata) | coppia (lat, lng) esatta | 640 |
| Generico | flag `amministrativo` (120) più 16 varianti-città che il flag non prende («Torino, Italy», «Londra»…) | 136 luoghi |
| Locale | luogo non generico | 467 luoghi con ≥1 reel, senza deny-list |
| Data | `takenAt` (epoch s) in fuso Europe/Rome | è la data di **pubblicazione**, non della visita |
| Percentili | interpolazione lineare (tipo R-7) | - |

Quando una sezione usa il corpus intero anziché l'usabile lo dice. Regola generale: le
tabelle di soli conteggi tornano sul corpus intero solo dove serve riconciliare (sezioni 1,
2, 4); tutto ciò che stampa nomi, testi o liste esclude la deny-list.

**Cosa il corpus NON contiene**: la data della visita (solo la pubblicazione); il testo dei
commenti; salvataggi, condivisioni, reach, follower; un campo `snapshotAt` (i plays sono
fermi al 14 ago 2026, vedi sezione 4); `plays` per caroselli, foto e video (91 post con
`plays` nullo). GA4, Stripe e Sentry non sono stati interrogati: non erano nel brief.

## Come rieseguire

Ogni script `sNN.js` richiede il preambolo `fp-lib.js` nella stessa cartella. Variabili:

```bash
export BEST=<checkout del ramo, commit 4fe1794>
export DENY_CODES=<id del post escluso, spec corpus §1 punto 1>   # l'id NON è riportato in questo file
export DENY_MANUAL=<percorso a un JSON con l'elenco a mano dei luoghi sanitari non riconoscibili per nome>  # elenco fuori file
node s01.js
```

I blocchi `<details>` con gli script servono alla verifica: chi usa i numeri può saltarli.
Senza `DENY_MANUAL` la deny-list esclude 1 post in meno (1.282 usabili, non 1.281) e i
numeri legati a quel post cambiano al massimo di 1. Le stampe di nomi (sezioni 3 e 4) sono
nomi di locali pubblici.

<details><summary>fp-lib.js (preambolo comune)</summary>

```js
// fp-lib.js — preambolo comune del fact pack. Sola lettura sui file di BEST.
// Uso: BEST=<checkout> DENY_CODES=<id post da spec §1> [DENY_MANUAL=<json array di nomi>] node sNN.js
const fs = require('fs');
const BEST = process.env.BEST;
const corpus = require(BEST + '/src/data/instagram-corpus.json');
const places = require(BEST + '/src/data/corpus-places.json');
const seed = require(BEST + '/src/data/content-seed.json');
const DENY_CODES = (process.env.DENY_CODES || '').split(',').filter(Boolean);
const DENY_MANUAL = process.env.DENY_MANUAL ? require(process.env.DENY_MANUAL) : [];

const trim = (s) => s.trim();
const hasCoords = (p) => !!(p.location && p.location.lat != null && p.location.lng != null);
const placeName = (p) => (hasCoords(p) ? trim(p.location.name) : null);
const coordKey = (p) => (hasCoords(p) ? p.location.lat + ',' + p.location.lng : null);

// Deny-list (spec corpus §1). Categorie: post-esplicito | sanitaria | scuola | manuale-sanitaria
const SAN = /\b(ospedal\w*|clinic\w*|policlinic\w*|poliambulator\w*|ambulator\w*|studio medic\w*|casa di cura|consultor\w*|pronto soccorso|centro medic\w*|irccs|asst|ausl|maternit\w*|hospital)\b/i;
const FALSE_FRIEND = /ospedale delle bambole/i;
const SCH = /\b(scuol\w*|asil\w*|nido|nidi|liceo|istituto comprensivo|materna|elementar\w*|kindergarten|school)\b/i;
function denyName(name) {
  if (!name) return null;
  if (FALSE_FRIEND.test(name)) return null;
  if (SAN.test(name)) return 'sanitaria';
  if (SCH.test(name)) return 'scuola';
  if (DENY_MANUAL.includes(name)) return 'manuale-sanitaria';
  return null;
}
function denyPost(p) {
  if (DENY_CODES.includes(p.code)) return 'post-esplicito';
  return p.location ? denyName(trim(p.location.name)) : null;
}
const denied = (p) => !!denyPost(p);
const deniedName = (n) => !!denyName(n);

// Calendario in Europe/Rome (takenAt = epoch secondi, data di PUBBLICAZIONE)
const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome', year: 'numeric', month: '2-digit', day: '2-digit' });
const dateOf = (p) => fmt.format(new Date(p.takenAt * 1000)); // YYYY-MM-DD
const yearOf = (p) => +dateOf(p).slice(0, 4);
const monthOf = (p) => +dateOf(p).slice(5, 7);
const dayNum = (p) => Math.round(Date.parse(dateOf(p) + 'T00:00:00Z') / 86400000);

// Statistiche (quantile: interpolazione lineare, tipo R-7)
const sum = (a) => a.reduce((s, x) => s + x, 0);
const q = (arr, f) => { const a = [...arr].sort((x, y) => x - y); if (!a.length) return null; const i = (a.length - 1) * f, lo = Math.floor(i), hi = Math.ceil(i); return a[lo] + (a[hi] - a[lo]) * (i - lo); };
const median = (a) => q(a, 0.5);
const nf = (n) => (n == null ? 'n/d' : String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
const pct = (a, b) => (b ? (100 * a / b).toFixed(1).replace('.', ',') + '%' : 'n/d');
const table = (head, rows) => [head.join(' | '), head.map(() => '---').join(' | '), ...rows.map((r) => r.join(' | '))].map((l) => '| ' + l + ' |').join('\n');
const tally = (arr, f) => { const m = {}; arr.forEach((x) => { const k = f(x); m[k] = (m[k] || 0) + 1; }); return m; };
const reels = corpus.filter((p) => p.tipo === 'reel');
const usable = corpus.filter((p) => !denied(p));
const isAdmin = (name) => !!(places[name] && places[name].amministrativo);

// Etichette "generiche": oltre al flag amministrativo (uguaglianza esatta con il nome risolto),
// prende le varianti tipo "Torino, Italy" / "Milano italy" / "Londra" il cui nome base coincide con
// una citta', regione o paese risolti da corpus-places.json.
const normL = (v) => (v || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const ADMIN_SET = new Set();
Object.entries(places).forEach(([k, v]) => { [v.citta, v.regione, v.paese].forEach((x) => x && ADMIN_SET.add(normL(x))); if (v.amministrativo) ADMIN_SET.add(normL(k)); });
const COUNTRY_TAIL = /\b(italy|italia|italiana|spain|spagna|espana|france|francia|germany|england|inghilterra|uk|uae|czech republic|republica ceca|nederlands|denmark|hangary|china)\b/g;
const looksGeneric = (name) => {
  if (isAdmin(name)) return true;
  const first = normL(name.split(',')[0]);
  const stripped = normL(name).replace(COUNTRY_TAIL, ' ').replace(/\s+/g, ' ').trim();
  return ADMIN_SET.has(first) || ADMIN_SET.has(stripped) || ADMIN_SET.has(normL(name));
};
module.exports = { looksGeneric, fs, BEST, corpus, places, seed, trim, hasCoords, placeName, coordKey, denyName, denyPost, denied, deniedName, dateOf, yearOf, monthOf, dayNum, sum, q, median, nf, pct, table, tally, reels, usable, isAdmin };
```

</details>

---

## 1. Riconciliazione 640 / 624 / 564 / 545 / 533

| Cifra | Fonte (brief/spec) | Ricalcolo | Definizione usata |
| --- | --- | --- | --- |
| Post distinti | 1.283 | 1.283 | corpus.length |
| Post con coordinate | 1.085 (spec) | 1.087 | location.lat e lng non null |
| 640 luoghi | 640 | 640 | coppie (lat,lng) distinte sui post con coordinate |
| 624 luoghi | 624 | 624 chiavi / 624 nomi distinti | nomi (trim) distinti sui post con coordinate = chiavi di corpus-places.json |
| 76 in registro | 76 | 76 | coordinate toccate da >=1 post con inRegistro=true (86 post inRegistro, 77 con coordinate) |
| 564 nuovi | 564 | 564 | 640 - 76 |
| 533 nuovi con >=1 reel | 533 | 533 | nuovi con >=1 reel classe "candidato" |
|   variante: >=1 reel di qualsiasi classe | - | 535 | nuovi con >=1 tipo=reel |
|   nuovi senza alcun reel (solo post) | 31 (spec) | 29 | nuovi con 0 reel |
|   nuovi con reel ma nessuno "candidato" | - | 2 | reel solo di classe listicle/adv-prodotto/altro |
| 545 con indirizzo preciso | 545 | NON RIPRODUCIBILE | nessun campo "generico" nei file: vedi s01b |

- Post-only clusters: tipi dei post = {"carosello":30,"foto":2,"video":1}
- Cluster nuovi con reel ma solo non-candidato: classi dei loro reel = {"listicle":2}

- Nomi con >1 coordinata: 17 | coordinate con >1 nome: 4
- Luoghi per nome con >=1 reel: 596 | con 0 reel: 28

- Amministrativo (flag corpus-places) tra i 564 nuovi: 120 cluster, 366 post
- Tra i 533 nuovi con reel candidato: amministrativi 110 | non amministrativi 423 | non amm. e non deny-list 422 | deny-list 1
- Amministrativi per nome nell'intero corpus-places.json: 120 su 624
- Post nei cluster amministrativi nuovi con reel candidato: 356
- Prove sul 19/200 della spec: amm & >=2 post: 40 cluster/286 post ; amm & >=3 post: 24 cluster/254 post ; amm & >=4 post: 15 cluster/227 post ; amm & >=5 post: 13 cluster/219 post
- Tra i 422 nuovi utilizzabili (533 - amministrativi - deny-list): in Italia 305 | all'estero 117

**Lettura.** Le cifre sono unità diverse, non stime diverse della stessa cosa: 640 = coordinate
distinte; 624 = nomi distinti (chiave di `corpus-places.json`, che raggruppa per nome e
geocodifica la prima coordinata vista per quel nome); 76 = coordinate toccate da un post con
scheda; 564 = 640 − 76; 533 = nuove coordinate con ≥1 reel di classe `candidato`. Il 545 non
si ricostruisce. Unità: 17 nomi hanno più di una coordinata, 4 coordinate hanno più di un nome.

Riproduzione del 404 del documento ARCHIVIO e cifra d'uso:

- Reel tolti (listicle+adv-prodotto+non-posto): 64 (doc: 70) | reel senza geotag (nessun luogo): 129 | senza coordinate: 153 (doc: 123)
- Etichette (nomi) con coordinate: 595 (doc: 606) | amministrative (flag): 112 (doc: 112) | locali: 483 | gia' in registro per nome: 62 (doc: 90) | restano: 421 (doc: 404)

- Per coordinata: nuovi con reel candidato 533 | senza amministrativi (flag) e deny-list: 422 | togliendo anche le etichette-citta' non catturate dal flag: 409
- Reel corrispondenti ai 409 luoghi: 484 | plays: 88656647
- Di questi in Italia: 297 | con >=2 reel: 53

| Cifra | Cosa è | Uso |
| --- | --- | --- |
| 533 | nuovi per coordinata con ≥1 reel `candidato`, **incluse** 110 etichette amministrative e 1 voce deny-list | tetto; non è "posti con scheda possibile" |
| 422 | come sopra, tolti i 110 amministrativi (flag) e la deny-list | intermedio |
| **409** | come 422, tolte anche 13 etichette-città che il flag non prende | **cifra d'uso**: 297 in Italia, 484 reel, 88.656.647 plays, 53 con ≥2 reel |
| 76 | coordinate con scheda già in registro | si sommano ai 409 se si conta "posti con reel", non "nuovi" |

Unità consigliata per una scheda: la coordinata (una scheda ha un punto sulla mappa).
Attenzione al limite di qualità della sezione 7: circa 1 etichetta su 5 che nomina un paese
cade in un altro paese, quindi la coordinata del geotag non è affidabile per la mappa.

<details><summary>Script s01.js</summary>

```js
const L = require('./fp-lib.js');
const { corpus, places, hasCoords, coordKey, placeName, tally, table, nf } = L;
const wc = corpus.filter(hasCoords);
// cluster per coordinata esatta (lat,lng)
const C = new Map();
wc.forEach((p) => { const k = coordKey(p); const o = C.get(k) || { posts: [], names: new Set() }; o.posts.push(p); o.names.add(placeName(p)); C.set(k, o); });
const cl = [...C.values()].map((o) => ({ ...o,
  reg: o.posts.some((p) => p.inRegistro),
  reel: o.posts.filter((p) => p.tipo === 'reel').length,
  reelCand: o.posts.filter((p) => p.tipo === 'reel' && p.classe === 'candidato').length,
  amm: [...o.names].some(L.isAdmin),
  deny: o.posts.some(L.denied) }));
const nw = cl.filter((o) => !o.reg);
const byName = new Map(); wc.forEach((p) => { const n = placeName(p); const o = byName.get(n) || { reel: 0, posts: 0 }; o.posts++; if (p.tipo === 'reel') o.reel++; byName.set(n, o); });
const rows = [
  ['Post distinti', '1.283', nf(corpus.length), 'corpus.length'],
  ['Post con coordinate', '1.085 (spec)', nf(wc.length), 'location.lat e lng non null'],
  ['640 luoghi', '640', nf(cl.length), 'coppie (lat,lng) distinte sui post con coordinate'],
  ['624 luoghi', '624', nf(Object.keys(places).length) + ' chiavi / ' + byName.size + ' nomi distinti', 'nomi (trim) distinti sui post con coordinate = chiavi di corpus-places.json'],
  ['76 in registro', '76', nf(cl.filter((o) => o.reg).length), 'coordinate toccate da >=1 post con inRegistro=true (' + corpus.filter((p) => p.inRegistro).length + ' post inRegistro, ' + corpus.filter((p) => p.inRegistro && hasCoords(p)).length + ' con coordinate)'],
  ['564 nuovi', '564', nf(nw.length), '640 - 76'],
  ['533 nuovi con >=1 reel', '533', nf(nw.filter((o) => o.reelCand > 0).length), 'nuovi con >=1 reel classe "candidato"'],
  ['  variante: >=1 reel di qualsiasi classe', '-', nf(nw.filter((o) => o.reel > 0).length), 'nuovi con >=1 tipo=reel'],
  ['  nuovi senza alcun reel (solo post)', '31 (spec)', nf(nw.filter((o) => o.reel === 0).length), 'nuovi con 0 reel'],
  ['  nuovi con reel ma nessuno "candidato"', '-', nf(nw.filter((o) => o.reel > 0 && o.reelCand === 0).length), 'reel solo di classe listicle/adv-prodotto/altro'],
  ['545 con indirizzo preciso', '545', 'NON RIPRODUCIBILE', 'nessun campo "generico" nei file: vedi s01b'],
];
console.log(table(['Cifra', 'Fonte (brief/spec)', 'Ricalcolo', 'Definizione usata'], rows));
console.log('\nPost-only clusters: tipi dei post =', JSON.stringify(tally(nw.filter((o) => o.reel === 0).flatMap((o) => o.posts), (p) => p.tipo)));
console.log('Cluster nuovi con reel ma solo non-candidato: classi dei loro reel =', JSON.stringify(tally(nw.filter((o) => o.reel > 0 && o.reelCand === 0).flatMap((o) => o.posts.filter((p) => p.tipo === 'reel')), (p) => p.classe)));
// unita' "posto"
const namesMulti = [...C.values()].length;
const nameCoords = {}; wc.forEach((p) => { (nameCoords[placeName(p)] = nameCoords[placeName(p)] || new Set()).add(coordKey(p)); });
const coordNames = {}; wc.forEach((p) => { (coordNames[coordKey(p)] = coordNames[coordKey(p)] || new Set()).add(placeName(p)); });
console.log('\nNomi con >1 coordinata:', Object.values(nameCoords).filter((s) => s.size > 1).length, '| coordinate con >1 nome:', Object.values(coordNames).filter((s) => s.size > 1).length);
console.log('Luoghi per nome con >=1 reel:', [...byName.values()].filter((o) => o.reel > 0).length, '| con 0 reel:', [...byName.values()].filter((o) => o.reel === 0).length);
// amministrativi
const nwr = nw.filter((o) => o.reelCand > 0);
const nwrOk = nwr.filter((o) => !o.amm && !o.deny);
console.log('\nAmministrativo (flag corpus-places) tra i 564 nuovi:', nw.filter((o) => o.amm).length, 'cluster,', nw.filter((o) => o.amm).reduce((s, o) => s + o.posts.length, 0), 'post');
console.log('Tra i 533 nuovi con reel candidato: amministrativi', nwr.filter((o) => o.amm).length, '| non amministrativi', nwr.filter((o) => !o.amm).length, '| non amm. e non deny-list', nwrOk.length, '| deny-list', nwr.filter((o) => o.deny).length);
console.log('Amministrativi per nome nell\'intero corpus-places.json:', Object.values(places).filter((v) => v.amministrativo).length, 'su', Object.keys(places).length);
console.log('Post nei cluster amministrativi nuovi con reel candidato:', nwr.filter((o) => o.amm).reduce((s, o) => s + o.posts.length, 0));
// tentativi sul "545 = 564 - 19 grappoli / 200 post"
let best = [];
for (const th of [2, 3, 4, 5]) { const g = nw.filter((o) => o.amm && o.posts.length >= th); best.push('amm & >=' + th + ' post: ' + g.length + ' cluster/' + g.reduce((s, o) => s + o.posts.length, 0) + ' post'); }
console.log('Prove sul 19/200 della spec:', best.join(' ; '));
// Italia vs estero tra i nuovi utilizzabili (non amm, non deny)
console.log('Tra i', nwrOk.length, 'nuovi utilizzabili (533 - amministrativi - deny-list): in Italia', nwrOk.filter((o) => [...o.names].every((n) => places[n] && places[n].paese === 'Italia')).length, '| all\'estero', nwrOk.filter((o) => ![...o.names].every((n) => places[n] && places[n].paese === 'Italia')).length);
```

</details>

<details><summary>Script s01b.js</summary>

```js
const L = require('./fp-lib.js');
const { corpus, reels, places, hasCoords, placeName, coordKey, tally } = L;
// Riproduzione del "404" di docs/13_Content/ARCHIVIO_REEL_DA_PROMUOVERE_2026-08-15.md (606 etichette - 112 amministrative - 90 coperte)
const keep = reels.filter((p) => !['listicle', 'adv-prodotto', 'non-posto'].includes(p.classe));
const geo = keep.filter(hasCoords);
const names = new Set(geo.map(placeName));
const adm = [...names].filter(L.isAdmin);
const regNames = new Set(geo.filter((p) => p.inRegistro).map(placeName));
const loc = [...names].filter((n) => !L.isAdmin(n));
console.log('Reel tolti (listicle+adv-prodotto+non-posto):', reels.length - keep.length, '(doc: 70) | reel senza geotag (nessun luogo):', keep.filter((p) => !p.location).length, '| senza coordinate:', keep.filter((p) => !hasCoords(p)).length, '(doc: 123)');
console.log('Etichette (nomi) con coordinate:', names.size, '(doc: 606) | amministrative (flag):', adm.length, '(doc: 112) | locali:', loc.length, '| gia\' in registro per nome:', loc.filter((n) => regNames.has(n)).length, '(doc: 90) | restano:', loc.filter((n) => !regNames.has(n)).length, '(doc: 404)');
// Variante per coordinata, stessa logica del 533 (nuovi, >=1 reel candidato), tolti amministrativi e deny-list
const C = new Map(); corpus.filter(hasCoords).forEach((p) => { const o = C.get(coordKey(p)) || { posts: [], names: new Set() }; o.posts.push(p); o.names.add(placeName(p)); C.set(coordKey(p), o); });
const nw = [...C.values()].filter((o) => !o.posts.some((p) => p.inRegistro) && o.posts.some((p) => p.tipo === 'reel' && p.classe === 'candidato'));
const A = nw.filter((o) => ![...o.names].some(L.isAdmin) && !o.posts.some(L.denied));
const B = A.filter((o) => ![...o.names].some(L.looksGeneric));
console.log('\nPer coordinata: nuovi con reel candidato', nw.length, '| senza amministrativi (flag) e deny-list:', A.length, '| togliendo anche le etichette-citta\' non catturate dal flag:', B.length);
console.log('Reel corrispondenti ai', B.length, 'luoghi:', B.reduce((s, o) => s + o.posts.filter((p) => p.tipo === 'reel').length, 0), '| plays:', B.reduce((s, o) => s + o.posts.filter((p) => p.tipo === 'reel').reduce((t, p) => t + p.plays, 0), 0));
console.log('Di questi in Italia:', B.filter((o) => [...o.names].every((n) => places[n] && places[n].paese === 'Italia')).length, '| con >=2 reel:', B.filter((o) => o.posts.filter((p) => p.tipo === 'reel').length >= 2).length);
```

</details>

## 2. Tempo: post per anno e per mese, per tipo

Corpus intero (1.283 post), mese di calendario in Europe/Rome.

| Anno | reel | carosello | foto | video | totale |
| --- | --- | --- | --- | --- | --- |
| 2021 | 50 | 42 | 4 | 1 | 97 |
| 2022 | 246 | 29 | 1 | 0 | 276 |
| 2023 | 267 | 7 | 0 | 0 | 274 |
| 2024 | 250 | 0 | 0 | 0 | 250 |
| 2025 | 241 | 3 | 1 | 0 | 245 |
| 2026 | 138 | 3 | 0 | 0 | 141 |
| Totale | 1192 | 84 | 6 | 1 | 1283 |

- Reel per mese (punto = 0):

| Anno | gen | feb | mar | apr | mag | giu | lug | ago | set | ott | nov | dic | tot |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2021 | . | . | . | . | . | . | 2 | 4 | 8 | 7 | 11 | 18 | 50 |
| 2022 | 19 | 16 | 19 | 18 | 15 | 13 | 16 | 24 | 25 | 28 | 29 | 24 | 246 |
| 2023 | 25 | 23 | 26 | 25 | 24 | 21 | 23 | 14 | 20 | 23 | 25 | 18 | 267 |
| 2024 | 16 | 17 | 22 | 22 | 24 | 22 | 25 | 20 | 23 | 21 | 17 | 21 | 250 |
| 2025 | 23 | 19 | 20 | 23 | 19 | 20 | 20 | 17 | 21 | 24 | 16 | 19 | 241 |
| 2026 | 16 | 17 | 19 | 19 | 19 | 18 | 22 | 8 | . | . | . | . | 138 |

- Caroselli+foto+video per mese (punto = 0):

| Anno | gen | feb | mar | apr | mag | giu | lug | ago | set | ott | nov | dic | tot |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2021 | . | . | . | . | . | . | 3 | 9 | 12 | 9 | 9 | 5 | 47 |
| 2022 | 5 | 4 | 5 | 4 | 3 | 2 | 4 | 1 | . | . | . | 2 | 30 |
| 2023 | 1 | . | . | . | 2 | 1 | . | 1 | 1 | . | . | 1 | 7 |
| 2024 | . | . | . | . | . | . | . | . | . | . | . | . | 0 |
| 2025 | . | . | 1 | . | . | . | 2 | . | . | 1 | . | . | 4 |
| 2026 | 1 | . | 1 | . | . | . | 1 | . | . | . | . | . | 3 |

- Primo post 2021-07-25 | ultimo 2026-08-13
- Mesi di calendario nel periodo: 62 | senza alcun reel: 0
- 5 mesi con piu reel: 2022-11=29, 2022-10=28, 2023-03=26, 2024-07=25, 2023-11=25
- Non-reel per anno: {"2021":47,"2022":30,"2023":7,"2025":4,"2026":3}
- Reel 2025-09-01..2026-08-13: 218 | 2024-09-01..2025-08-31: 243 | 2023-09-01..2024-08-31: 254

**Lettura.** Dal 2022 il ritmo dei reel è stabile: 246, 267, 250, 241 all'anno; il 2021 è un
semestre (lug-dic, 50) e il 2026 è fermo al 13 ago (138; agosto ne ha 8). Nessun mese di
calendario tra lug 2021 e ago 2026 è senza reel (62 su 62). I caroselli sono un fatto del
2021-22 (42 + 29 su 84); nel 2024 non ce ne sono. Le finestre finali sono di lunghezza
diversa (l'ultima è 18 giorni più corta): non sono un confronto alla pari.

<details><summary>Script s02.js</summary>

```js
const L = require('./fp-lib.js');
const { corpus, yearOf, monthOf, tally, table, nf } = L;
const TIPI = ['reel', 'carosello', 'foto', 'video'];
const years = [...new Set(corpus.map(yearOf))].sort();
// A) anno x tipo
const rowsA = years.map((y) => { const ps = corpus.filter((p) => yearOf(p) === y); const t = tally(ps, (p) => p.tipo); return [y, ...TIPI.map((k) => t[k] || 0), ps.length]; });
const tot = ['Totale', ...TIPI.map((k) => corpus.filter((p) => p.tipo === k).length), corpus.length];
console.log(table(['Anno', ...TIPI, 'totale'], [...rowsA, tot]));
// B) mese x anno, solo reel; C) mese x anno, non-reel
const grid = (filter) => table(['Anno', 'gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic', 'tot'],
  years.map((y) => { const row = Array.from({ length: 12 }, (_, m) => corpus.filter((p) => filter(p) && yearOf(p) === y && monthOf(p) === m + 1).length); return [y, ...row.map((n) => n || '.'), row.reduce((a, b) => a + b, 0)]; }));
console.log('\nReel per mese (punto = 0):\n' + grid((p) => p.tipo === 'reel'));
console.log('\nCaroselli+foto+video per mese (punto = 0):\n' + grid((p) => p.tipo !== 'reel'));
// D) sintesi
const ym = {}; corpus.forEach((p) => { const k = L.dateOf(p).slice(0, 7); ym[k] = (ym[k] || 0) + (p.tipo === 'reel' ? 1 : 0); });
const first = L.dateOf(corpus.reduce((a, b) => (a.takenAt < b.takenAt ? a : b))), last = L.dateOf(corpus.reduce((a, b) => (a.takenAt > b.takenAt ? a : b)));
console.log('\nPrimo post', first, '| ultimo', last);
const allMonths = []; for (let y = 2021, m = 7; y < 2026 || m <= 8; m++) { if (m > 12) { m = 1; y++; } allMonths.push(y + '-' + String(m).padStart(2, '0')); if (y === 2026 && m === 8) break; }
const zero = allMonths.filter((k) => !ym[k]);
console.log('Mesi di calendario nel periodo:', allMonths.length, '| senza alcun reel:', zero.length, zero.join(' '));
const top = Object.entries(ym).sort((a, b) => b[1] - a[1]).slice(0, 5);
console.log('5 mesi con piu reel:', top.map(([k, n]) => k + '=' + n).join(', '));
const nonReelMonths = {}; corpus.filter((p) => p.tipo !== 'reel').forEach((p) => { const k = L.dateOf(p).slice(0, 4); nonReelMonths[k] = (nonReelMonths[k] || 0) + 1; });
console.log('Non-reel per anno:', JSON.stringify(nonReelMonths));
// ultimi 12 mesi pieni vs precedenti 12 (set 2024-ago 2025 vs set 2025-ago 2026), reel
const win = (a, b) => corpus.filter((p) => p.tipo === 'reel' && L.dateOf(p) >= a && L.dateOf(p) <= b).length;
console.log('Reel 2025-09-01..2026-08-13:', win('2025-09-01', '2026-08-13'), '| 2024-09-01..2025-08-31:', win('2024-09-01', '2025-08-31'), '| 2023-09-01..2024-08-31:', win('2023-09-01', '2024-08-31'));
```

</details>

## 3. Ritorni: luoghi con reel in date distinte a più di 30 giorni

Unità = nome (chiave del file). Solo reel con coordinate, deny-list esclusa. **Visita** =
finestra di 30 giorni aperta dalla prima data; un "ritorno" ha ≥2 visite (equivale a due date
di reel a più di 30 giorni di distanza). Il tempo è la data di **pubblicazione**: un reel può
uscire giorni o settimane dopo la visita.

- Luoghi (nome) con >=1 reel, senza deny-list: 595 | amministrativi: 112
- Con >=2 visite (>30 gg):  106 | di cui amministrativi (flag): 38 | non amministrativi: 68 | di cui etichette-citta non catturate dal flag: 6 | locali veri: 62
- Controllo per coordinata: cluster con >=1 reel 610 | con >=2 visite 104
- Distribuzione visite (tutti i luoghi, nome): {"1":489,"2":60,"3":27,"4":8,"5+":11}
- Distribuzione visite (solo non amministrativi): {"1":415,"2":43,"3":16,"4":4,"5+":5}
- Reel nei luoghi di ritorno non amministrativi: 206 su 639 reel in luoghi non amministrativi (32,2%)

| # | Luogo (etichetta corpus) | visite | reel | primo | ultimo | plays |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Movieland Park | 6 | 8 | 2023-04 | 2026-07 | 2.894.192 |
| 2 | Ristorante al Mago | 6 | 6 | 2023-10 | 2026-06 | 1.813.648 |
| 3 | Emotional Grand Motel | 5 | 6 | 2022-11 | 2025-10 | 4.822.408 |
| 4 | Phobos Group Verona | 4 | 9 | 2022-10 | 2025-10 | 1.967.186 |
| 5 | Europa Park, Rust Germany. | 4 | 5 | 2025-04 | 2026-04 | 405.962 |
| 6 | Antica Velathri Cafè | 4 | 4 | 2023-02 | 2026-05 | 694.939 |
| 7 | Il Rifugio Degli Artisti | 3 | 4 | 2022-01 | 2025-03 | 1.278.483 |
| 8 | Warner Bros. Studio Tour London | 3 | 4 | 2023-12 | 2026-07 | 795.368 |
| 9 | CUBE Challenges - Roma | 3 | 3 | 2022-08 | 2024-05 | 3.517.908 |
| 10 | La Santoria Madrid | 3 | 3 | 2023-04 | 2026-07 | 2.351.224 |
| 11 | Kudafushi Resort & Spa | 3 | 3 | 2022-07 | 2024-01 | 1.089.697 |
| 12 | Warner Bros Studio London | 3 | 3 | 2024-01 | 2024-12 | 954.362 |
| 13 | Valle Dei Re  Luxor | 3 | 3 | 2025-02 | 2026-07 | 809.933 |
| 14 | Memorabilia | 3 | 3 | 2023-02 | 2024-01 | 667.030 |
| 15 | Il Cascinetto | 3 | 3 | 2024-06 | 2026-03 | 440.218 |

- Alias "Warner Bro*": etichette 3 | reel 8 | visite unendo le etichette: 4 (separate: 3 + 3 + 1)
- Nomi con piu' di una coordinata (etichetta ambigua): 17

**Lettura.** 106 luoghi su 595 hanno ≥2 visite; togliendo 38 amministrativi (flag) e 6
etichette-città non catturate restano **62 locali veri**. Nei luoghi non amministrativi 68 su
483 tornano (14,1%) e portano il 32,2% dei reel non amministrativi. Nella top 15 due voci sono
lo stesso locale sotto etichette diverse (Warner Bros a Londra ha 3 etichette: unite fanno 8
reel e 4 visite). La stima per coordinata dà 104 luoghi di ritorno contro 106 per nome. 17 nomi
hanno più di una coordinata: l'etichetta non è un identificatore pulito.

<details><summary>Script s03.js</summary>

```js
const L = require('./fp-lib.js');
const { reels, places, placeName, dayNum, dateOf, hasCoords, coordKey, tally, table, nf, isAdmin } = L;
// Unita' = nome del luogo (chiave di corpus-places.json). Solo reel con coordinate, deny-list esclusa.
// Visita = finestra di 30 giorni aperta dalla prima data: una nuova visita parte quando una data cade > 30 giorni dopo l'inizio della visita corrente.
// "Ritorno" = >= 2 visite (equivale a: due date di reel a piu' di 30 giorni l'una dall'altra).
function visits(dates) { const d = [...new Set(dates)].sort((a, b) => a - b); let v = 0, start = -1e9; d.forEach((x) => { if (x - start > 30) { v++; start = x; } }); return { giorni: d.length, visite: v }; }
function build(keyFn) {
  const m = new Map();
  reels.filter((p) => hasCoords(p) && !L.denied(p)).forEach((p) => { const k = keyFn(p); const o = m.get(k) || { k, ps: [] }; o.ps.push(p); m.set(k, o); });
  return [...m.values()].map((o) => ({ ...o, ...visits(o.ps.map(L.dayNum)), reel: o.ps.length, plays: L.sum(o.ps.map((p) => p.plays)), first: dateOf(o.ps.reduce((a, b) => (a.takenAt < b.takenAt ? a : b))), last: dateOf(o.ps.reduce((a, b) => (a.takenAt > b.takenAt ? a : b))) }));
}
const byName = build(placeName);
const byCoord = build(coordKey);
const ret = byName.filter((o) => o.visite >= 2);
const retNA = ret.filter((o) => !isAdmin(o.k));
const retLoc = retNA.filter((o) => !L.looksGeneric(o.k)); // esclude anche le etichette-citta' che il flag non prende ("Torino, Italy", "Londra", ...)
console.log('Luoghi (nome) con >=1 reel, senza deny-list:', byName.length, '| amministrativi:', byName.filter((o) => isAdmin(o.k)).length);
console.log('Con >=2 visite (>30 gg): ', ret.length, '| di cui amministrativi (flag):', ret.length - retNA.length, '| non amministrativi:', retNA.length, '| di cui etichette-citta non catturate dal flag:', retNA.length - retLoc.length, '| locali veri:', retLoc.length);
console.log('Controllo per coordinata: cluster con >=1 reel', byCoord.length, '| con >=2 visite', byCoord.filter((o) => o.visite >= 2).length);
console.log('Distribuzione visite (tutti i luoghi, nome):', JSON.stringify(tally(byName, (o) => Math.min(o.visite, 5) === 5 ? '5+' : o.visite)));
console.log('Distribuzione visite (solo non amministrativi):', JSON.stringify(tally(byName.filter((o) => !isAdmin(o.k)), (o) => Math.min(o.visite, 5) === 5 ? '5+' : o.visite)));
console.log('Reel nei luoghi di ritorno non amministrativi:', L.sum(retNA.map((o) => o.reel)), 'su', L.sum(byName.filter((o) => !isAdmin(o.k)).map((o) => o.reel)), 'reel in luoghi non amministrativi (' + L.pct(L.sum(retNA.map((o) => o.reel)), L.sum(byName.filter((o) => !isAdmin(o.k)).map((o) => o.reel))) + ')');
const top = [...retLoc].sort((a, b) => b.visite - a.visite || b.giorni - a.giorni || b.plays - a.plays).slice(0, 15);
console.log('\n' + table(['#', 'Luogo (etichetta corpus)', 'visite', 'reel', 'primo', 'ultimo', 'plays'], top.map((o, i) => [i + 1, o.k, o.visite, o.reel, o.first.slice(0, 7), o.last.slice(0, 7), nf(o.plays)])));

// Alias: due etichette per lo stesso locale (controllo sui primi 15)
const wb = byName.filter((o) => /^Warner Bro/i.test(o.k)); const wbDays = wb.flatMap((o) => o.ps.map(L.dayNum)); const wbv = visits(wbDays);
console.log('\nAlias "Warner Bro*": etichette', wb.length, '| reel', L.sum(wb.map((o) => o.reel)), '| visite unendo le etichette:', wbv.visite, '(separate:', wb.map((o) => o.visite).join(' + ') + ')');
console.log('Nomi con piu\' di una coordinata (etichetta ambigua):', (() => { const m = {}; reels.filter(hasCoords).forEach((p) => { (m[placeName(p)] = m[placeName(p)] || new Set()).add(coordKey(p)); }); return Object.values(m).filter((s) => s.size > 1).length; })());
```

</details>

## 4. Attenzione: distribuzione dei plays

Base: `corpus-places.json` intero (624 luoghi, 186.303.699 plays: include il luogo in deny-list, che
compare solo nel conteggio, mai nelle liste) e reel singoli del corpus.

- Somma plays in corpus-places.json: 186.303.699 | somma plays reel nel corpus: 211.941.714 | reel senza coordinate (fuori da corpus-places): 175 reel, 25.638.015 plays = 12,1% dei plays dei reel
- Reel (corpus intero) per stato del luogo: con etichetta 1043 | con coordinate 1017 | con etichetta ma senza coordinate 26 | senza alcun luogo 149

| Insieme | n | mediana | p90 | p99 | max |
| --- | --- | --- | --- | --- | --- |
| Luoghi (nome), plays totali, tutti i 624 | 624 | 50.813 | 718.481 | 3.435.443 | 12.888.614 |
| Luoghi con >=1 reel | 596 | 55.377 | 734.471 | 3.521.869 | 12.888.614 |
| Luoghi con >=1 reel, non generici | 468 | 50.457 | 677.702 | 3.195.320 | 4.822.408 |
| Singoli reel (1.192) | 1192 | 41.965 | 428.856 | 2.295.414 | 5.532.872 |
| Singoli reel con coordinate (1.017) | 1017 | 42.628 | 436.946 | 2.270.727 | 5.532.872 |

- Quota dei 186.303.699 plays: primi 5 19,7% | primi 10 28,5% | primi 20 41,1% | primi 50 61,4% | primi 100 77,8%
- Primi 20 SOLO tra i luoghi non generici: quota sul totale 28,2% ( 52.586.341 plays)
- Etichette amministrative (flag): 120 luoghi, 60.723.453 plays = 32,6% | reel 377
- Flag + varianti-citta (looksGeneric): 136 luoghi, 67.088.009 plays = 36,0% | reel 423
- Solo l'etichetta esatta "Italia": 10.850.682 plays = 5,8%, 89 reel
- Etichette generiche per paese: Italia 28,8% dei plays (flag)

- Top 20 luoghi per plays (deny-list esclusa dalla stampa):

| # | Etichetta | reel | plays | generica? |
| --- | --- | --- | --- | --- |
| 1 | Milano | 42 | 12.888.614 | si |
| 2 | Italia | 89 | 10.850.682 | si |
| 3 | Emotional Grand Motel | 6 | 4.822.408 | no |
| 4 | Hyperspace Trampoline Parks Verona | 2 | 4.169.167 | no |
| 5 | Hi Hotels | 2 | 4.054.168 | no |
| 6 | Orrido di Bellano | 2 | 3.597.120 | no |
| 7 | CUBE Challenges - Roma | 3 | 3.517.908 | no |
| 8 | Madrid | 10 | 3.159.366 | si |
| 9 | MOOD Sushi Restaurant Verona | 1 | 3.036.433 | no |
| 10 | Phantasialand | 4 | 2.959.862 | no |
| 11 | Movieland Park | 8 | 2.894.192 | no |
| 12 | Calenzano (FI) | 1 | 2.644.881 | no |
| 13 | Somma Vesuviana | 2 | 2.629.252 | si |
| 14 | Torino, Italy | 7 | 2.577.176 | si |
| 15 | Ceylonz Suites by Mykey Global | 1 | 2.399.487 | no |
| 16 | La Santoria Madrid | 3 | 2.351.224 | no |
| 17 | Garden Village Bled - Slovenia | 2 | 2.147.062 | no |
| 18 | Verona | 17 | 2.030.268 | si |
| 19 | Phobos Group Verona | 9 | 1.967.186 | no |
| 20 | Mr Martini | 2 | 1.915.204 | no |

- Luoghi con >=1 reel per plays; quota dei luoghi che fa meta dei plays:  31 luoghi (su 596) fanno il 50% dei plays

| Anno pubblicazione | reel | mediana plays | p90 | max |
| --- | --- | --- | --- | --- |
| 2021 | 50 | 6.684 | 168.950 | 343.548 |
| 2022 | 246 | 56.415 | 460.357 | 3.830.428 |
| 2023 | 267 | 34.018 | 404.325 | 2.644.881 |
| 2024 | 250 | 50.729 | 608.101 | 5.532.872 |
| 2025 | 241 | 40.170 | 318.881 | 2.857.423 |
| 2026 | 138 | 49.543 | 277.947 | 1.110.842 |

- Plays deny-list (post esplicito + manuale): 308.076 su 186.303.699

**Lettura.** La distribuzione è molto asimmetrica: mediana 50.813 plays per luogo contro un
p90 di 718.481 (circa 14 volte) e un massimo di 12.888.614 (un'etichetta di città, 42 reel).
I primi 20 luoghi valgono il 41,1% dei plays; tra i soli non generici il 28,2%. Le etichette
generiche tengono il 32,6% (flag) o il 36,0% (flag più varianti-città); l'etichetta esatta
«Italia» da sola ha 89 reel e il 5,8%. 31 luoghi su 596 fanno il 50% dei plays. Effetto
dell'età: la mediana per reel del 2021 è 6.684, quella del 2022 è 56.415: i plays non sono
confrontabili tra anni senza correggere per età.

**Data di snapshot dei plays: 14 agosto 2026** (inferita: è la data della sessione di
enumerazione nella spec e del commit `6f9e7b0`; l'ultimo post è del 13 ago). Non c'è un campo
nel JSON. `[VERIFY: conferma dell'owner sul giorno e sull'ora dell'enumerazione]`.

<details><summary>Script s04.js</summary>

```js
const L = require('./fp-lib.js');
const { places, reels, table, nf, pct, q, median, sum, yearOf } = L;
const P = Object.entries(places).map(([k, v]) => ({ k, ...v }));
const TOT = sum(P.map((x) => x.plays));
console.log('Somma plays in corpus-places.json:', nf(TOT), '| somma plays reel nel corpus:', nf(sum(reels.map((p) => p.plays))), '| reel senza coordinate (fuori da corpus-places):', reels.filter((p) => !L.hasCoords(p)).length, 'reel,', nf(sum(reels.filter((p) => !L.hasCoords(p)).map((p) => p.plays))), 'plays =', pct(sum(reels.filter((p) => !L.hasCoords(p)).map((p) => p.plays)), sum(reels.map((p) => p.plays))), 'dei plays dei reel');
console.log('Reel (corpus intero) per stato del luogo: con etichetta', reels.filter((p) => p.location).length, '| con coordinate', reels.filter(L.hasCoords).length, '| con etichetta ma senza coordinate', reels.filter((p) => p.location && !L.hasCoords(p)).length, '| senza alcun luogo', reels.filter((p) => !p.location).length);
const stat = (label, arr) => [label, arr.length, nf(median(arr)), nf(q(arr, 0.9)), nf(q(arr, 0.99)), nf(Math.max(...arr))];
const withReel = P.filter((x) => x.reel > 0);
console.log('\n' + table(['Insieme', 'n', 'mediana', 'p90', 'p99', 'max'], [
  stat('Luoghi (nome), plays totali, tutti i 624', P.map((x) => x.plays)),
  stat('Luoghi con >=1 reel', withReel.map((x) => x.plays)),
  stat('Luoghi con >=1 reel, non generici', withReel.filter((x) => !L.looksGeneric(x.k)).map((x) => x.plays)),
  stat('Singoli reel (1.192)', reels.map((p) => p.plays)),
  stat('Singoli reel con coordinate (1.017)', reels.filter(L.hasCoords).map((p) => p.plays)),
]));
const sorted = [...P].sort((a, b) => b.plays - a.plays);
const top = (n, arr) => sum(arr.slice(0, n).map((x) => x.plays));
const nonGen = sorted.filter((x) => !L.looksGeneric(x.k));
console.log('\nQuota dei ' + nf(TOT) + ' plays: primi 5', pct(top(5, sorted), TOT), '| primi 10', pct(top(10, sorted), TOT), '| primi 20', pct(top(20, sorted), TOT), '| primi 50', pct(top(50, sorted), TOT), '| primi 100', pct(top(100, sorted), TOT));
console.log('Primi 20 SOLO tra i luoghi non generici: quota sul totale', pct(top(20, nonGen), TOT), '(', nf(top(20, nonGen)), 'plays)');
const amm = P.filter((x) => x.amministrativo), gen = P.filter((x) => L.looksGeneric(x.k));
console.log('Etichette amministrative (flag): ' + amm.length + ' luoghi,', nf(sum(amm.map((x) => x.plays))), 'plays =', pct(sum(amm.map((x) => x.plays)), TOT), '| reel', sum(amm.map((x) => x.reel)));
console.log('Flag + varianti-citta (looksGeneric): ' + gen.length + ' luoghi,', nf(sum(gen.map((x) => x.plays))), 'plays =', pct(sum(gen.map((x) => x.plays)), TOT), '| reel', sum(gen.map((x) => x.reel)));
console.log('Solo l\'etichetta esatta "Italia":', places['Italia'] ? nf(places['Italia'].plays) + ' plays = ' + pct(places['Italia'].plays, TOT) + ', ' + places['Italia'].reel + ' reel' : 'assente');
console.log('Etichette generiche per paese: Italia', pct(sum(amm.filter((x) => x.paese === 'Italia').map((x) => x.plays)), TOT), 'dei plays (flag)');
const t20 = sorted.slice(0, 20);
console.log('\nTop 20 luoghi per plays (deny-list esclusa dalla stampa):');
console.log(table(['#', 'Etichetta', 'reel', 'plays', 'generica?'], t20.filter((x) => !L.deniedName(x.k)).map((x, i) => [i + 1, x.k, x.reel, nf(x.plays), L.looksGeneric(x.k) ? 'si' : 'no'])));
console.log('\nLuoghi con >=1 reel per plays; quota dei luoghi che fa meta dei plays: ', (() => { let acc = 0, n = 0; for (const x of sorted) { acc += x.plays; n++; if (acc >= TOT / 2) break; } return n + ' luoghi (su ' + withReel.length + ') fanno il 50% dei plays'; })());
// effetto eta': mediana per anno di pubblicazione (reel)
const yrs = [...new Set(reels.map(yearOf))].sort();
console.log('\n' + table(['Anno pubblicazione', 'reel', 'mediana plays', 'p90', 'max'], yrs.map((y) => { const a = reels.filter((p) => yearOf(p) === y).map((p) => p.plays); return [y, a.length, nf(median(a)), nf(q(a, 0.9)), nf(Math.max(...a))]; })));
console.log('\nPlays deny-list (post esplicito + manuale):', nf(sum(L.corpus.filter(L.denied).map((p) => p.plays || 0))), 'su', nf(TOT));
```

</details>

## 5. Prezzi nelle caption

Corpus usabile (1.281 post). Importo esplicito = numero con `€` o `euro`; scartati importi in
contesto di sconto, codice, tasse, cauzione, mancia, e il "prima" di «invece di». Importi
arrotondati all'euro. I post con 💰 seguito da una cifra sulla stessa riga sono 1 e sono già
contati (di solito la caption scrive «💰 Prezzi:» e va a capo).

- Post con 💰 seguito da una cifra sulla stessa riga: 1 | di cui senza importo in euro riconosciuto: 0 | post con € o "euro" grezzi (prima delle esclusioni): 244
- Post (senza deny-list): 1281 | con prezzo esplicito (importo in euro o 💰+cifra): 243 (19,0%) | solo con importo in euro: 243
- Per tipo: {"reel":243} | reel con prezzo su totale reel usabili: 20,4%
- Luoghi (nome) con >=1 post con prezzo: 176 | non generici: 130 | su luoghi non generici con reel: 467
- Reel con prezzo, con coordinate, NON in registro, luogo non generico: 132 reel su 119 luoghi

| Unita (contesto entro ~45 caratteri) | importi | min € | p25 | mediana | p75 | max € |
| --- | --- | --- | --- | --- | --- | --- |
| a notte | 17 | 25 | 85 | 140 | 190 | 250 |
| a persona | 47 | 9 | 17 | 30 | 58 | 1.600 |
| a piatto | 0 | - | - | - | - | - |
| ingresso/biglietto | 59 | 2 | 12 | 18 | 39 | 86 |
| pasto/menu | 77 | 3 | 20 | 28 | 36 | 360 |
| altro | 166 | 3 | 12 | 25 | 60 | 2.700 |

| Anno | post | con prezzo | quota |
| --- | --- | --- | --- |
| 2021 | 97 | 0 | 0,0% |
| 2022 | 276 | 10 | 3,6% |
| 2023 | 274 | 69 | 25,2% |
| 2024 | 250 | 74 | 29,6% |
| 2025 | 244 | 58 | 23,8% |
| 2026 | 140 | 32 | 22,9% |

- Importi per post con prezzo (mediana): 1 | max: 8

**Lettura.** 243 post (tutti reel) hanno un prezzo esplicito: il 19,0% dei post e il 20,4%
dei reel. Il fenomeno è recente: 0 nel 2021, 3,6% nel 2022, poi tra 22,9% e 29,6% ogni anno
dal 2023. Toccano 176 luoghi (130 non generici, su 467 locali con reel). Tra i luoghi nuovi
utilizzabili: 132 reel con prezzo, con coordinate, non in registro e non generici, su 119
luoghi. Per unità (contesto entro ~45 caratteri): a notte n=17, mediana 140 €; a persona n=47,
mediana 30 €; ingresso/biglietto n=59, mediana 18 €; pasto/menu n=77, mediana 28 €. **«A
piatto»: 0 importi espliciti** (il cibo è quasi sempre «da X€» o menu a prezzo fisso). I
massimi di 1.600 € e 2.700 € sono costi di viaggio interi, non prezzi di un locale.
Limite: le classi per unità sono euristiche. Su 24 importi grezzi letti a mano (seme fisso),
21 erano il prezzo di un biglietto, menu o notte e 3 no (due voci di spesa raccolte da una
guida di viaggio, un abbonamento mensile); l'accuratezza della classe non è stata misurata.

<details><summary>Script s05.js</summary>

```js
const L = require('./fp-lib.js');
const { usable, table, nf, median, q, sum, placeName, hasCoords, isAdmin } = L;
// Importo esplicito: "12€", "€12", "12 €", "12 euro", "1.250€", "17,90€". Escluso: contesto di sconto/tasse/cauzione e il "prima" di "invece di".
const N = '(\\d{1,3}(?:\\.\\d{3})+(?:,\\d{1,2})?|\\d{1,4}(?:[.,]\\d{1,2})?)';
const AMT = new RegExp('(?:€\\s?' + N + ')|(?:' + N + '\\s?(?:€|euro\\b))', 'gi');
const toNum = (raw) => (/^\d{1,3}(\.\d{3})+(,\d{1,2})?$/.test(raw) ? +raw.replace(/\./g, '').replace(',', '.') : +raw.replace(',', '.'));
const EXCL = /sconto|codice|coupon|risparmi|cashback|rimbors|tasse|tassa|cauzione|caparra|deposito|vinci|premio|omagg|regalo|di mancia|montepremi|invece di|anziche|al posto di|gratis/i;
const CLASSES = ['a notte', 'a persona', 'a piatto', 'ingresso/biglietto', 'pasto/menu', 'altro'];
function classify(after, around) {
  if (/^\s*(a|per|\/)\s?(notte|camera)|^\s*(a|per)\s+(coppia)?\s*notte/i.test(after)) return 'a notte';
  if (/^\s*(a|per)\s+(persona|testa|adulto|cranio)|^\s*p\.?\s?p\b|^\s*(cad|ciascuno)/i.test(after)) return 'a persona';
  if (/^\s*(a|per)\s+(piatto|porzione|portata)|(ogni|il|un)\s+piatto/i.test(after)) return 'a piatto';
  if (/biglietto|ingresso|ticket|entrata/i.test(around)) return 'ingresso/biglietto';
  if (/pranzo|cena|men[uù]|all you can|ayce|formula|degustazione|colazione|aperitivo/i.test(around)) return 'pasto/menu';
  return 'altro';
}
const hits = [];
for (const p of usable) {
  const c = p.caption; let m; AMT.lastIndex = 0;
  const amounts = [];
  while ((m = AMT.exec(c))) {
    const i = m.index, ctx = c.slice(Math.max(0, i - 45), i + m[0].length + 45);
    const before = c.slice(Math.max(0, i - 25), i);
    if (EXCL.test(ctx.replace(/\n/g, ' ')) && !/prezz|cost|biglietto|ingresso|a notte|a persona/i.test(before + c.slice(i, i + 30))) continue;
    if (EXCL.test(before) ) continue;
    const num = toNum(m[1] || m[2]);
    if (!(num > 0 && num < 5000)) continue;
    const after = c.slice(i + m[0].length, i + m[0].length + 30);
    amounts.push({ v: num, cls: classify(after, ctx) });
  }
  const gold = /💰\s*[^\n]{0,15}\d/.test(c);
  if (amounts.length || gold) hits.push({ p, amounts, gold });
}
const posts = hits.length, withAmt = hits.filter((h) => h.amounts.length).length;
console.log('Post con 💰 seguito da una cifra sulla stessa riga:', hits.filter((h) => h.gold).length, '| di cui senza importo in euro riconosciuto:', hits.filter((h) => h.gold && !h.amounts.length).length, '| post con € o "euro" grezzi (prima delle esclusioni):', usable.filter((p) => /€|\beuro\b/i.test(p.caption)).length);
console.log('Post (senza deny-list):', usable.length, '| con prezzo esplicito (importo in euro o 💰+cifra):', posts, '(' + L.pct(posts, usable.length) + ')', '| solo con importo in euro:', withAmt);
console.log('Per tipo:', JSON.stringify(L.tally(hits, (h) => h.p.tipo)), '| reel con prezzo su totale reel usabili:', L.pct(hits.filter((h) => h.p.tipo === 'reel').length, usable.filter((p) => p.tipo === 'reel').length));
const placeSet = new Set(hits.filter((h) => hasCoords(h.p)).map((h) => placeName(h.p)));
const placeSetNA = [...placeSet].filter((n) => !L.looksGeneric(n));
console.log('Luoghi (nome) con >=1 post con prezzo:', placeSet.size, '| non generici:', placeSetNA.length, '| su luoghi non generici con reel:', Object.entries(L.places).filter(([k, v]) => v.reel > 0 && !L.looksGeneric(k) && !L.deniedName(k)).length);
const notReg = hits.filter((h) => h.p.tipo === 'reel' && !h.p.inRegistro && hasCoords(h.p) && !L.looksGeneric(placeName(h.p)));
console.log('Reel con prezzo, con coordinate, NON in registro, luogo non generico:', notReg.length, 'reel su', new Set(notReg.map((h) => placeName(h.p))).size, 'luoghi');
const rows = CLASSES.map((c) => { const v = hits.flatMap((h) => h.amounts.filter((a) => a.cls === c).map((a) => a.v)); return [c, v.length, v.length ? nf(Math.min(...v)) : '-', v.length ? nf(q(v, 0.25)) : '-', v.length ? nf(median(v)) : '-', v.length ? nf(q(v, 0.75)) : '-', v.length ? nf(Math.max(...v)) : '-']; });
console.log('\n' + table(['Unita (contesto entro ~45 caratteri)', 'importi', 'min €', 'p25', 'mediana', 'p75', 'max €'], rows));
// per anno
const yrs = [...new Set(usable.map(L.yearOf))].sort();
console.log('\n' + table(['Anno', 'post', 'con prezzo', 'quota'], yrs.map((y) => { const a = usable.filter((p) => L.yearOf(p) === y); const b = hits.filter((h) => L.yearOf(h.p) === y).length; return [y, a.length, b, L.pct(b, a.length)]; })));
// esempio di controllo: quanti importi per post
console.log('\nImporti per post con prezzo (mediana):', median(hits.filter((h) => h.amounts.length).map((h) => h.amounts.length)), '| max:', Math.max(...hits.map((h) => h.amounts.length)));
```

</details>

## 6. Collaborazioni

Corpus usabile. Tre insiemi: marcatori del brief (adv, «in collaborazione», «su invito»,
«ospiti di», #ad); marcatori estesi (etichette di apertura del corpus: Invited/Invito,
Affiliazione, Gifted/SuppliedBy); parola libera «collaborazion*», solo informativa.

| Marcatore | Insieme | post | di cui reel |
| --- | --- | --- | --- |
| adv (parola, anche #adv, *Adv) | brief | 129 | 129 |
| in collaborazione | brief | 8 | 8 |
| su invito | brief | 0 | 0 |
| ospiti di | brief | 0 | 0 |
| #ad (esatto) | brief | 3 | 3 |
| apertura Invited/Invito/InvitedBy | esteso | 33 | 33 |
| apertura Affiliazione | esteso | 8 | 8 |
| apertura Gifted/SuppliedBy | esteso | 2 | 2 |
| "collaborazione" (parola libera) | solo informativo | 48 | 48 |

- MARCATORI DEL BRIEF: post totali con marcatore 139 | reel 139 | luoghi (nome) con >=1 reel marcato: 96 (non generici: 67)

| Gruppo (reel) | n | plays mediana | p25 | p75 | p90 |
| --- | --- | --- | --- | --- | --- |
| con marcatore | 139 | 35.718 | 24.630 | 126.453 | 447.028 |
| senza marcatore | 1051 | 42.746 | 26.658 | 130.533 | 423.964 |

- Solo dal 2023: con 136 mediana 36.784 | senza 758 mediana 41.713
- Reel marcati per anno: {"2022":3,"2023":24,"2024":46,"2025":34,"2026":32}

- BRIEF + ESTESI (apertura): post totali con marcatore 182 | reel 182 | luoghi (nome) con >=1 reel marcato: 125 (non generici: 92)

| Gruppo (reel) | n | plays mediana | p25 | p75 | p90 |
| --- | --- | --- | --- | --- | --- |
| con marcatore | 182 | 37.603 | 24.601 | 98.514 | 296.381 |
| senza marcatore | 1008 | 42.846 | 26.670 | 135.152 | 436.435 |

- Solo dal 2023: con 179 mediana 37.850 | senza 715 mediana 41.715
- Reel marcati per anno: {"2022":3,"2023":24,"2024":46,"2025":34,"2026":75}

- classe del corpus "adv-prodotto": 19 post | tra questi con marcatore brief+esteso: 4
- Registro (86 schede con reel nel corpus): partnership.kind x marcatore rilevato: {"organic|nessun marcatore":44,"invited|marcatore":16,"adv|marcatore":11,"adv|nessun marcatore":1,"invited|nessun marcatore":2,"collaboration|nessun marcatore":2,"affiliate|marcatore":1,"collaboration|marcatore":2,"organic|marcatore":7}

- Per anno: marcatore "adv" -> {"2022":2,"2023":22,"2024":46,"2025":33,"2026":26} | aperture Invited/Invito -> {"2026":33} | Affiliazione -> {"2026":8}
- Bootstrap differenza mediane (con - senza), reel dal 2023: stima -3.865 | IC95% [-9.980, 564] | n con 179 n senza 715

**Lettura.** Con i marcatori del brief: 139 reel marcati, su 96 luoghi (67 non generici).
Con gli estesi: 182 reel (15,3% dei 1.190), su 125 luoghi. «su invito» e «ospiti di» non
compaiono mai. La **dicitura cambia nel tempo**: «Adv» è la forma 2022-2026; «Invited/Invito»
(33 reel) e «Affiliazione» (8) esistono solo nel 2026. Plays mediani: 35.718 con marcatore
(brief) contro 42.746 senza; ma "senza marcatore" prima del 2023 include collaborazioni non
dichiarate (0 marcati nel 2021, 3 nel 2022). Dal 2023: 36.784 contro 41.713 (brief); con gli
estesi la differenza di mediane è −3.865 con IC95% bootstrap [−9.980, +564] (n = 179 e 715):
**non distinguibile da zero**. Il campo `partnership.kind` del registro e i marcatori nel
testo discordano su 12 delle 86 schede con reel (14%): 7 dichiarate `organic` ma con
marcatore nel testo; 5 dichiarate `adv` (1), `invited` (2) o `collaboration` (2) ma senza
marcatore.

<details><summary>Script s06.js</summary>

```js
const L = require('./fp-lib.js');
const { usable, reels, table, nf, median, q, sum, placeName, hasCoords, seed } = L;
const head = (p) => p.caption.replace(/^[^\p{L}#*]+/u, '').slice(0, 24); // apertura senza emoji/frecce
const M = {
  'adv (parola, anche #adv, *Adv)': (p) => /(^|[^\p{L}\p{N}_])adv([^\p{L}\p{N}_]|$)/iu.test(p.caption),
  'in collaborazione': (p) => /in collaborazione/i.test(p.caption),
  'su invito': (p) => /su invito/i.test(p.caption),
  'ospiti di': (p) => /ospiti di/i.test(p.caption),
  '#ad (esatto)': (p) => /#ad(?![\p{L}\p{N}_])/iu.test(p.caption),
  // marcatori estesi: etichette di apertura presenti nel corpus
  'apertura Invited/Invito/InvitedBy': (p) => /^(invited|invito|invitedby)/i.test(head(p)),
  'apertura Affiliazione': (p) => /^affiliazione/i.test(head(p)),
  'apertura Gifted/SuppliedBy': (p) => /^(gifted|supplied ?by)/i.test(head(p)),
  '"collaborazione" (parola libera)': (p) => /collaborazion/i.test(p.caption),
};
const BRIEF = ['adv (parola, anche #adv, *Adv)', 'in collaborazione', 'su invito', 'ospiti di', '#ad (esatto)'];
const EXT = ['apertura Invited/Invito/InvitedBy', 'apertura Affiliazione', 'apertura Gifted/SuppliedBy'];
const rows = Object.entries(M).map(([k, f]) => [k, BRIEF.includes(k) ? 'brief' : EXT.includes(k) ? 'esteso' : 'solo informativo', usable.filter(f).length, usable.filter((p) => p.tipo === 'reel' && f(p)).length]);
console.log(table(['Marcatore', 'Insieme', 'post', 'di cui reel'], rows));
const any = (keys) => (p) => keys.some((k) => M[k](p));
for (const [lab, f] of [['MARCATORI DEL BRIEF', any(BRIEF)], ['BRIEF + ESTESI (apertura)', any([...BRIEF, ...EXT])]]) {
  const withM = reels.filter((p) => !L.denied(p) && f(p)), without = reels.filter((p) => !L.denied(p) && !f(p));
  const pl = (a) => a.map((p) => p.plays);
  const placesM = new Set(withM.filter(hasCoords).map(placeName));
  const placesNG = [...placesM].filter((n) => !L.looksGeneric(n));
  console.log('\n' + lab + ': post totali con marcatore', usable.filter(f).length, '| reel', withM.length, '| luoghi (nome) con >=1 reel marcato:', placesM.size, '(non generici:', placesNG.length + ')');
  console.log(table(['Gruppo (reel)', 'n', 'plays mediana', 'p25', 'p75', 'p90'], [
    ['con marcatore', withM.length, nf(median(pl(withM))), nf(q(pl(withM), .25)), nf(q(pl(withM), .75)), nf(q(pl(withM), .9))],
    ['senza marcatore', without.length, nf(median(pl(without))), nf(q(pl(without), .25)), nf(q(pl(without), .75)), nf(q(pl(without), .9))],
  ]));
  // stessa cosa dal 2023 (l'etichettatura prima e' rara)
  const w23 = withM.filter((p) => L.yearOf(p) >= 2023), o23 = without.filter((p) => L.yearOf(p) >= 2023);
  console.log('Solo dal 2023: con', w23.length, 'mediana', nf(median(pl(w23))), '| senza', o23.length, 'mediana', nf(median(pl(o23))));
  const y = {}; withM.forEach((p) => { y[L.yearOf(p)] = (y[L.yearOf(p)] || 0) + 1; }); console.log('Reel marcati per anno:', JSON.stringify(y));
}
// incrocio con classe corpus e con partnership del registro
const f = any([...BRIEF, ...EXT]);
console.log('\nclasse del corpus "adv-prodotto":', usable.filter((p) => p.classe === 'adv-prodotto').length, 'post | tra questi con marcatore brief+esteso:', usable.filter((p) => p.classe === 'adv-prodotto' && f(p)).length);
const byCode = new Map(L.corpus.map((p) => [p.code, p]));
const codeOf = (s) => { const m = (s.permalink || '').match(/\/(?:reel|p)\/([A-Za-z0-9_-]+)/); return m ? m[1] : null; };
const x = {}; seed.forEach((s) => { const p = byCode.get(codeOf(s)); if (!p) return; const k = s.partnership.kind + '|' + (f(p) ? 'marcatore' : 'nessun marcatore'); x[k] = (x[k] || 0) + 1; });
console.log('Registro (86 schede con reel nel corpus): partnership.kind x marcatore rilevato:', JSON.stringify(x));

// Convenzione di etichetta per anno (post con marcatore brief vs esteso)
const yy = (f2) => { const o = {}; usable.filter((p) => p.tipo === 'reel' && f2(p)).forEach((p) => { o[L.yearOf(p)] = (o[L.yearOf(p)] || 0) + 1; }); return JSON.stringify(o); };
console.log('\nPer anno: marcatore "adv" ->', yy(M['adv (parola, anche #adv, *Adv)']), '| aperture Invited/Invito ->', yy(M['apertura Invited/Invito/InvitedBy']), '| Affiliazione ->', yy(M['apertura Affiliazione']));
// Bootstrap (seed fisso, 4000 ricampionamenti) della differenza di mediane, reel dal 2023, marcatori brief+esteso
let s = 12345; const rnd = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
const A = reels.filter((p) => !L.denied(p) && L.yearOf(p) >= 2023 && f(p)).map((p) => p.plays), B = reels.filter((p) => !L.denied(p) && L.yearOf(p) >= 2023 && !f(p)).map((p) => p.plays);
const res = (a) => Array.from({ length: a.length }, () => a[Math.floor(rnd() * a.length)]);
const diffs = Array.from({ length: 4000 }, () => median(res(A)) - median(res(B))).sort((x, y) => x - y);
console.log('Bootstrap differenza mediane (con - senza), reel dal 2023: stima', nf(median(A) - median(B)), '| IC95% [' + nf(diffs[100]) + ', ' + nf(diffs[3899]) + '] | n con', A.length, 'n senza', B.length);
```

</details>

## 7. Geografia: regioni italiane e paesi

Base: luoghi (nome) con ≥1 reel, deny-list esclusa. "Locali" = non generici.

- Luoghi con >=1 reel, senza deny-list: 595 | locali (non generici): 467 | generici: 128
- Tutti i 624 luoghi di corpus-places.json (anche reel=0, anche deny-list) per paese, primi 8: Italia 463 ; Spagna 31 ; Regno Unito 17 ; Emirati Arabi Uniti 15 ; Francia 11 ; Egitto 10 ; Germania 9 ; Malesia 8 | paesi totali: 27 | amministrativi: 120

| Paese | luoghi | locali | reel | plays |
| --- | --- | --- | --- | --- |
| Italia | 440 | 342 | 782 | 148.319.824 |
| Spagna | 29 | 24 | 51 | 9.607.248 |
| Regno Unito | 17 | 16 | 25 | 1.927.024 |
| Germania | 9 | 8 | 18 | 5.388.738 |
| Malesia | 8 | 7 | 15 | 3.937.645 |
| Egitto | 8 | 6 | 14 | 1.790.913 |
| Emirati Arabi Uniti | 14 | 12 | 14 | 1.006.142 |
| Francia | 11 | 8 | 11 | 2.382.715 |
| Svizzera | 7 | 6 | 11 | 2.169.415 |
| Cina | 5 | 2 | 10 | 798.363 |
| Paesi Bassi | 6 | 4 | 10 | 564.330 |
| Repubblica Ceca | 5 | 3 | 6 | 279.279 |
| Ungheria | 5 | 4 | 6 | 201.270 |
| Slovenia | 4 | 4 | 5 | 2.230.250 |
| Repubblica Dominicana | 4 | 3 | 5 | 593.333 |
| Mauritius | 2 | 1 | 5 | 148.466 |
| Messico | 3 | 2 | 4 | 170.431 |
| Danimarca | 4 | 3 | 4 | 1.336.545 |
| Irlanda | 3 | 2 | 4 | 191.454 |
| Belgio | 2 | 2 | 3 | 99.135 |
| Svezia | 1 | 1 | 3 | 954.362 |
| Maldive | 1 | 1 | 3 | 1.089.697 |
| Stati Uniti d'America | 2 | 1 | 2 | 390.029 |
| (non risolto) | 2 | 2 | 2 | 122.862 |
| Brasile | 1 | 1 | 1 | 55.954 |
| Repubblica Democratica del Congo | 1 | 1 | 1 | 17.708 |
| Marocco | 1 | 1 | 1 | 291.267 |

- Paesi con almeno un reel: 26

| Regione | luoghi | locali | reel |
| --- | --- | --- | --- |
| Lombardia | 159 | 123 | 281 |
| Veneto | 71 | 60 | 117 |
| Umbria | 4 | 3 | 93 |
| Emilia-Romagna | 48 | 37 | 72 |
| Toscana | 41 | 31 | 67 |
| Piemonte | 36 | 27 | 55 |
| Lazio | 37 | 32 | 44 |
| Campania | 17 | 11 | 20 |
| Trentino-Alto Adige | 13 | 9 | 16 |
| Liguria | 5 | 3 | 6 |
| Calabria | 4 | 3 | 5 |
| Abruzzo | 3 | 1 | 4 |
| Sicilia | 1 | 1 | 1 |
| Valle d'Aosta | 1 | 1 | 1 |
| Basilicata | 0 | 0 | 0 |
| Friuli-Venezia Giulia | 0 | 0 | 0 |
| Marche | 0 | 0 | 0 |
| Molise | 0 | 0 | 0 |
| Puglia | 0 | 0 | 0 |
| Sardegna | 0 | 0 | 0 |

- Regioni non presenti nell'elenco delle 20: nessuna
- Regioni italiane a ZERO luoghi con reel: Basilicata, Friuli-Venezia Giulia, Marche, Molise, Puglia, Sardegna
- Regioni a zero LOCALI (solo etichette generiche o nulla): Basilicata, Friuli-Venezia Giulia, Marche, Molise, Puglia, Sardegna
- Regioni con 1-2 locali: Abruzzo=1, Sicilia=1, Valle d'Aosta=1
- Quota dei locali italiani nelle 8 regioni del Nord (definizione: Lombardia, Veneto, E-R, Piemonte, Trentino-AA, Liguria, VdA, FVG): 76,0% (260 su 342)
- Luoghi con paese non risolto: 2 | con regione nulla in Italia: 0

- Controllo etichette-con-paese: 51 etichette nominano un paese, 10 risolvono a un paese diverso (19,6%)

- Menzioni in caption (post / di cui reel): Sardegna 1/1 ; Marche 1/1 ; Friuli-Venezia Giulia 4/4 ; Molise 0/0 ; Basilicata 1/0 ; Puglia 3/0
- Luoghi in Puglia/Basilicata presenti in corpus-places.json ma solo con caroselli (reel=0): 3

**Lettura.** 26 paesi con almeno un reel. L'Italia ha 440 luoghi, 342 locali e 782 reel. Le
otto regioni del Nord (Lombardia, Veneto, Emilia-Romagna, Piemonte, Trentino-Alto Adige,
Liguria, Valle d'Aosta, Friuli-Venezia Giulia) contengono il 76,0% dei locali italiani (260
su 342); Lombardia 123 e Veneto 60 da sole ne valgono 183. **Regioni a zero reel:
Basilicata, Friuli-Venezia Giulia, Marche, Molise, Puglia, Sardegna.** Regioni con un solo
locale: Abruzzo, Sicilia, Valle d'Aosta. Le menzioni in caption dei nomi delle regioni a zero
sono pochissime (Sardegna 1, Marche 1, Friuli 4, Molise 0, Basilicata 1, Puglia 3; menzione
non vuol dire girato): il vuoto non è solo di geotag.

**Limite di qualità (importante).** Nel controllo, 10 etichette su 51 che nominano un paese
risolvono in un paese diverso (19,6%): i geotag sono pagine-luogo create dagli utenti, con
coordinate a volte sbagliate. Effetto visibile: la riga «Umbria» conta 93 reel ma solo 3
locali, perché l'etichetta «Italia» (89 reel) cade in Umbria. Le colonne "locali" sono
affidabili per l'ordine di grandezza, non per il singolo numero.

<details><summary>Script s07.js</summary>

```js
const L = require('./fp-lib.js');
const { places, table, nf, sum } = L;
// Base: luoghi (nome) di corpus-places.json con >=1 reel, deny-list esclusa. "locali" = non generici (flag + varianti-citta').
const P = Object.entries(places).map(([k, v]) => ({ k, ...v, gen: L.looksGeneric(k) })).filter((x) => x.reel > 0 && !L.deniedName(x.k));
console.log('Luoghi con >=1 reel, senza deny-list:', P.length, '| locali (non generici):', P.filter((x) => !x.gen).length, '| generici:', P.filter((x) => x.gen).length);
const agg = (key) => { const m = {}; P.forEach((x) => { const k = x[key] || '(non risolto)'; const o = m[k] || (m[k] = { luoghi: 0, locali: 0, reel: 0, plays: 0 }); o.luoghi++; if (!x.gen) o.locali++; o.reel += x.reel; o.plays += x.plays; }); return m; };
const allC = {}; Object.values(places).forEach((v) => { const k = v.paese || '(non risolto)'; allC[k] = (allC[k] || 0) + 1; });
console.log('Tutti i', Object.keys(places).length, 'luoghi di corpus-places.json (anche reel=0, anche deny-list) per paese, primi 8:', Object.entries(allC).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, n]) => k + ' ' + n).join(' ; '), '| paesi totali:', Object.keys(allC).filter((k) => k !== '(non risolto)').length, '| amministrativi:', Object.values(places).filter((v) => v.amministrativo).length);
const c = agg('paese');
console.log('\n' + table(['Paese', 'luoghi', 'locali', 'reel', 'plays'], Object.entries(c).sort((a, b) => b[1].reel - a[1].reel).map(([k, o]) => [k, o.luoghi, o.locali, o.reel, nf(o.plays)])));
console.log('Paesi con almeno un reel:', Object.keys(c).filter((k) => k !== '(non risolto)').length);
const REGIONI = ["Abruzzo", "Basilicata", "Calabria", "Campania", "Emilia-Romagna", "Friuli-Venezia Giulia", "Lazio", "Liguria", "Lombardia", "Marche", "Molise", "Piemonte", "Puglia", "Sardegna", "Sicilia", "Toscana", "Trentino-Alto Adige", "Umbria", "Valle d'Aosta", "Veneto"];
const IT = {}; P.filter((x) => x.paese === 'Italia').forEach((x) => { const k = x.regione || '(non risolta)'; const o = IT[k] || (IT[k] = { luoghi: 0, locali: 0, reel: 0 }); o.luoghi++; if (!x.gen) o.locali++; o.reel += x.reel; });
console.log('\n' + table(['Regione', 'luoghi', 'locali', 'reel'], REGIONI.map((r) => [r, IT[r] ? IT[r].luoghi : 0, IT[r] ? IT[r].locali : 0, IT[r] ? IT[r].reel : 0]).sort((a, b) => b[3] - a[3])));
console.log('Regioni non presenti nell\'elenco delle 20:', Object.keys(IT).filter((k) => !REGIONI.includes(k)).join(', ') || 'nessuna');
console.log('Regioni italiane a ZERO luoghi con reel:', REGIONI.filter((r) => !IT[r]).join(', ') || 'nessuna');
console.log('Regioni a zero LOCALI (solo etichette generiche o nulla):', REGIONI.filter((r) => !IT[r] || IT[r].locali === 0).join(', '));
console.log('Regioni con 1-2 locali:', REGIONI.filter((r) => IT[r] && IT[r].locali >= 1 && IT[r].locali <= 2).map((r) => r + '=' + IT[r].locali).join(', '));
const nord = ['Lombardia', 'Veneto', 'Emilia-Romagna', 'Piemonte', 'Trentino-Alto Adige', 'Liguria', "Valle d'Aosta", 'Friuli-Venezia Giulia'];
const tI = sum(Object.values(IT).map((o) => o.locali));
console.log('Quota dei locali italiani nelle 8 regioni del Nord (definizione: Lombardia, Veneto, E-R, Piemonte, Trentino-AA, Liguria, VdA, FVG):', pctOf(sum(nord.map((r) => (IT[r] ? IT[r].locali : 0))), tI), '(' + sum(nord.map((r) => (IT[r] ? IT[r].locali : 0))) + ' su ' + tI + ')');
function pctOf(a, b) { return L.pct(a, b); }
console.log('Luoghi con paese non risolto:', P.filter((x) => !x.paese).length, '| con regione nulla in Italia:', P.filter((x) => x.paese === 'Italia' && !x.regione).length);
// Controllo di qualita': etichette che nominano un paese e paese risolto diverso
const HINT = [[/\b(italy|italia)\b/i, 'Italia'], [/\b(spain|spagna|espana|españa)\b/i, 'Spagna'], [/\b(france|francia)\b/i, 'Francia'], [/\b(germany)\b/i, 'Germania'], [/\b(egypt|egitto)\b/i, 'Egitto'], [/\b(czech|ceca)\b/i, 'Repubblica Ceca'], [/\b(england|inghilterra)\b/i, 'Regno Unito'], [/\bchina\b/i, 'Cina'], [/\b(uae)\b/i, 'Emirati Arabi Uniti'], [/\bmalaysia\b/i, 'Malesia']];
let named = 0, wrong = 0;
Object.entries(places).forEach(([k, v]) => { const h = HINT.find(([re]) => re.test(k)); if (h) { named++; if (v.paese !== h[1]) wrong++; } });
console.log('\nControllo etichette-con-paese: ' + named + ' etichette nominano un paese, ' + wrong + ' risolvono a un paese diverso (' + L.pct(wrong, named) + ')');

// Menzioni in caption delle regioni a zero (menzione != girato: solo per capire se il vuoto e' di geotag o di contenuto)
const R = { Sardegna: /\b(Sardegna|Sardinia|Cagliari|Alghero)\b/, Marche: /\b(nelle Marche|le Marche|in Marche|Ancona|Urbino|Conero)\b/, 'Friuli-Venezia Giulia': /\b(Friuli|Trieste|Udine|Pordenone)\b/, Molise: /\b(Molise|Campobasso)\b/, Basilicata: /\b(Basilicata|Matera)\b/, Puglia: /\b(Puglia|Salento|Alberobello|Polignano|Lecce|Bari)\b/ };
console.log('\nMenzioni in caption (post / di cui reel):', Object.entries(R).map(([k, re]) => { const m = L.usable.filter((p) => re.test(p.caption)); return k + ' ' + m.length + '/' + m.filter((p) => p.tipo === 'reel').length; }).join(' ; '));
console.log('Luoghi in Puglia/Basilicata presenti in corpus-places.json ma solo con caroselli (reel=0):', Object.values(places).filter((v) => ['Puglia', 'Basilicata'].includes(v.regione) && v.reel === 0).length);
```

</details>

## 8. Stagionalità

Reel con coordinate, deny-list esclusa; mese = mese di **pubblicazione**.

- Reel con coordinate: 1016 | su luoghi locali (non generici): 593

| Mese | reel (tutti) | reel su luoghi locali | luoghi locali distinti | di cui con >=1 reel non ancora in registro |
| --- | --- | --- | --- | --- |
| gen | 91 | 49 | 46 | 42 |
| feb | 83 | 41 | 40 | 36 |
| mar | 91 | 53 | 49 | 47 |
| apr | 92 | 53 | 48 | 46 |
| mag | 94 | 50 | 49 | 43 |
| giu | 83 | 47 | 45 | 40 |
| lug | 86 | 50 | 43 | 31 |
| ago | 59 | 31 | 31 | 29 |
| set | 79 | 49 | 46 | 41 |
| ott | 85 | 63 | 53 | 48 |
| nov | 82 | 54 | 54 | 50 |
| dic | 91 | 53 | 49 | 46 |

- Luoghi locali distinti nell'intero anno: 467 | somma dei mesi: 553 (differenza = luoghi con reel in mesi diversi)
- Mese con meno luoghi locali: ago 31 | con piu: nov 54

| Regione (locali) | reel | mesi coperti /12 | mesi (pubblicazione) |
| --- | --- | --- | --- |
| Lombardia | 150 | 12 | gen feb mar apr mag giu lug ago set ott nov dic |
| Veneto | 87 | 12 | gen feb mar apr mag giu lug ago set ott nov dic |
| Emilia-Romagna | 47 | 10 | gen . mar apr mag giu lug . set ott nov dic |
| Toscana | 41 | 11 | gen feb mar apr mag . lug ago set ott nov dic |
| Lazio | 36 | 8 | gen feb . apr mag . . ago set ott . dic |
| Piemonte | 34 | 11 | gen feb mar apr mag giu lug . set ott nov dic |
| Trentino-Alto Adige | 12 | 5 | . . mar apr . . . . set . nov dic |
| Campania | 11 | 6 | . feb . . mag . . ago set . nov dic |
| Calabria | 4 | 3 | . . . . mag giu lug . . . . . |
| Umbria | 4 | 4 | . feb mar . . . . ago . . nov . |
| Liguria | 4 | 4 | gen feb . . . . . . . . nov dic |
| Sicilia | 1 | 1 | . . . . . giu . . . . . . |
| Valle d'Aosta | 1 | 1 | gen . . . . . . . . . . . |
| Abruzzo | 1 | 1 | . . . . . . . . . . nov . |

- Schede visibili (79) per mese di pubblicazione del reel collegato: gen=3 feb=5 mar=2 apr=4 mag=8 giu=11 lug=19 ago=5 set=6 ott=8 nov=4 dic=4 | totale 79
- Anni distinti con reel su luogo locale, per mese: gen=5 feb=5 mar=5 apr=5 mag=5 giu=5 lug=5 ago=5 set=4 ott=4 nov=5 dic=5

**Lettura.** Ogni mese dell'anno ha luoghi locali distinti: da 31 (agosto, il minimo) a 54
(novembre); febbraio (40) e luglio (43) sono i due mesi più bassi dopo agosto. La somma
mensile (553) supera di 86 i 467 luoghi locali distinti: sono presenze dello stesso luogo in
mesi diversi. Dieci mesi su dodici hanno reel su luoghi locali in 5 anni diversi; settembre e
ottobre in 4. Per regione, solo Lombardia e Veneto coprono tutti e 12 i mesi; Toscana 11,
Piemonte 11, Emilia-Romagna 10, Lazio 8, Campania 6, Trentino-Alto Adige 5; le altre regioni
hanno da 1 a 4 mesi. Le 79 schede visibili sono sbilanciate su luglio (19 su 79, contro 2-11
negli altri mesi).

<details><summary>Script s08.js</summary>

```js
const L = require('./fp-lib.js');
const { reels, places, placeName, monthOf, table, tally, seed } = L;
const MESI = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];
// Base: reel con coordinate, deny-list esclusa; mese = mese di PUBBLICAZIONE (Europe/Rome). "locali" = luogo non generico.
const R = reels.filter((p) => L.hasCoords(p) && !L.denied(p));
const loc = R.filter((p) => !L.looksGeneric(placeName(p)));
console.log('Reel con coordinate:', R.length, '| su luoghi locali (non generici):', loc.length);
// A) per calendario: luoghi distinti per mese dell'anno (tutti gli anni insieme)
const rowsA = MESI.map((m, i) => { const a = loc.filter((p) => monthOf(p) === i + 1); const all = R.filter((p) => monthOf(p) === i + 1); return [m, all.length, a.length, new Set(a.map(placeName)).size, new Set(a.filter((p) => !p.inRegistro).map(placeName)).size]; });
console.log('\n' + table(['Mese', 'reel (tutti)', 'reel su luoghi locali', 'luoghi locali distinti', 'di cui con >=1 reel non ancora in registro'], rowsA));
const distinctAll = new Set(loc.map(placeName)).size;
console.log('Luoghi locali distinti nell\'intero anno:', distinctAll, '| somma dei mesi:', rowsA.reduce((s, r) => s + r[3], 0), '(differenza = luoghi con reel in mesi diversi)');
const cover = rowsA.map((r) => r[3]);
console.log('Mese con meno luoghi locali:', MESI[cover.indexOf(Math.min(...cover))], Math.min(...cover), '| con piu:', MESI[cover.indexOf(Math.max(...cover))], Math.max(...cover));
// B) per regione italiana: mesi coperti da >=1 reel su luogo locale
const byReg = {};
loc.forEach((p) => { const v = places[placeName(p)]; if (!v || v.paese !== 'Italia' || !v.regione) return; (byReg[v.regione] = byReg[v.regione] || []).push(p); });
const rowsB = Object.entries(byReg).sort((a, b) => b[1].length - a[1].length).map(([r, ps]) => { const ms = new Set(ps.map(monthOf)); return [r, ps.length, ms.size, MESI.map((m, i) => (ms.has(i + 1) ? m : '.')).join(' ')]; });
console.log('\n' + table(['Regione (locali)', 'reel', 'mesi coperti /12', 'mesi (pubblicazione)'], rowsB));
// C) le 79 schede visibili: mese di pubblicazione del reel collegato
const byCode = new Map(L.corpus.map((p) => [p.code, p]));
const codeOf = (s) => { const m = (s.permalink || '').match(/\/(?:reel|p)\/([A-Za-z0-9_-]+)/); return m ? m[1] : null; };
const vis = seed.filter((s) => !s.isPlaceholder).map((s) => byCode.get(codeOf(s))).filter(Boolean);
const t = tally(vis, (p) => monthOf(p));
console.log('\nSchede visibili (79) per mese di pubblicazione del reel collegato:', MESI.map((m, i) => m + '=' + (t[i + 1] || 0)).join(' '), '| totale', vis.length);
// D) mesi coperti da anni diversi (stessa stagione ripetuta)
const yrs = {}; loc.forEach((p) => { const k = monthOf(p); (yrs[k] = yrs[k] || new Set()).add(L.yearOf(p)); });
console.log('Anni distinti con reel su luogo locale, per mese:', MESI.map((m, i) => m + '=' + (yrs[i + 1] ? yrs[i + 1].size : 0)).join(' '));
```

</details>

## 9. Lessico

Corpus usabile. Tolti: hashtag, menzioni, URL, emoji, e le righe-formula ricorrenti (link in
bio offuscato «L1nk in bi@ per super sc@nti…», «S@lva… scr1vic1», «PS. Vuoi unirti ai
Travellini», «Attiva la campanella… storie… contenuti inediti e sconti», «Taggaci nelle tue
storie», etichette di partnership isolate). Stopword italiane tolte. Conteggio = numero di
caption che contengono il termine (non le occorrenze).

- Caption con frasi in inglese (>=3 tra the/you/and/is/this/place/will/find/with): 130 su 1281
- Caption analizzate: 1281 (deny-list esclusa) | righe-formula rimosse: 2959 su 12141 righe

- TOP 60 PAROLE (n. di caption che le contengono):
- 1. posto 237 · 2. esperienza 219 · 3. locale 186 · 4. particolari 168 · 5. provare 168 · 6. piatti 167 · 7. piacerebbe 155 · 8. conoscevi 154 · 9. italia 152 · 10. ristorante 142 · 11. cocktail 140 · 12. posti 138 · 13. proveresti 133 · 14. assolutamente 132 · 15. tema 124 · 16. passare 113 · 17. provato 105 · 18. cena 104 · 19. mondo 104 · 20. milano 101 · 21. menù 100 · 22. ristoranti 100 · 23. città 96 · 24. serata 96 · 25. mangiare 95 · 26. prezzo 89 · 27. aperitivo 88 · 28. casa 86 · 29. cucina 86 · 30. vista 86 · 31. consigliamo 83 · 32. particolare 82 · 33. atmosfera 81 · 34. unica 80 · 35. food 78 · 36. direttamente 77 · 37. notte 77 · 38. parte 75 · 39. relax 75 · 40. vedere 75 · 41. vivere 75 · 42. viaggio 74 · 43. video 72 · 44. amici 71 · 45. parco 71 · 46. avrai 70 · 47. can 70 · 48. vera 69 · 49. colazione 68 · 50. locali 68 · 51. perdere 68 · 52. tantissimi 68 · 53. persona 67 · 54. partire 66 · 55. unico 66 · 56. vero 66 · 57. film 65 · 58. interno 65 · 59. natura 65 · 60. tempo 65

- TOP 60 BIGRAMMI (n. di caption):
- 1. can eat 37 · 2. harry potter 29 · 3. cocktail bar 28 · 4. posti particolari 28 · 5. piacerebbe provare 26 · 6. alloggi insoliti 25 · 7. devi assolutamente 22 · 8. esperienza unica 22 · 9. san valentino 22 · 10. vivere esperienza 22 · 11. piacerebbe passare 20 · 12. escape room 19 · 13. piatti tipici 19 · 14. this place 19 · 15. capito bene 18 · 16. menù degustazione 18 · 17. tagga qualcuno 18 · 18. facci sapere 16 · 19. milano food 16 · 20. minimi dettagli 16 · 21. tim burton 16 · 22. will find 16 · 23. belli italia 15 · 24. locale unico 15 · 25. posti simili 15 · 26. weekend romantico 15 · 27. atmosfera unica 14 · 28. farà sentire 14 · 29. locali particolari 14 · 30. piacerebbe andarci 14 · 31. bagno turco 13 · 32. cucina tipica 13 · 33. parco acquatico 13 · 34. perdere assolutamente 13 · 35. prodotti freschi 12 · 36. altissima qualità 11 · 37. bere cocktail 11 · 38. codice travellini 11 · 39. ever been 11 · 40. prodotti tipici 11 · 41. spa privata 11 · 42. sushi ayce 11 · 43. vista mozzafiato 11 · 44. vogliamo parlare 11 · 45. assolutamente provare 10 · 46. insoliti posti 10 · 47. migliori ristoranti 10 · 48. montagne russe 10 · 49. piatti particolari 10 · 50. provare esperienza 10 · 51. ristoranti preferiti 10 · 52. tappa obbligatoria 10 · 53. assolutamente perderti 9 · 54. borgo medievale 9 · 55. fuga romantica 9 · 56. genere esclusivi 9 · 57. know this 9 · 58. location unica 9 · 59. parola ordine 9 · 60. piacerebbe dormire 9

**Lettura.** Il lessico è quello del "posto particolare" e del format: posto, esperienza,
locale, particolari, piatti, ristorante, cocktail, tema, vista, atmosfera; bigrammi come
«posti particolari» (28), «alloggi insoliti» (25), «escape room» (19), «harry potter» (29),
«san valentino» (22), «esperienza unica» (22). Tra i primi termini stanno le formule di
coinvolgimento, non descrizioni: «piacerebbe», «provare», «conoscevi», «proveresti»
(133-168 caption ciascuna) e i bigrammi «piacerebbe provare», «tagga qualcuno», «facci
sapere». 130 caption su 1.281 contengono frasi in inglese. Le righe-formula rimosse sono
2.959 su 12.141.

<details><summary>Script s09.js</summary>

```js
const L = require('./fp-lib.js');
const { usable } = L;
// 1) Righe-formula da togliere: le CTA ricorrenti (link in bio offuscato, salva/scrivici, PS. community, ecc.)
const FORMULA = /l1nk|s@lva|scr1vic1|sc@nti|bi@|\bl[i1]nk in b|link in bio|^\s*p\.?\s?s+\b|leggi sotto|tagga un|seguici|community|gruppo telegram|codice sconto|iscriviti|salva questo|scrivici|campanella|taggaci|sconti esclusivi|pubblichiamo (li )?contenuti|non perderti le storie|unirti|far parte del gruppo|^\s*\*?\s*(adv|invited|invitedby|collab|suppliedby|gifted|affiliazione)\s*$/i;
const STOP = new Set(('a ad al allo alla alle agli ai all anche ancora avere avevo aveva avevamo abbiamo hanno ho ha avuto ci c che chi cui col come con contro cosa così cosi da dai dal dalla dalle dallo dagli dei del della delle dello degli di dove dopo due e ed è era ero eravamo essere fa fra gli ha già giusto i il in io la le lei li lo loro lui ma me mi mia mie miei mio molto molti molte più piu ne nei nel nella nelle nello negli né ni no noi non nostro nostra nostri nostre o oggi ogni ora per perché perchè poi può puoi puoi potrai potete potrete pure quando quanto quanta quanti quante quasi quel quella quelle quelli quello questa queste questi questo qui qual quale quali se sei sembra senza si sì siamo solo sono sopra sotto su sua sue suo suoi sul sulla sulle sullo sugli sui tra tre tu tua tue tuo tuoi tutto tutta tutti tutte un una uno vi vostro vostra voi vuoi volta è però cioè dentro fuori fino già ecco ogni altri altre altro altra stesso stessa poco pochi tanto tanti tanta tante dei dello ti te tè ve vale può perfetto perfetta abbiamo siamo stati stato stata state fatto fare fatta faremo fanno essere sia siate saranno sarà sarebbe sarai era eri erano stavo stiamo trovi trovare trovate troverai troverete prima dopo sempre mai già ormai proprio davvero veramente super ps pss the and of to in is for you it on at by hai adv invited invito suppliedby collab gifted affiliazione dell').split(/\s+/));
let removedLines = 0, keptLines = 0;
const docs = usable.map((p) => {
  const lines = p.caption.split('\n').filter((l) => { const bad = FORMULA.test(l); bad ? removedLines++ : keptLines++; return !bad; });
  let t = lines.join(' ')
    .replace(/https?:\/\/\S+/g, ' ').replace(/#[\p{L}\p{N}_]+/gu, ' ').replace(/@[\p{L}\p{N}_.]+/gu, ' ')
    .replace(/[\p{Extended_Pictographic}‍️⃣\u{1F3FB}-\u{1F3FF}]/gu, ' ')
    .replace(/[\u2019\u2018`]/g, "'").toLowerCase();
  const toks = t.match(/[\p{L}][\p{L}']*/gu) || [];
  return toks.map((w) => w.replace(/^'+|'+$/g, '').replace(/^(l|un|dell|all|nell|sull|dall|quest|quell|c|d|po|com|un)'/, ''));
});
const df = (mk) => { const m = new Map(); docs.forEach((toks) => { const seen = new Set(mk(toks)); seen.forEach((k) => m.set(k, (m.get(k) || 0) + 1)); }); return [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'it')); };
const ok = (w) => w.length >= 3 && !STOP.has(w);
const uni = df((t) => t.filter(ok));
const bi = df((t) => { const o = []; for (let i = 0; i < t.length - 1; i++) if (ok(t[i]) && ok(t[i + 1])) o.push(t[i] + ' ' + t[i + 1]); return o; });
const EN = docs.filter((t) => t.filter((w) => ['the', 'you', 'and', 'is', 'this', 'place', 'will', 'find', 'with'].includes(w)).length >= 3).length;
console.log('Caption con frasi in inglese (>=3 tra the/you/and/is/this/place/will/find/with):', EN, 'su', docs.length);
console.log('Caption analizzate:', docs.length, '(deny-list esclusa) | righe-formula rimosse:', removedLines, 'su', removedLines + keptLines, 'righe');
console.log('\nTOP 60 PAROLE (n. di caption che le contengono):\n' + uni.slice(0, 60).map(([w, n], i) => (i + 1) + '. ' + w + ' ' + n).join(' · '));
console.log('\nTOP 60 BIGRAMMI (n. di caption):\n' + bi.slice(0, 60).map(([w, n], i) => (i + 1) + '. ' + w + ' ' + n).join(' · '));
```

</details>

## 10. Immagini

`src/data/content-seed.json` (110 schede), `src/data/asset-provenance.json` (15 regole, vince
il prefisso più lungo, come `scripts/check-image-provenance.mjs`), `src/config/reels.ts`,
`public/images/reels/`.

- Schede nel registro (content-seed.json): 110 | visibili (isPlaceholder=false): 79 | segnaposto: 31

| Insieme | real-frame | real-photo | da-certificare | ai-generated | placeholder | craft | senza regola | nessuna cover |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 79 visibili | 79 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 31 segnaposto | 1 | 0 | 1 | 0 | 0 | 0 | 0 | 29 |

- Visibili la cui cover esiste su disco in public/: 79 su 79 con cover
- Visibili con cover fuori da /images/reels/: 0 (prefissi: {})
- Visibili con videoSrc: 66 | segnaposto con videoSrc: 1

- File in public/images/reels: 684 | stem distinti (-cover): 86 | con variante 768: 84 | senza 768: 2
- reels.ts: voci con cover 67 | con instagramUrl 67 | VISIBLE_REEL_IDS: 67

| Stem di cover (86) | n |
| --- | --- |
| referenziati da registro E da reels.ts | 67 |
| solo dal registro (content-seed) | 13 |
| solo da reels.ts | 0 |
| orfani (nessuno li referenzia) | 6 |
| di cui il reel e' nel corpus (per codice) | 80 |
| di cui con coordinate nel corpus | 71 |
| luoghi distinti (nome) coperti | 71 |
| codici discordanti tra registro e reels.ts | 0 |

- Stem orfani per prefisso (regione/citta): {"milano":1,"reel":5}
- Reel candidati con coordinate NON in registro (post): 897 | di questi con una cover reale su disco: 0
- Reel del corpus con cover reale su disco: 80 | di cui inRegistro=true: 80

- Regole registro: 15 | etichette: {"real-frame":3,"craft":3,"da-certificare":4,"ai-generated":4,"placeholder":1}
- Regola per /images/reels/x: real-frame | per /images/atlante/x: da-certificare

- Sottoinsieme con variante 768 (84 stem): referenziati 79 | reel nel corpus 79 | con coordinate 70 | luoghi distinti 70
- Stem senza variante 768: 2 (referenziati: 1)

- Visibili con cover censita in reels.ts: 66 | non censita in reels.ts (real-frame solo per prefisso di cartella): 13
- Visibili: cover -> reel nel corpus (per codice permalink): 79 | senza codice/reel nel corpus: 0

- Schede con codice reel nel permalink: 86 (visibili 79, segnaposto 7) | con solo link al profilo: 24 (tutte segnaposto: 24) | codici presenti nel corpus: 86

**Lettura.** Le 79 schede visibili hanno tutte una cover `real-frame`, tutte su disco e tutte
collegate a un reel del corpus per codice del permalink. **Nessuna `real-photo`** (il registro
non ha alcuna regola con quell'etichetta), **0 `da-certificare`, 0 senza regola**. Attenzione:
la provenienza è assegnata **per cartella** (`/images/reels/` → `real-frame`), non per asset;
la regola cita il censimento di `reels.ts`, che copre 66 delle 79 cover visibili; le altre 13
sono `real-frame` solo per prefisso. Delle 31 schede segnaposto, 29 non hanno cover, 1 è
`real-frame`, 1 `da-certificare` (cartella atlante). In `public/images/reels/` ci sono 86
stem di cover (84 con la variante 768): 80 sono collegabili a un reel del corpus e 71 a un
luogo con coordinate (71 luoghi distinti); 6 sono orfani. Sul sottoinsieme delle 84 con
variante 768: 79 collegate a un reel del corpus, 70 a un luogo con coordinate. **Dei 897 reel candidati con
coordinate non in registro, 0 hanno una cover reale su disco.** 66 delle 79 schede visibili
hanno un `videoSrc`, ma `public/video/` non ha file tracciati in git (0) e
`[VERIFY: che quei video siano serviti in produzione]`.

<details><summary>Script s10.js</summary>

```js
const L = require('./fp-lib.js');
const { fs, BEST, seed, corpus, places, tally, table } = L;
const reg = JSON.parse(fs.readFileSync(BEST + '/src/data/asset-provenance.json', 'utf8'));
const rules = [...reg.rules].sort((a, b) => b.prefix.length - a.prefix.length); // stessa regola di scripts/check-image-provenance.mjs: prefisso piu' lungo
const ruleFor = (p) => rules.find((r) => p.startsWith(r.prefix)) || null;
const visible = seed.filter((s) => !s.isPlaceholder);
console.log('Schede nel registro (content-seed.json):', seed.length, '| visibili (isPlaceholder=false):', visible.length, '| segnaposto:', seed.length - visible.length);
const prov = (s) => (!s.cover ? '(nessuna cover)' : (ruleFor(s.cover) || { provenance: '(senza regola)' }).provenance);
const covered = (arr) => tally(arr, prov);
console.log('\n' + table(['Insieme', 'real-frame', 'real-photo', 'da-certificare', 'ai-generated', 'placeholder', 'craft', 'senza regola', 'nessuna cover'],
  [['79 visibili', ...['real-frame', 'real-photo', 'da-certificare', 'ai-generated', 'placeholder', 'craft', '(senza regola)', '(nessuna cover)'].map((k) => covered(visible)[k] || 0)],
   ['31 segnaposto', ...['real-frame', 'real-photo', 'da-certificare', 'ai-generated', 'placeholder', 'craft', '(senza regola)', '(nessuna cover)'].map((k) => covered(seed.filter((s) => s.isPlaceholder))[k] || 0)]]));
const fileOk = (s) => s.cover && fs.existsSync(BEST + '/public' + s.cover);
console.log('Visibili la cui cover esiste su disco in public/:', visible.filter(fileOk).length, 'su', visible.filter((s) => s.cover).length, 'con cover');
console.log('Visibili con cover fuori da /images/reels/:', visible.filter((s) => s.cover && !s.cover.startsWith('/images/reels/')).length, '(prefissi:', JSON.stringify(tally(visible.filter((s) => s.cover && !s.cover.startsWith('/images/reels/')), (s) => s.cover.split('/').slice(0, 3).join('/'))) + ')');
console.log('Visibili con videoSrc:', visible.filter((s) => s.videoSrc).length, '| segnaposto con videoSrc:', seed.filter((s) => s.isPlaceholder && s.videoSrc).length);
// cover su disco
const files = fs.readdirSync(BEST + '/public/images/reels');
const stems = new Map(); files.forEach((f) => { const m = f.match(/^(.*-cover)(?:-(\d+))?\.(avif|webp)$/); if (m) { const o = stems.get(m[1]) || { w: new Set() }; o.w.add(m[2] || 'orig'); stems.set(m[1], o); } });
console.log('\nFile in public/images/reels:', files.length, '| stem distinti (-cover):', stems.size, '| con variante 768:', [...stems.values()].filter((o) => o.w.has('768')).length, '| senza 768:', [...stems.values()].filter((o) => !o.w.has('768')).length);
// collegamento stem -> reel del corpus, via registro e via reels.ts
const byCode = new Map(corpus.map((p) => [p.code, p]));
const codeOf = (u) => { const m = (u || '').match(/\/(?:reel|p)\/([A-Za-z0-9_-]+)/); return m ? m[1] : null; };
const stemOf = (c) => (c || '').replace(/^\/images\/reels\//, '').replace(/\.(webp|avif)$/, '');
const viaSeed = new Map(); seed.forEach((s) => { if (s.cover && s.cover.startsWith('/images/reels/')) viaSeed.set(stemOf(s.cover), codeOf(s.permalink)); });
const ts = fs.readFileSync(BEST + '/src/config/reels.ts', 'utf8');
const viaTs = new Map(); const RAW = ts.split(/\n  \{\n/).slice(1);
RAW.forEach((blk) => { const c = (blk.match(/cover:\s*'([^']+)'/) || [])[1], u = (blk.match(/instagramUrl:\s*'([^']+)'/) || [])[1]; if (c) viaTs.set(stemOf(c), codeOf(u)); });
const visibleIds = (ts.match(/const VISIBLE_REEL_IDS = new Set<string>\(\[([\s\S]*?)\]\)/) || [])[1] || '';
console.log('reels.ts: voci con cover', viaTs.size, '| con instagramUrl', [...viaTs.values()].filter(Boolean).length, '| VISIBLE_REEL_IDS:', (visibleIds.match(/'reel-[^']+'/g) || []).length);
const rows = [];
let both = 0, onlySeed = 0, onlyTs = 0, none = 0, inCorpus = 0, withCoords = 0; const placeSet = new Set(); let disagree = 0;
for (const st of stems.keys()) {
  const a = viaSeed.get(st), b = viaTs.get(st);
  const code = a || b; if (a && b && a !== b) disagree++;
  if (a && b) both++; else if (a) onlySeed++; else if (b) onlyTs++; else none++;
  const p = code && byCode.get(code); if (p) { inCorpus++; if (L.hasCoords(p)) { withCoords++; placeSet.add(L.placeName(p)); } }
}
console.log('\n' + table(['Stem di cover (86)', 'n'], [['referenziati da registro E da reels.ts', both], ['solo dal registro (content-seed)', onlySeed], ['solo da reels.ts', onlyTs], ['orfani (nessuno li referenzia)', none], ['di cui il reel e\' nel corpus (per codice)', inCorpus], ['di cui con coordinate nel corpus', withCoords], ['luoghi distinti (nome) coperti', placeSet.size], ['codici discordanti tra registro e reels.ts', disagree]]));
const orphans = [...stems.keys()].filter((st) => !viaSeed.get(st) && !viaTs.get(st));
console.log('Stem orfani per prefisso (regione/citta):', orphans.length ? JSON.stringify(tally(orphans, (s) => s.split('-')[0])) : 'nessuno');
// quanti dei 533 nuovi (o dei luoghi locali con reel) hanno una cover reale
const coverCodes = new Set([...stems.keys()].map((st) => viaSeed.get(st) || viaTs.get(st)).filter(Boolean));
const cand = corpus.filter((p) => p.tipo === 'reel' && p.classe === 'candidato' && L.hasCoords(p) && !p.inRegistro && !L.denied(p));
console.log('Reel candidati con coordinate NON in registro (post):', cand.length, '| di questi con una cover reale su disco:', cand.filter((p) => coverCodes.has(p.code)).length);
console.log('Reel del corpus con cover reale su disco:', corpus.filter((p) => coverCodes.has(p.code)).length, '| di cui inRegistro=true:', corpus.filter((p) => coverCodes.has(p.code) && p.inRegistro).length);
// regole di provenienza: cosa dicono su /images/reels/ e sui prefissi non reali
console.log('\nRegole registro:', rules.length, '| etichette:', JSON.stringify(tally(rules, (r) => r.provenance)));
console.log('Regola per /images/reels/x:', ruleFor('/images/reels/x.webp').provenance, '| per /images/atlante/x:', ruleFor('/images/atlante/x.webp').provenance);

// Stesso conteggio sul sottoinsieme con variante 768 (le "84 cover" del brief)
const s768 = [...stems.entries()].filter(([, o]) => o.w.has('768')).map(([k]) => k);
const cc = s768.map((st) => viaSeed.get(st) || viaTs.get(st)).filter(Boolean);
const pp = cc.map((c) => byCode.get(c)).filter(Boolean);
console.log('\nSottoinsieme con variante 768 (' + s768.length + ' stem): referenziati', cc.length, '| reel nel corpus', pp.length, '| con coordinate', pp.filter(L.hasCoords).length, '| luoghi distinti', new Set(pp.filter(L.hasCoords).map(L.placeName)).size);
console.log('Stem senza variante 768:', [...stems.entries()].filter(([, o]) => !o.w.has('768')).length, '(referenziati:', [...stems.entries()].filter(([k, o]) => !o.w.has('768') && (viaSeed.get(k) || viaTs.get(k))).length + ')');

// Cover delle 79 visibili censite in reels.ts (fonte citata dalla regola /images/reels/) vs solo per prefisso
const vStems = visible.map((s) => stemOf(s.cover));
console.log('\nVisibili con cover censita in reels.ts:', vStems.filter((st) => viaTs.has(st)).length, '| non censita in reels.ts (real-frame solo per prefisso di cartella):', vStems.filter((st) => !viaTs.has(st)).length);
console.log('Visibili: cover -> reel nel corpus (per codice permalink):', visible.filter((s) => byCode.has(codeOf(s.permalink))).length, '| senza codice/reel nel corpus:', visible.filter((s) => !byCode.has(codeOf(s.permalink))).length);

// Composizione delle 110 schede: con codice reel nel corpus vs solo link al profilo
const withCode = seed.filter((s) => codeOf(s.permalink));
console.log('\nSchede con codice reel nel permalink:', withCode.length, '(visibili', withCode.filter((s) => !s.isPlaceholder).length + ', segnaposto', withCode.filter((s) => s.isPlaceholder).length + ') | con solo link al profilo:', seed.length - withCode.length, '(tutte segnaposto:', seed.filter((s) => !codeOf(s.permalink) && s.isPlaceholder).length + ') | codici presenti nel corpus:', withCode.filter((s) => byCode.has(codeOf(s.permalink))).length);
```

</details>

## 11. Git

- commit di base: 4fe1794
- tracciati (ls-files --error-unmatch):
- src/data/corpus-places.json
- src/data/instagram-corpus.json
- nell'albero di 4fe1794, con byte:
- 100644 blob a77dfc09d7cff9adb30695def6d1debfc0850840  107952	src/data/corpus-places.json
- 100644 blob fb6196142470010b70d7d7a857d1a292077b462e 1516164	src/data/instagram-corpus.json
- copia di lavoro identica a 4fe1794
- instagram-corpus ignorato? rc=1 (1 = non ignorato)
- corpus-places ignorato? rc=1 (1 = non ignorato)
- storia dei due file:
- ce50dd4 2026-08-15 feat(corpus): l'archivio Instagram diventa un registro di luoghi geocodificati
- 6f9e7b0 2026-08-14 feat(dati): lo storico Instagram completo entra nel repo
- file tracciati sotto public/video: 0
- file tracciati in totale: 2403
- riferimenti nel codice (grep ts/tsx/mjs/js, esclusi node_modules):
- ./src/data/articles/dormire-posti-sembrano-inventati.seed.ts
- ./scripts/geocode-corpus-places.mjs
- ci.yml, occorrenze di actions/checkout: 4
- occorrenze di sparse/lfs/fetch-depth: 0

**Lettura.** Entrambi i file sono nell'albero di `4fe1794`, la copia di lavoro è identica,
nessuno dei due è ignorato. Nessun modulo di `src/` li importa (solo
`scripts/geocode-corpus-places.mjs`; in `dormire-posti-sembrano-inventati.seed.ts` compare
come commento): non entrano nel bundle client. `ci.yml` usa `actions/checkout@v4` (4
occorrenze) con opzioni di default, senza sparse-checkout, LFS né `fetch-depth` (grep: 0
risultati): la CI vede i file. `public/video/` non ha file tracciati.

<details><summary>Script s11.sh</summary>

```bash
# s11 — tracciamento git (solo git e grep in sola lettura)
cd "$BEST"
echo "commit di base: $(git rev-parse --short HEAD)"
echo "tracciati (ls-files --error-unmatch):"; git ls-files --error-unmatch src/data/instagram-corpus.json src/data/corpus-places.json
echo "nell'albero di 4fe1794, con byte:"; git ls-tree -l 4fe1794 src/data/instagram-corpus.json src/data/corpus-places.json
git diff --quiet 4fe1794 -- src/data/instagram-corpus.json src/data/corpus-places.json && echo "copia di lavoro identica a 4fe1794"
git check-ignore -q src/data/instagram-corpus.json; echo "instagram-corpus ignorato? rc=$? (1 = non ignorato)"
git check-ignore -q src/data/corpus-places.json;   echo "corpus-places ignorato? rc=$? (1 = non ignorato)"
echo "storia dei due file:"; git log --format='%h %ad %s' --date=short -- src/data/instagram-corpus.json src/data/corpus-places.json
echo "file tracciati sotto public/video: $(git ls-files public/video | wc -l)"
echo "file tracciati in totale: $(git ls-files | wc -l)"
echo "riferimenti nel codice (grep ts/tsx/mjs/js, esclusi node_modules):"; grep -rln "instagram-corpus\|corpus-places" --include=*.ts --include=*.tsx --include=*.mjs --include=*.js . | grep -v node_modules
echo "ci.yml, occorrenze di actions/checkout: $(grep -c "actions/checkout" .github/workflows/ci.yml)"; echo "occorrenze di sparse/lfs/fetch-depth: $(grep -c "sparse\|lfs\|fetch-depth" .github/workflows/ci.yml)"
```

</details>

## 12. Deny-list

Solo conteggi. Nessun nome, id o coordinata di voci escluse compare in questo file.

| Categoria | post | luoghi (nome) | coordinate distinte | post con coordinate |
| --- | --- | --- | --- | --- |
| post escluso per id (spec §1.1) | 1 | 1 | 1 | 1 |
| struttura sanitaria per NOME (regex; falso amico esente) | 1 | 1 | 1 | 1 |
| scuola / asilo / nido per NOME (regex) | 0 | 0 | 0 | 0 |
| sanitaria non riconoscibile da regex, segnalata a mano (lista fuori file) | 1 | 1 | 0 | 0 |
| indirizzo residenziale / abitazione | 0 | 0 | 0 | 0 |
| UNIONE (senza doppi conteggi) | 2 | 2 | 1 | 1 |

- Falso amico (nome con "ospedale" ma luogo visitabile): post 1 | esclusi dalla deny-list: 0
- Post deny-list per tipo: {"reel":2} | plays: 308076 | chiavi di corpus-places.json coinvolte: 1
- Etichette di luogo distinte lette a mano: 636 | etichette che sono solo un indirizzo stradale: 2 (esito revisione: locale pubblico, non abitazione, in entrambi i casi dalla caption)

- Segnalazione caption (post, escluso quello per id): gravidanza/nascita/neonato 6 ; ospedale/salute 4 ; figli/bambini piccoli 1 ; asilo/nido/scuola 6

**Lettura.** La deny-list della spec (§1) esclude 2 post (2 reel, 308.076 plays), 2 luoghi per
nome, 1 coordinata. Per categoria: post per id 1; struttura sanitaria per nome 1 (è lo stesso
post: i due criteri coincidono); scuole, asili, nidi 0; indirizzi residenziali 0
identificabili; struttura sanitaria/estetico-medica non riconoscibile da regex 1 (segnalata a
mano, senza coordinate). Il falso amico «ospedale» in un luogo visitabile c'è ed è **tenuto**
(1 post). Ho letto a mano le 636 etichette di luogo: due sono solo un indirizzo stradale e in
entrambi i casi la caption indica un locale pubblico. **Limite**: le abitazioni private non
si riconoscono dal nome; `[VERIFY: controllo dell'owner sulle coordinate geocodificate]`. Le
righe "segnalazione" sono conteggi di caption con parole-chiave (nascita, salute, asilo):
non sono deny-list, sono una spia per chi userà il testo delle caption.

<details><summary>Script s12.js</summary>

```js
const L = require('./fp-lib.js');
const { corpus, places, table, trim, hasCoords, placeName, coordKey } = L;
// Solo conteggi. Nessun nome, id o coordinata viene stampato.
const SAN = /\b(ospedal\w*|clinic\w*|policlinic\w*|poliambulator\w*|ambulator\w*|studio medic\w*|casa di cura|consultor\w*|pronto soccorso|centro medic\w*|irccs|asst|ausl|maternit\w*|hospital)\b/i;
const FRIEND = /ospedale delle bambole/i;
const SCH = /\b(scuol\w*|asil\w*|nido|nidi|liceo|istituto comprensivo|materna|elementar\w*|kindergarten|school)\b/i;
const nm = (p) => (p.location ? trim(p.location.name) : '');
const cats = {
  'post escluso per id (spec §1.1)': (p) => (process.env.DENY_CODES || '').split(',').includes(p.code),
  'struttura sanitaria per NOME (regex; falso amico esente)': (p) => SAN.test(nm(p)) && !FRIEND.test(nm(p)),
  'scuola / asilo / nido per NOME (regex)': (p) => SCH.test(nm(p)),
  'sanitaria non riconoscibile da regex, segnalata a mano (lista fuori file)': (p) => L.denyName(nm(p)) === 'manuale-sanitaria',
  'indirizzo residenziale / abitazione': () => false, // non identificabile da nome: vedi nota
};
const rows = Object.entries(cats).map(([k, f]) => { const ps = corpus.filter(f); return [k, ps.length, new Set(ps.filter((p) => p.location).map(nm)).size, new Set(ps.filter(hasCoords).map(coordKey)).size, ps.filter(hasCoords).length]; });
const union = corpus.filter((p) => Object.values(cats).some((f) => f(p)));
rows.push(['UNIONE (senza doppi conteggi)', union.length, new Set(union.filter((p) => p.location).map(nm)).size, new Set(union.filter(hasCoords).map(coordKey)).size, union.filter(hasCoords).length]);
console.log(table(['Categoria', 'post', 'luoghi (nome)', 'coordinate distinte', 'post con coordinate'], rows));
console.log('\nFalso amico (nome con "ospedale" ma luogo visitabile): post', corpus.filter((p) => FRIEND.test(nm(p))).length, '| esclusi dalla deny-list:', corpus.filter((p) => FRIEND.test(nm(p)) && L.denied(p)).length);
console.log('Post deny-list per tipo:', JSON.stringify(L.tally(union, (p) => p.tipo)), '| plays:', union.reduce((s, p) => s + (p.plays || 0), 0), '| chiavi di corpus-places.json coinvolte:', Object.keys(places).filter(L.deniedName).length);
// Revisione umana dei nomi: quante etichette distinte lette, e quante sono nome di via
const names = [...new Set(corpus.filter((p) => p.location).map(nm))];
const VIA = /^(via|viale|vicolo|piazzale|corso|strada)\b/i;
console.log('Etichette di luogo distinte lette a mano:', names.length, '| etichette che sono solo un indirizzo stradale:', names.filter((n) => VIA.test(n)).length, '(esito revisione: locale pubblico, non abitazione, in entrambi i casi dalla caption)');
// Segnalazione (NON deny-list): caption con parole-chiave su famiglia/salute, solo conteggi per gruppo
const KW = { 'gravidanza/nascita/neonato': /gravidanz|incinta|nascit|neonat|partorire|parto\b/i, 'ospedale/salute': /ospedal|malatt|operazion|terapia|pronto soccorso/i, 'figli/bambini piccoli': /\b(nostro figlio|nostra figlia|nostro bimbo|nostra bimba|il piccolo|la piccola|nostro bambino|nostra bambina)\b/i, 'asilo/nido/scuola': /\b(asilo|nido|scuola materna|scuola)\b/i };
console.log('\nSegnalazione caption (post, escluso quello per id):', Object.entries(KW).map(([k, re]) => k + ' ' + corpus.filter((p) => !cats['post escluso per id (spec §1.1)'](p) && re.test(p.caption)).length).join(' ; '));
```

</details>

## 13. Commenti per reel

Solo conteggi (il testo dei commenti non c'è). Reel usabili (1.190).

- Reel: 1190 | somma commenti: 122.102 | media: 102,6 | mediana: 70 | p25: 53 | p75: 93 | p90: 175 | p99: 749 | max: 2.057

| Commenti per reel | reel | quota |
| --- | --- | --- |
| 0 | 0 | 0,0% |
| 1-9 | 14 | 1,2% |
| 10-49 | 223 | 18,7% |
| 50-99 | 698 | 58,7% |
| 100-499 | 234 | 19,7% |
| 500-999 | 13 | 1,1% |
| 1000+ | 8 | 0,7% |

| Anno | reel | mediana commenti | p90 | reel con >=100 |
| --- | --- | --- | --- | --- |
| 2021 | 50 | 21 | 47 | 0 |
| 2022 | 246 | 52 | 185 | 40 |
| 2023 | 267 | 77 | 207 | 70 |
| 2024 | 250 | 79 | 222 | 74 |
| 2025 | 240 | 74 | 127 | 43 |
| 2026 | 137 | 68 | 156 | 28 |

- Commenti ogni 1.000 plays: mediana 1,47 | p90 3,24 | max 18,8
- 10 valori piu alti di commenti (senza id): 2057, 1665, 1396, 1273, 1256, 1223, 1087, 1056, 996, 927
- Reel col 5% piu alto di commenti: quota dei commenti totali 27,8%
- Correlazione di rango (Spearman) plays~commenti: 0,59

**Lettura.** Mediana 70 commenti per reel (p25 53, p75 93, p90 175, max 2.057). Il 58,7% dei
reel sta tra 50 e 99 commenti; nessun reel ha 0 commenti; 21 reel superano 500. Il 5% dei
reel con più commenti fa il 27,8% del totale. Commenti e plays sono correlati per rango
(0,59); in mediana 1,47 commenti ogni 1.000 plays. La mediana per anno cresce dal 2021 (21)
al 2023-24 (77-79). `[VERIFY: cosa conta il campo comments del feed: risposte dell'account,
automazioni «scrivici nei commenti»]`.

<details><summary>Script s13.js</summary>

```js
const L = require('./fp-lib.js');
const { reels, table, nf, q, median, sum, yearOf } = L;
const R = reels.filter((p) => !L.denied(p)); // deny-list esclusa
const c = R.map((p) => p.comments);
const B = [['0', 0, 0], ['1-9', 1, 9], ['10-49', 10, 49], ['50-99', 50, 99], ['100-499', 100, 499], ['500-999', 500, 999], ['1000+', 1000, Infinity]];
console.log('Reel:', R.length, '| somma commenti:', nf(sum(c)), '| media:', (sum(c) / c.length).toFixed(1).replace('.', ','), '| mediana:', nf(median(c)), '| p25:', nf(q(c, .25)), '| p75:', nf(q(c, .75)), '| p90:', nf(q(c, .9)), '| p99:', nf(q(c, .99)), '| max:', nf(Math.max(...c)));
console.log('\n' + table(['Commenti per reel', 'reel', 'quota'], B.map(([l, a, b]) => { const n = c.filter((x) => x >= a && x <= b).length; return [l, n, L.pct(n, c.length)]; })));
const yrs = [...new Set(R.map(yearOf))].sort();
console.log('\n' + table(['Anno', 'reel', 'mediana commenti', 'p90', 'reel con >=100'], yrs.map((y) => { const a = R.filter((p) => yearOf(p) === y).map((p) => p.comments); return [y, a.length, nf(median(a)), nf(q(a, .9)), a.filter((x) => x >= 100).length]; })));
// commenti / 1.000 plays, per confronto (mediana)
const ratio = R.map((p) => (1000 * p.comments) / p.plays);
console.log('\nCommenti ogni 1.000 plays: mediana', median(ratio).toFixed(2).replace('.', ','), '| p90', q(ratio, .9).toFixed(2).replace('.', ','), '| max', Math.max(...ratio).toFixed(1).replace('.', ','));
console.log('10 valori piu alti di commenti (senza id):', [...c].sort((a, b) => b - a).slice(0, 10).join(', '));
console.log('Reel col 5% piu alto di commenti: quota dei commenti totali', L.pct(sum([...c].sort((a, b) => b - a).slice(0, Math.round(c.length * 0.05))), sum(c)));
console.log('Correlazione di rango (Spearman) plays~commenti:', (() => { const rk = (a) => { const s = a.map((v, i) => [v, i]).sort((x, y) => x[0] - y[0]); const r = Array(a.length); s.forEach(([, i], k) => (r[i] = k)); return r; }; const x = rk(R.map((p) => p.plays)), y = rk(c); const n = x.length, mx = sum(x) / n, my = sum(y) / n; return (sum(x.map((v, i) => (v - mx) * (y[i] - my))) / Math.sqrt(sum(x.map((v) => (v - mx) ** 2)) * sum(y.map((v) => (v - my) ** 2)))).toFixed(2).replace('.', ','); })());
```

</details>

## 14. Ricorrenza vicino a casa (decisione privacy dell'owner)

**Solo conteggi: nessuna coordinata, nome o regione dell'area compare.** Metodo: cluster per
coordinata (deny-list esclusa) con ≥2 visite (>30 giorni) e non generici; si cerca l'area con
più peso di visite di ritorno entro una banda di 25 km, poi 5 iterazioni di mean-shift
pesate per numero di visite; si contano luoghi e post entro 10, 25 e 50 km dal baricentro.
L'ultima tabella ripete la ricerca con bande di 10, 25 e 50 km.

- Cluster-coordinata con coordinate (deny-list esclusa): 639 | di ritorno (>=2 visite >30 gg) e non generici: 61
- Peso visite di ritorno totale (cluster locali): 152 | entro 25 km dalla semenza: 25 = 16,4%

| Raggio dal baricentro | luoghi (coordinate distinte) | di cui non generici | di cui di ritorno | reel | post (tutti i tipi) | quota dei post con coordinate |
| --- | --- | --- | --- | --- | --- | --- |
| 10 km | 12 | 11 | 1 | 21 | 21 | 1,9% |
| 25 km | 53 | 49 | 9 | 91 | 97 | 8,9% |
| 50 km | 76 | 64 | 10 | 132 | 142 | 13,1% |

- Totale post con coordinate (deny-list esclusa): 1086 | reel: 1016 | luoghi non generici in tutto: 489
- Luoghi di ritorno in TUTTO il corpus: 61 | dentro 50 km dal baricentro: 10 = 16,4%
- Sensibilita: spostamento del baricentro alternativo rispetto al primo: 3,4 km

| Raggio | luoghi | non generici | post |
| --- | --- | --- | --- |
| 10 km (alt.) | 11 | 10 | 21 |
| 25 km (alt.) | 55 | 51 | 99 |
| 50 km (alt.) | 80 | 67 | 146 |

- Luoghi di ritorno con >=3 visite: 19 | di cui entro 25 km dal baricentro: 3

| Banda di ricerca | peso visite di ritorno nell'area | distanza dal baricentro base (km) | luoghi a 10 km | luoghi a 25 km | luoghi a 50 km | post a 25 km |
| --- | --- | --- | --- | --- | --- | --- |
| 10 km | 8 su 152 | 12,0 | 24 | 46 | 76 | 88 |
| 25 km | 25 su 152 | 0,0 | 12 | 53 | 76 | 97 |
| 50 km | 30 su 152 | 141,1 | 6 | 78 | 111 | 158 |

**Lettura.** Non emerge un'area dominante: il baricentro base tiene il 16,4% del peso delle
visite di ritorno (25 su 152) e solo 10 dei 61 luoghi di ritorno cadono entro 50 km. Con
banda di 50 km la ricerca sceglie un'area **diversa, a 141 km**, con 30 su 152. Conteggi nel
baricentro base: **10 km: 12 luoghi (11 non generici), 21 post; 25 km: 53 luoghi (49 non
generici), 97 post (8,9% dei post con coordinate); 50 km: 76 luoghi (64), 142 post
(13,1%)**. A 25 km, con le tre bande, i luoghi vanno da 46 a 78 e i post da 88 a 158: **il
risultato dipende dal metodo**, e i dati non dimostrano quale sia l'area di casa.

<details><summary>Script s14.js</summary>

```js
const L = require('./fp-lib.js');
const { corpus, reels, hasCoords, coordKey, placeName, table, nf, sum } = L;
// SOLO CONTEGGI: nessuna coordinata, nome o regione dell'area viene stampata.
const R = (d) => (d * Math.PI) / 180;
const km = (a, b) => { const dLat = R(b.lat - a.lat), dLng = R(b.lng - a.lng); const h = Math.sin(dLat / 2) ** 2 + Math.cos(R(a.lat)) * Math.cos(R(b.lat)) * Math.sin(dLng / 2) ** 2; return 12742 * Math.asin(Math.sqrt(h)); };
// cluster per coordinata (deny-list esclusa)
const M = new Map();
corpus.filter((p) => hasCoords(p) && !L.denied(p)).forEach((p) => { const k = coordKey(p); const o = M.get(k) || { lat: p.location.lat, lng: p.location.lng, posts: [], names: new Set() }; o.posts.push(p); o.names.add(placeName(p)); M.set(k, o); });
const C = [...M.values()].map((o) => { const rp = o.posts.filter((p) => p.tipo === 'reel'); const d = [...new Set(rp.map(L.dayNum))].sort((a, b) => a - b); let v = 0, st = -1e9; d.forEach((x) => { if (x - st > 30) { v++; st = x; } }); return { ...o, visite: v, generic: [...o.names].some(L.looksGeneric) }; });
const rep = C.filter((o) => o.visite >= 2 && !o.generic); // luoghi di ritorno, locali
console.log('Cluster-coordinata con coordinate (deny-list esclusa):', C.length, '| di ritorno (>=2 visite >30 gg) e non generici:', rep.length);
const wsum = (list) => sum(list.map((o) => o.visite));
// 1) semenza: il cluster di ritorno con il maggior peso di visite di ritorno entro 25 km
let seed = rep[0], best = -1;
rep.forEach((o) => { const w = wsum(rep.filter((x) => km(o, x) <= 25)); if (w > best) { best = w; seed = o; } });
// 2) mean-shift: baricentro pesato (peso = visite) dei cluster di ritorno entro 25 km, 5 iterazioni
let c = { lat: seed.lat, lng: seed.lng };
for (let i = 0; i < 5; i++) { const near = rep.filter((x) => km(c, x) <= 25); const w = wsum(near); c = { lat: sum(near.map((x) => x.lat * x.visite)) / w, lng: sum(near.map((x) => x.lng * x.visite)) / w }; }
const withDist = C.map((o) => ({ ...o, d: km(c, o) }));
const sumVisitRep = wsum(rep);
console.log('Peso visite di ritorno totale (cluster locali):', sumVisitRep, '| entro 25 km dalla semenza:', best, '=', L.pct(best, sumVisitRep));
const rows = [10, 25, 50].map((r) => {
  const inn = withDist.filter((o) => o.d <= r);
  const loc = inn.filter((o) => !o.generic);
  const repIn = rep.filter((o) => km(c, o) <= r);
  const posts = inn.flatMap((o) => o.posts);
  return [r + ' km', inn.length, loc.length, repIn.length, posts.filter((p) => p.tipo === 'reel').length, posts.length, L.pct(posts.length, C.reduce((s, o) => s + o.posts.length, 0))];
});
console.log('\n' + table(['Raggio dal baricentro', 'luoghi (coordinate distinte)', 'di cui non generici', 'di cui di ritorno', 'reel', 'post (tutti i tipi)', 'quota dei post con coordinate'], rows));
console.log('Totale post con coordinate (deny-list esclusa):', C.reduce((s, o) => s + o.posts.length, 0), '| reel:', C.reduce((s, o) => s + o.posts.filter((p) => p.tipo === 'reel').length, 0), '| luoghi non generici in tutto:', C.filter((o) => !o.generic).length);
console.log('Luoghi di ritorno in TUTTO il corpus:', rep.length, '| dentro 50 km dal baricentro:', rep.filter((o) => km(c, o) <= 50).length, '=', L.pct(rep.filter((o) => km(c, o) <= 50).length, rep.length));
// Sensibilita': baricentro alternativo = media pesata per numero di reel dei cluster non generici entro 50 km dal primo baricentro
const near50 = withDist.filter((o) => o.d <= 50 && !o.generic);
const w2 = sum(near50.map((o) => o.posts.length));
const c2 = { lat: sum(near50.map((o) => o.lat * o.posts.length)) / w2, lng: sum(near50.map((o) => o.lng * o.posts.length)) / w2 };
console.log('Sensibilita: spostamento del baricentro alternativo rispetto al primo:', km(c, c2).toFixed(1).replace('.', ','), 'km');
const rows2 = [10, 25, 50].map((r) => { const inn = C.filter((o) => km(c2, o) <= r); return [r + ' km (alt.)', inn.length, inn.filter((o) => !o.generic).length, inn.flatMap((o) => o.posts).length]; });
console.log(table(['Raggio', 'luoghi', 'non generici', 'post'], rows2));
// Sensibilita' 2: baricentro solo dai luoghi di ritorno con >=3 visite
const rep3 = rep.filter((o) => o.visite >= 3);
console.log('Luoghi di ritorno con >=3 visite:', rep3.length, '| di cui entro 25 km dal baricentro:', rep3.filter((o) => km(c, o) <= 25).length);

// Sensibilita' 3: larghezza di banda della ricerca dell'area (10 / 25 / 50 km) -> baricentro, spostamenti e conteggi
const cent = (bw) => { let s = rep[0], b = -1; rep.forEach((o) => { const w = wsum(rep.filter((x) => km(o, x) <= bw)); if (w > b) { b = w; s = o; } }); let cc = { lat: s.lat, lng: s.lng }; for (let i = 0; i < 5; i++) { const near = rep.filter((x) => km(cc, x) <= bw); const w = wsum(near); cc = { lat: sum(near.map((x) => x.lat * x.visite)) / w, lng: sum(near.map((x) => x.lng * x.visite)) / w }; } return { c: cc, peso: b }; };
const bws = [10, 25, 50].map((bw) => ({ bw, ...cent(bw) }));
console.log('\n' + table(['Banda di ricerca', 'peso visite di ritorno nell\'area', 'distanza dal baricentro base (km)', 'luoghi a 10 km', 'luoghi a 25 km', 'luoghi a 50 km', 'post a 25 km'],
  bws.map((b) => [b.bw + ' km', b.peso + ' su ' + sumVisitRep, km(c, b.c).toFixed(1).replace('.', ','), ...[10, 25, 50].map((r) => C.filter((o) => km(b.c, o) <= r).length), C.filter((o) => km(b.c, o) <= 25).flatMap((o) => o.posts).length])));
```

</details>

## 15. Tracce e posti: reel geolocalizzati senza una scheda propria

"Ha la sua scheda" = post con `inRegistro=true` (coincide con i codici del registro: 0
discordanze). Reel usabili (1.190).

| Anno | A. con scheda | B. su posto con scheda | C. locale senza scheda | D. etichetta generica | F. no coordinate | G. senza luogo | reel |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2021 | 0 | 4 | 8 | 11 | 0 | 27 | 50 |
| 2022 | 0 | 8 | 123 | 88 | 2 | 25 | 246 |
| 2023 | 0 | 16 | 131 | 92 | 7 | 21 | 267 |
| 2024 | 2 | 16 | 78 | 104 | 8 | 42 | 250 |
| 2025 | 31 | 32 | 104 | 51 | 7 | 15 | 240 |
| 2026 | 44 | 10 | 40 | 23 | 1 | 19 | 137 |
| Totale | 77 | 86 | 484 | 369 | 25 | 149 | 1190 |

- Reel geolocalizzati (con coordinate): 1016 | senza scheda propria (B+C+D): 939 = 92,4% | A: 77
- Tracce su locali senza scheda (C): 484 reel su 409 coordinate distinte
- Reel di classe "candidato" nel gruppo C: 482 | altre classi (listicle/adv-prodotto/incerto/non-posto): 2
- Includendo le etichette senza coordinate (F): reel con luogo ma non mappabili: 25 | senza luogo (G): 149
- Reel senza scheda propria in totale (inRegistro=false, anche senza coordinate): 1104 su 1190
- Controllo: post con inRegistro=true 86 | codici del registro presenti nel corpus 86 | discordanze 0

**Lettura.** Su 1.016 reel con coordinate, **939 (92,4%) non hanno una scheda propria**: 86
stanno su un posto che una scheda ce l'ha già, 484 su un locale senza scheda (409 coordinate
distinte, 482 di classe `candidato`), 369 su un'etichetta generica. Se si contano anche i
reel non mappabili (25 con etichetta senza coordinate, 149 senza luogo), i reel senza scheda
propria sono 1.104 su 1.190. **I 77 reel con scheda e coordinate sono tutti del 2024-2026** (2
nel 2024, 31 nel 2025, 44 nel 2026): l'arretrato è vecchio, il 2022-2023 conta 254 dei 484
reel su locali senza scheda (123 + 131).

<details><summary>Script s15.js</summary>

```js
const L = require('./fp-lib.js');
const { reels, hasCoords, coordKey, placeName, yearOf, table, tally } = L;
const R = reels.filter((p) => !L.denied(p));
const regCoords = new Set(L.corpus.filter((p) => p.inRegistro && hasCoords(p)).map(coordKey)); // coordinate che hanno gia' una scheda
const cls = (p) => {
  if (!hasCoords(p)) return p.location ? 'F. etichetta senza coordinate' : 'G. senza luogo';
  if (p.inRegistro) return 'A. ha la sua scheda';
  if (regCoords.has(coordKey(p))) return 'B. traccia su un posto che ha gia\' una scheda';
  if (L.looksGeneric(placeName(p))) return 'D. traccia con etichetta generica (citta\'/regione/paese)';
  return 'C. traccia su un locale senza scheda';
};
const years = [...new Set(R.map(yearOf))].sort();
const keys = ['A. ha la sua scheda', 'B. traccia su un posto che ha gia\' una scheda', 'C. traccia su un locale senza scheda', 'D. traccia con etichetta generica (citta\'/regione/paese)', 'F. etichetta senza coordinate', 'G. senza luogo'];
const grid = years.map((y) => { const t = tally(R.filter((p) => yearOf(p) === y), cls); return [y, ...keys.map((k) => t[k] || 0), R.filter((p) => yearOf(p) === y).length]; });
const tot = ['Totale', ...keys.map((k) => R.filter((p) => cls(p) === k).length), R.length];
console.log(table(['Anno', 'A. con scheda', 'B. su posto con scheda', 'C. locale senza scheda', 'D. etichetta generica', 'F. no coordinate', 'G. senza luogo', 'reel'], [...grid, tot]));
const geo = R.filter(hasCoords);
const noCard = geo.filter((p) => !p.inRegistro);
console.log('\nReel geolocalizzati (con coordinate):', geo.length, '| senza scheda propria (B+C+D):', noCard.length, '=', L.pct(noCard.length, geo.length), '| A:', geo.length - noCard.length);
console.log('Tracce su locali senza scheda (C):', R.filter((p) => cls(p) === keys[2]).length, 'reel su', new Set(R.filter((p) => cls(p) === keys[2]).map(coordKey)).size, 'coordinate distinte');
console.log('Reel di classe "candidato" nel gruppo C:', R.filter((p) => cls(p) === keys[2] && p.classe === 'candidato').length, '| altre classi (listicle/adv-prodotto/incerto/non-posto):', R.filter((p) => cls(p) === keys[2] && p.classe !== 'candidato').length);
console.log('Includendo le etichette senza coordinate (F): reel con luogo ma non mappabili:', R.filter((p) => cls(p) === 'F. etichetta senza coordinate').length, '| senza luogo (G):', R.filter((p) => cls(p) === 'G. senza luogo').length);
console.log('Reel senza scheda propria in totale (inRegistro=false, anche senza coordinate):', R.length - R.filter((p) => p.inRegistro).length, 'su', R.length);
// verifica: inRegistro coincide con i codici del registro
const codeOf = (u) => { const m = (u || '').match(/\/(?:reel|p)\/([A-Za-z0-9_-]+)/); return m ? m[1] : null; };
const seedCodes = new Set(L.seed.map((s) => codeOf(s.permalink)).filter(Boolean));
console.log('Controllo: post con inRegistro=true', L.corpus.filter((p) => p.inRegistro).length, '| codici del registro presenti nel corpus', L.corpus.filter((p) => seedCodes.has(p.code)).length, '| discordanze', L.corpus.filter((p) => p.inRegistro !== seedCodes.has(p.code)).length);
```

</details>

---

## 7 fatti che nessun sito di viaggi generico ha

Solo fatti, ciascuno con la sezione che li dimostra.

1. **62 mesi di calendario consecutivi (lug 2021 - ago 2026) con almeno un reel**: 1.192
   reel, da 241 a 267 all'anno dal 2022, 211.941.714 plays totali, mediana 41.965 per reel
   (sezioni 2, 4).
2. **595 luoghi con almeno un reel in 26 paesi**, ciascuno con coordinate, data e
   visualizzazioni pubbliche del reel: 467 sono locali veri, 342 in Italia (sezioni 4, 7).
3. **106 luoghi ripubblicati a più di 30 giorni di distanza**, 62 dei quali locali veri; il
   più ripetuto ha 6 visite in 3 anni (sezione 3).
4. **243 reel (20,4%) dichiarano un prezzo in euro nella caption**, su 176 luoghi; dal 2023 tra
   il 22,9% e il 29,6% dei post di ogni anno; 17 prezzi «a notte» con mediana 140 €
   (sezione 5).
5. **182 reel (15,3%) dichiarano in caption una collaborazione, un invito o un'affiliazione**,
   e la dicitura cambia nel tempo (da «Adv» a «Invited» e «Affiliazione» nel 2026); la
   differenza di plays con i reel non marcati non è distinguibile da zero dal 2023
   (sezione 6).
6. **Sei regioni italiane a zero reel** (Basilicata, Friuli-Venezia Giulia, Marche, Molise,
   Puglia, Sardegna) e il 76,0% dei luoghi locali italiani nelle otto regioni del Nord
   (sezione 7).
7. **Le 79 schede visibili hanno tutte una cover `real-frame` su disco, ciascuna legata a un
   reel del corpus per codice**, mentre 939 reel geolocalizzati su 1.016 (92,4%) non hanno
   una scheda propria e per nessuno dei 897 reel candidati non in registro esiste una cover
   reale su disco (sezioni 10, 15).

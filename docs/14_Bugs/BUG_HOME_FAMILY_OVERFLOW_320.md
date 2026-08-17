---
type: bug
area: frontend
status: open
priority: p3
owner: unassigned
repo: TRAVELLINIWITHUS
related: '[[10_Projects/PROJECT_HOME_RICOMPOSIZIONE_2026-07-26]]'
source: verifica del commutatore di pubblico (chip di edizione in navbar), 2026-08-17
tags:
  - bug
  - qa
  - mobile
  - audience
---

# BUG_HOME_FAMILY_OVERFLOW_320

## Sintomo

`/` (homepage) scorre in orizzontale di 10px a **320px** quando l'audience
risolta è `family` mentre la rotta resta `/`. Non riproducibile a 375px
(0 overflow) né sulla rotta `/family` diretta (0 overflow, già coperta da
`e2e/rotte-target-e-overflow.spec.ts`).

`[MISURATO]`, sonda Playwright ad-hoc (temporanea, non committata):

```
document.documentElement.scrollWidth = 330, clientWidth = 320
```

Il colpevole isolato per bisezione dentro `#main-content`:

```
<div class="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-20">
  Per chi parte con i bambini — Con i bambini non cambia la meta.
</div>
```

Sezione dentro l'albero `clean-homepage` (`src/components/home/curated/*` o
`src/components/home/cinematic/*` — non ancora isolato al singolo file).

## Come riprodurlo

1. Su `/`, imposta `localStorage.setItem('travellini_audience', 'family')`.
2. Ricarica su `/` (non su `/family`) a viewport 320px.
3. `document.documentElement.scrollWidth - clientWidth === 10`.

Nel sito questa combinazione si verifica per un visitatore che ha già scelto
Family in una visita precedente (persistita in `localStorage`) e poi atterra
sulla home nuda (link diretto, ricerca, tasto Indietro) invece che su
`/family`: `resolvedAudience = routeAudience ?? userAudience` risolve a
`family` mentre il layout resta quello della home generica.

## Perché non è stato corretto in questo lavoro

Scoperto verificando il chip di edizione in navbar (non introdotto da
quel lavoro: riproducibile anche disattivando `AudienceEditionChip`, e la
rotta `/family` diretta — stesso contenuto family, stesso drawer — resta
pulita). La causa vive in un componente della home (`src/components/home/`),
fuori dal set di file toccato per la navbar. Non coperto da
`e2e/rotte-target-e-overflow.spec.ts`, che testa ogni rotta nella sua audience
naturale, mai la combinazione "home + preferenza persistita diversa".

## Prossimo passo

Isolare il componente esatto sotto `clean-homepage` che renderizza la card
"Per chi parte con i bambini" e verificarne il testo/width a 320px.

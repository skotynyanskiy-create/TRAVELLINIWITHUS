# TRAVELLINIWITHUS — Checklist Finale di Lancio 🚀

Questo documento riassume i passi necessari per portare il sito dallo stato attuale (sviluppo/predisposizione) al lancio ufficiale in produzione. La struttura tecnica, il design e la logica di navigazione sono completati e verificati.

## 1. 📂 Contenuti e CMS (Azione richiesta: Rodrigo & Betta)

Il sito è attualmente in "Demo Mode". Per renderlo reale:

- [ ] **Accesso Admin**: Accedi a `/admin` con un account Google autorizzato.
- [ ] **Articoli Reali**: Carica almeno 3-5 articoli reali tra **Destinazioni** e **Guide**.
  - _Nota_: Per le Guide, usa le nuove categorie blog (es: "Itinerari completi", "Cosa portare").
- [ ] **Prodotti Shop**: Carica i prodotti digitali (o fisici) reali nella collezione `products`.
- [ ] **Disattivazione Demo**: Una volta caricati i contenuti, vai nelle impostazioni del sito (sempre in Admin) e disattiva `showEditorialDemo` e `showShopDemo`.

## 2. 📈 Analisi e Tracciamento (Predisposizione completata)

Il sistema è già pronto per tracciare le visite.

- [ ] **ID Integrazioni**: Apri il file `src/config/integrations.ts`.
- [ ] **Inserimento ID**: Incolla i tuoi ID reali per:
  - Google Analytics 4 (`googleAnalyticsId`)
  - Meta Pixel (`metaPixelId`)
- [ ] **Newsletter**: Se usi un servizio esterno (Mailchimp/Flodesk), inserisci l'URL del form in `newsletterActionUrl`.

## 3. 💳 Shop e Pagamenti (Solo predisposizione)

Al momento il carrello simula il successo del pagamento.

- [ ] **Account Stripe**: Crea o configura il tuo account Stripe.
- [ ] **Firebase Extension**: Configura l'estensione "Run Payments with Stripe" su Firebase.
- [ ] **Webhook**: Assicurati che i webhook di Stripe puntino al tuo backend per sbloccare i contenuti digitali acquistati.

## 4. ⚖️ Aspetti Legali e GDPR

- [ ] **Privacy & Cookie**: I testi in `src/pages/legal/` sono bozze strutturate. Verifica che i dati (email, riferimenti fiscali) siano corretti.
- [ ] **Banner Cookie**: Se usi Iubenda, inserisci lo script fornito nel file `index.html`.

## 5. 🚀 Deployment Finale

- [ ] **Build Check**: Esegui `npm run build` localmente per assicurarti che non ci siano errori dell'ultimo minuto.
- [ ] **Vercel/Hosting**: Carica l'ultima versione su Vercel (o il tuo provider) e configura il dominio `travelliniwithus.it`.
- [ ] **HTTPS**: Verifica che il certificato SSL sia attivo.

---

### Verifiche di Qualità (Audit)

- [x] **SEO**: Meta tag dinamici e OpenGraph configurati.
- [x] **Performance**: Immagini ottimizzate e lazy loading attivo.
- [x] **Navigazione**: Interconnessione tra Luoghi, Esperienze e Guide funzionante.
- [x] **Mobile**: Layout responsive su tutti i breakpoint.

**Creato il**: 15 Aprile 2026  
**Stato**: PRONTO PER IL CARICAMENTO CONTENUTI  
**Prossimo Passo**: Caricare il primo articolo reale su `/admin`.

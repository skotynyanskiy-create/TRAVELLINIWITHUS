---
title: Disaster Recovery Runbook
type: runbook
status: active
date: 2026-04-20
owner: Rodrigo
tags: [ops, firestore, backup, recovery]
---

# Disaster Recovery Runbook

Questo documento è la procedura operativa per proteggere e recuperare i dati Firestore di TRAVELLINIWITHUS. Coprire i dati vuol dire coprire: articoli, prodotti, ordini, resource partner, newsletter signups. Ogni ora di downtime o ogni dato perso è lead perso o credibility hit.

## Obiettivi di recovery

| Indicatore | Target | Stato attuale |
|------------|--------|---------------|
| RPO — Recovery Point Objective (dati massimo persi) | ≤ 7 giorni | Predisposto settimanale |
| RTO — Recovery Time Objective (tempo ripristino) | ≤ 4 ore dopo incidente | Documentato sotto |
| Storage location backup | GCS bucket multi-region, diverso dal progetto Firestore | Da configurare |
| Cifratura a riposo | AES-256 by default (GCS) | GCP default |

## Cosa viene esportato

Export completo del database Firestore default del progetto `travelliniwithus` (tutte le collection: articles, products, orders, resources, users, newsletter_subscribers, leads, site_settings, ecc.).

> Note: lo schedule copre l'intero DB. Se serve export parziale, usare il flag `--collection-ids` nel comando `gcloud firestore export` del workflow.

## Setup iniziale (una tantum)

### 1. Crea bucket GCS di backup

```bash
# Bucket multi-region con lifecycle policy retention 30 giorni
gcloud storage buckets create gs://travelliniwithus-firestore-backups \
  --project=travelliniwithus \
  --location=EU \
  --uniform-bucket-level-access \
  --default-storage-class=NEARLINE

# Retention 30 giorni
cat > lifecycle.json <<'EOF'
{
  "rule": [
    {
      "action": { "type": "Delete" },
      "condition": { "age": 30 }
    }
  ]
}
EOF
gcloud storage buckets update gs://travelliniwithus-firestore-backups \
  --lifecycle-file=lifecycle.json
rm lifecycle.json
```

### 2. Crea service account dedicato

```bash
gcloud iam service-accounts create firestore-backup-bot \
  --display-name="Firestore Backup Bot" \
  --project=travelliniwithus

# Ruoli minimi
gcloud projects add-iam-policy-binding travelliniwithus \
  --member="serviceAccount:firestore-backup-bot@travelliniwithus.iam.gserviceaccount.com" \
  --role="roles/datastore.importExportAdmin"

gcloud storage buckets add-iam-policy-binding gs://travelliniwithus-firestore-backups \
  --member="serviceAccount:firestore-backup-bot@travelliniwithus.iam.gserviceaccount.com" \
  --role="roles/storage.objectAdmin"
```

### 3. Configura Workload Identity Federation (OIDC → GitHub)

Evita di committare JSON key. Setup guidato: https://github.com/google-github-actions/auth#setting-up-workload-identity-federation

Al termine avrai il resource name del provider, es.
`projects/123456789/locations/global/workloadIdentityPools/github-pool/providers/github-provider`

### 4. Configura GitHub Actions vars

Repository Settings → Secrets and variables → Actions → Variables (non Secrets, sono solo identificatori non sensibili):

- `GCP_PROJECT_ID` = `travelliniwithus`
- `GCP_WORKLOAD_IDENTITY_PROVIDER` = resource name del provider
- `GCP_BACKUP_SERVICE_ACCOUNT` = `firestore-backup-bot@travelliniwithus.iam.gserviceaccount.com`
- `FIRESTORE_BACKUP_BUCKET` = `travelliniwithus-firestore-backups`

### 5. Testa il workflow manualmente

GitHub → Actions → "Firestore weekly backup" → Run workflow. Verifica che dopo 5-15 minuti appaia una cartella datata sotto `gs://travelliniwithus-firestore-backups/firestore-backups/YYYY-MM-DD_HHMM/`.

## Procedura di ripristino

### Scenario A — Corruzione parziale (es. collection articles accidentalmente cancellata)

1. Identifica il backup più recente prima dell'incidente:
   ```bash
   gcloud storage ls gs://travelliniwithus-firestore-backups/firestore-backups/ | sort -r | head -5
   ```
2. Importa solo la collection colpita verso **un progetto Firestore di staging** (non prod):
   ```bash
   gcloud firestore import \
     gs://travelliniwithus-firestore-backups/firestore-backups/2026-04-19_0300 \
     --collection-ids=articles \
     --project=travelliniwithus-staging
   ```
3. Ispeziona la collection su staging (Firebase console).
4. Se ok, esporta quella collection da staging e importala in prod con override — oppure, se minimal, duplica manualmente i documenti chiave.

### Scenario B — Perdita totale del database

1. **Dichiara incidente**: aggiorna `docs/40_Daily/` con timestamp e impatto.
2. **Metti il sito in manutenzione** (Firebase Hosting: `firebase hosting:channel:deploy maintenance` oppure Vercel: cambia deploy attivo a pagina statica di manutenzione).
3. Importa il backup più recente:
   ```bash
   gcloud firestore import \
     gs://travelliniwithus-firestore-backups/firestore-backups/<timestamp_recente> \
     --project=travelliniwithus
   ```
4. Rigenera gli indici custom se necessario (controlla `firebase deploy --only firestore:indexes`).
5. Smoke test:
   - Homepage → 200, articoli caricano.
   - `/destinazioni` → lista visibile.
   - Login admin → accesso OK (custom claims preservate sì, sono in Auth non in Firestore).
   - Checkout Stripe con card test → ordine creato correttamente.
6. Rimuovi manutenzione e pubblica post-mortem entro 48h in `docs/14_Bugs/`.

### Scenario C — Rollback selettivo (es. bad deploy regole/codice)

- Bad deploy regole Firestore: `firebase deploy --only firestore:rules` con versione precedente da git (`git checkout <commit> -- firestore.rules && firebase deploy ...`).
- Bad deploy hosting: Firebase Hosting → Release history → Rollback al release precedente (1 click).
- Bad deploy codice server (Express): rollback su Vercel/hosting via UI; oppure `git revert HEAD && git push`.

## Monitoraggio e alert

- Settimanale: verifica che il job GitHub Actions sia verde (Actions tab → filter workflow).
- Mensile: `gcloud storage du -s gs://travelliniwithus-firestore-backups` per monitorare dimensioni e anomalie.
- Test restore trimestrale: una volta ogni 3 mesi, importa il backup più recente in progetto staging e conferma che i dati siano leggibili. Registra l'esito in `docs/40_Daily/` con tag `[dr-test]`.

## Chi fa cosa

| Azione | Owner | Frequenza |
|--------|-------|-----------|
| Eseguire workflow manuale dopo modifiche strutturali importanti | Rodrigo | On demand |
| Rivedere log workflow settimanale | Rodrigo | Ogni lunedì |
| Test restore su staging | Rodrigo | Trimestrale |
| Aggiornamento retention/lifecycle | Rodrigo | Annuale |

## Riferimenti

- Workflow: [.github/workflows/firestore-backup.yml](../.github/workflows/firestore-backup.yml)
- Docs ufficiali: https://firebase.google.com/docs/firestore/manage-data/export-import
- Security rules: [firestore.rules](../firestore.rules)
- Admin custom claims runbook: [DECISION_ADMIN_CUSTOM_CLAIMS.md](20_Decisions/DECISION_ADMIN_CUSTOM_CLAIMS.md)

---
name: deploy
description: Deploy the TRAVELLINIWITHUS site after mandatory preflight checks, build validation, Firebase Hosting checks, and release documentation updates.
agent: travellini-release-quality
---

# /deploy

Deploy the TRAVELLINIWITHUS site to production.

## Pre-flight (mandatory)

Run these checks first. If any FAIL, stop and report — do NOT deploy.

1. Run `npm run predeploy` — must complete with all PASS
2. Verify `dist/` exists and is not empty (`ls dist/` should show files)
3. Verify `.env` exists and has no placeholder values (check for `YOUR_KEY_HERE` patterns)

## Firebase Hosting setup check

Check if `firebase.json` exists at the repo root.

**If it does NOT exist**, do NOT run the deploy. Instead tell the user:

```
firebase.json non trovato. Prima di deployare:
1. Installa Firebase CLI: npm install -g firebase-tools
2. Accedi: firebase login
3. Inizializza hosting: firebase init hosting
   - Public directory: dist
   - Single-page app: Yes
   - Overwrite dist/index.html: No
4. Poi richiama /deploy
```

**If it exists**, proceed.

## Deploy steps

Run in this exact order:

```bash
npm run build
firebase deploy --only hosting
```

## Post-deploy

1. Note the Firebase Hosting URL from the output.
2. Open the URL and verify:
   - Homepage loads correctly
   - Navbar renders
   - No console errors
3. Update `docs/10_Projects/PROJECT_RELEASE_READINESS.md`:
   - Mark "verificare build e smoke test" as done
   - Add deploy date and URL
4. If this is a significant release, create a release note from `docs/90_Templates/TPL_Release_Note.md`

## Output

Report: deployed URL, timestamp, and any warnings from Firebase CLI.

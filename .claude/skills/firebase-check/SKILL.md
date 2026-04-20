---
name: firebase-check
description: Audit Firebase and Firestore usage in TRAVELLINIWITHUS for published filters, timestamps, limits, error handling, security rules, and client-side safety.
agent: travellini-quality-auditor
---

# /firebase-check

Audit Firebase/Firestore usage in the TRAVELLINIWITHUS project.

## What to check

1. **Published Filter** — Every public-facing query on `articles` and `products` collections MUST include `where('published', '==', true)`. Check `src/services/firebaseService.ts` and any other file that queries Firestore.

2. **Timestamps** — All `setDoc`, `addDoc`, `updateDoc` calls must use `serverTimestamp()` for `createdAt` and `updatedAt` fields. Flag any `new Date()` or `Date.now()` usage for these fields.

3. **Query Limits** — All `getDocs` queries should include `limit()` to prevent unbounded reads. Flag queries without limits.

4. **Error Handling** — Firestore operations must have proper try/catch with meaningful error messages. Flag any swallowed errors or missing catch blocks.

5. **Security Rules Alignment** — Read `firestore.rules` and verify that:
   - Public reads require `published == true`
   - Writes to `leads` allow anonymous
   - Admin operations check auth + role
   - No overly permissive rules (`allow read, write: if true`)

6. **Client-Side Safety** — Verify no Firebase config, API keys, or admin credentials are exposed in client-side code (check for hardcoded strings in `src/`).

7. **Index Requirements** — Check if queries use compound `where` + `orderBy` that would require composite indexes. List any that might need manual index creation.

## Output

Report findings with file paths, line numbers, and severity. Group by category.

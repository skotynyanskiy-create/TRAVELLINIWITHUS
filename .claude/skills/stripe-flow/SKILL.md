# /stripe-flow

Audit and verify the Stripe checkout flow in the TRAVELLINIWITHUS project.

## What to check

1. **Cart → Checkout Flow** — Trace the complete flow:
   - `CartContext` adds items to cart
   - Cart drawer shows items and total
   - Checkout button calls `/api/checkout` endpoint
   - `server.ts` creates Stripe session
   - Stripe redirects back to success/cancel URL
   - Order is saved in Firestore `orders` collection

2. **Server-Side Security** — In `server.ts`:
   - Stripe secret key loaded from env, never hardcoded
   - Webhook signature verification with `stripe.webhooks.constructEvent`
   - Rate limiting on checkout endpoint
   - CORS configured correctly

3. **Price Integrity** — Verify that product prices come from Firestore (server-side), not from client-submitted data. The client should send product IDs, not prices.

4. **Error Handling** — Check for:
   - Failed payment handling
   - Network error recovery
   - Duplicate order prevention
   - User feedback on success/failure

5. **Environment Variables** — Verify `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY` are:
   - Loaded from `.env` (not hardcoded)
   - Not exposed in client bundle (only `VITE_` prefixed vars are client-safe)
   - `ALLOW_MOCK_CHECKOUT` flag works correctly for dev

6. **Webhook Handling** — Verify the Stripe webhook endpoint:
   - Handles `checkout.session.completed` event
   - Creates order in Firestore with correct data
   - Returns 200 to Stripe after processing

## Output

Report the flow status (working/broken/partial) with specific issues found. Include file paths and line numbers.

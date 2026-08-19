import { BRAND_STATS, CONTACTS, SITE_URL } from '../config/site';

type EmailAddress = string | { name?: string; email: string };

export interface SendEmailInput {
  to: EmailAddress | EmailAddress[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  from?: string;
  tags?: { name: string; value: string }[];
}

export interface SendEmailResult {
  ok: boolean;
  skipped?: boolean;
  reason?: string;
  id?: string;
  status?: number;
}

const DEFAULT_FROM = 'Travelliniwithus <hello@travelliniwithus.it>';

function normalizeRecipient(addr: EmailAddress): string {
  if (typeof addr === 'string') return addr;
  return addr.name ? `${addr.name} <${addr.email}>` : addr.email;
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // L'avviso vale anche in produzione. Prima era dietro NODE_ENV, e nel
    // runtime delle Cloud Functions NODE_ENV e' 'production': ogni email
    // saltata spariva senza lasciare traccia, indistinguibile da una inviata.
    console.warn(
      '[email] RESEND_API_KEY mancante — email NON inviata. ' + `Subject: "${input.subject}"`
    );
    return { ok: false, skipped: true, reason: 'missing-api-key' };
  }

  const recipients = Array.isArray(input.to) ? input.to : [input.to];
  const body = {
    from: input.from || process.env.MAIL_FROM || DEFAULT_FROM,
    to: recipients.map(normalizeRecipient),
    subject: input.subject,
    html: input.html,
    text: input.text,
    reply_to: input.replyTo,
    tags: input.tags,
  };

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      console.error('[email] Resend error', response.status, errorText);
      return { ok: false, status: response.status, reason: errorText };
    }

    const data = (await response.json().catch(() => ({}))) as { id?: string };
    return { ok: true, id: data.id, status: response.status };
  } catch (err) {
    console.error('[email] Resend request failed', err);
    return { ok: false, reason: err instanceof Error ? err.message : 'unknown' };
  }
}

export function renderContactNotification(lead: {
  name: string;
  email: string;
  topic?: string;
  message: string;
}): Pick<SendEmailInput, 'subject' | 'html' | 'text'> {
  const subject = `Nuovo contatto${lead.topic ? ` — ${lead.topic}` : ''}: ${lead.name}`;
  const html = `
    <div style="font-family:system-ui,sans-serif;color:#111;">
      <h2 style="margin:0 0 12px;">Nuovo contatto dal sito</h2>
      <p><strong>Nome:</strong> ${escapeHtml(lead.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(lead.email)}</p>
      ${lead.topic ? `<p><strong>Topic:</strong> ${escapeHtml(lead.topic)}</p>` : ''}
      <p><strong>Messaggio:</strong></p>
      <div style="white-space:pre-wrap;border-left:3px solid #C4A47C;padding-left:12px;color:#333;">${escapeHtml(
        lead.message
      )}</div>
    </div>
  `;
  const text = `Nuovo contatto dal sito\nNome: ${lead.name}\nEmail: ${lead.email}\n${
    lead.topic ? `Topic: ${lead.topic}\n` : ''
  }\n${lead.message}`;
  return { subject, html, text };
}

export function renderContactAutoReply(lead: {
  name: string;
}): Pick<SendEmailInput, 'subject' | 'html' | 'text'> {
  const subject = 'Abbiamo ricevuto il tuo messaggio — Travelliniwithus';
  const html = `
    <div style="font-family:system-ui,sans-serif;color:#111;line-height:1.6;">
      <p>Ciao ${escapeHtml(lead.name)},</p>
      <p>Grazie per averci scritto. Leggiamo ogni messaggio personalmente e rispondiamo entro 48 ore (giorni feriali).</p>
      <p>Nel frattempo, se vuoi scoprire i posti particolari che stiamo raccontando in questi giorni:</p>
      <p><a href="https://travelliniwithus.it/esplora" style="color:#C4A47C;">Esplora le destinazioni</a></p>
      <p>A presto,<br/>Rodrigo &amp; Betta</p>
    </div>
  `;
  const text = `Ciao ${lead.name},\n\nGrazie per averci scritto. Leggiamo ogni messaggio personalmente e rispondiamo entro 48 ore.\n\nA presto,\nRodrigo & Betta`;
  return { subject, html, text };
}

export function renderMediaKitNotification(lead: {
  company: string;
  email: string;
  website?: string;
  focus?: string;
  brief?: string;
  budget?: string;
  period?: string;
}): Pick<SendEmailInput, 'subject' | 'html' | 'text'> {
  const subject = `Richiesta media kit — ${lead.company}`;
  const html = `
    <div style="font-family:system-ui,sans-serif;color:#111;">
      <h2 style="margin:0 0 12px;">Nuova richiesta media kit</h2>
      <p><strong>Azienda:</strong> ${escapeHtml(lead.company)}</p>
      <p><strong>Email:</strong> ${escapeHtml(lead.email)}</p>
      ${lead.website ? `<p><strong>Sito/Profilo:</strong> ${escapeHtml(lead.website)}</p>` : ''}
      ${lead.focus ? `<p><strong>Focus:</strong> ${escapeHtml(lead.focus)}</p>` : ''}
      ${lead.budget ? `<p><strong>Budget:</strong> ${escapeHtml(lead.budget)}</p>` : ''}
      ${lead.period ? `<p><strong>Periodo:</strong> ${escapeHtml(lead.period)}</p>` : ''}
      ${lead.brief ? `<p><strong>Brief:</strong></p><div style="white-space:pre-wrap;border-left:3px solid #C4A47C;padding-left:12px;color:#333;">${escapeHtml(lead.brief)}</div>` : ''}
    </div>
  `;
  const text = `Richiesta media kit\nAzienda: ${lead.company}\nEmail: ${lead.email}${lead.website ? `\nSito: ${lead.website}` : ''}${lead.focus ? `\nFocus: ${lead.focus}` : ''}${lead.budget ? `\nBudget: ${lead.budget}` : ''}${lead.period ? `\nPeriodo: ${lead.period}` : ''}\n\nBrief:\n${lead.brief || ''}`;
  return { subject, html, text };
}

export function renderMediaKitAutoReply(lead: {
  company: string;
  mediaKitUrl: string;
}): Pick<SendEmailInput, 'subject' | 'html' | 'text'> {
  const subject = 'Il tuo media kit Travelliniwithus';
  const html = `
    <div style="font-family:system-ui,sans-serif;color:#111;line-height:1.6;">
      <p>Ciao ${escapeHtml(lead.company)},</p>
      <p>Grazie per il tuo interesse. In allegato il link al nostro media kit:</p>
      <p><a href="${lead.mediaKitUrl}" style="color:#C4A47C;">Scarica il media kit (PDF)</a></p>
      <p>Se vuoi approfondire una collaborazione, rispondi direttamente a questa email con un breve brief del progetto e ti risponderemo entro 48 ore.</p>
      <p>A presto,<br/>Rodrigo &amp; Betta</p>
    </div>
  `;
  const text = `Ciao,\n\nGrazie per il tuo interesse. Scarica il media kit: ${lead.mediaKitUrl}\n\nA presto,\nRodrigo & Betta`;
  return { subject, html, text };
}

export function renderWelcomeEmail(input: {
  source?: string;
  leadMagnetUrl?: string;
}): Pick<SendEmailInput, 'subject' | 'html' | 'text'> {
  const subject = 'Benvenuta nella lista di chi viaggia con criterio';
  const leadMagnetBlock = input.leadMagnetUrl
    ? `
      <p style="margin:24px 0;">
        Come promesso, qui trovi <strong>Alla scoperta dell’Italia nascosta</strong>: 10 posti
        provati e consigliati da noi, da salvare per il prossimo viaggio in coppia:
      </p>
      <p style="margin:0 0 32px;">
        <a href="${input.leadMagnetUrl}" style="display:inline-block;background:#ea580c;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
          Scarica la guida (PDF)
        </a>
      </p>
    `
    : '';
  const html = `
    <div style="font-family:system-ui,sans-serif;color:#0a0a0a;line-height:1.6;max-width:560px;">
      <p style="font-size:18px;margin:0 0 16px;">Ciao,</p>
      <p style="margin:0 0 16px;">
        Sei nella lista di chi viaggia con criterio. Niente automazione cieca:
        ti scriviamo solo quando c'è qualcosa di davvero utile da salvare —
        guide pratiche, posti particolari, scelte ragionate.
      </p>
      ${leadMagnetBlock}
      <p style="margin:0 0 16px;">
        Intanto, se ti va, ci trovi qui:
      </p>
      <p style="margin:0 0 24px;">
        &middot; <a href="${CONTACTS.instagramUrl}" style="color:#9a3412;">Instagram</a> (${BRAND_STATS.instagramFollowers} travellini)<br/>
        &middot; <a href="${CONTACTS.tiktokUrl}" style="color:#9a3412;">TikTok</a> (${BRAND_STATS.tiktokFollowers})<br/>
        &middot; <a href="${SITE_URL}/esplora" style="color:#9a3412;">Posti raccontati bene</a> sul sito
      </p>
      <p style="margin:24px 0 0;color:#57534e;font-size:14px;">
        P.S. Se hai 30 secondi: rispondi a questa email con la prossima destinazione che hai in mente. Leggiamo davvero, non c'è un bot.
      </p>
      <p style="margin:32px 0 0;">
        A presto,<br/>
        <span style="font-family:'Fraunces',serif;font-style:italic;color:#ea580c;font-size:18px;">Rodrigo &amp; Betta</span>
      </p>
    </div>
  `;
  const text = `Ciao,

Sei nella lista di chi viaggia con criterio. Niente automazione cieca:
ti scriviamo solo quando c'è qualcosa di davvero utile da salvare.
${input.leadMagnetUrl ? `\nScarica la guida "Alla scoperta dell’Italia nascosta" (10 posti provati e consigliati da noi): ${input.leadMagnetUrl}\n` : ''}
Intanto, se ti va, ci trovi qui:
- Instagram: ${CONTACTS.instagramUrl}
- TikTok: ${CONTACTS.tiktokUrl}
- Sito: ${SITE_URL}/esplora

P.S. Se hai 30 secondi: rispondi a questa email con la prossima destinazione che hai in mente. Leggiamo davvero, non c'è un bot.

A presto,
Rodrigo & Betta`;
  return { subject, html, text };
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export function renderOrderConfirmation(input: {
  customerName?: string;
  orderId: string;
  total: number;
  items: OrderItem[];
  isDigital?: boolean;
}): Pick<SendEmailInput, 'subject' | 'html' | 'text'> {
  const subject = `Ordine confermato — Travelliniwithus #${input.orderId.slice(0, 8)}`;
  const itemsHtml = input.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 0;color:#0a0a0a;">${escapeHtml(item.name)}</td>
          <td style="padding:8px 0;color:#57534e;text-align:right;">${item.quantity}&times;</td>
          <td style="padding:8px 0;color:#0a0a0a;text-align:right;">EUR ${item.price.toFixed(2)}</td>
        </tr>`
    )
    .join('');
  const greeting = input.customerName ? `Ciao ${escapeHtml(input.customerName)},` : 'Ciao,';
  const html = `
    <div style="font-family:system-ui,sans-serif;color:#0a0a0a;line-height:1.6;max-width:560px;">
      <p style="font-size:18px;margin:0 0 16px;">${greeting}</p>
      <p style="margin:0 0 24px;">
        Grazie. Il tuo ordine e stato ricevuto e confermato.
        ${input.isDigital ? 'I contenuti digitali sono disponibili al link qui sotto.' : 'Lo preparerai con cura entro 48 ore lavorative.'}
      </p>
      <table style="width:100%;border-collapse:collapse;margin:24px 0;border-top:1px solid #e7e5e4;border-bottom:1px solid #e7e5e4;">
        ${itemsHtml}
        <tr style="border-top:1px solid #e7e5e4;">
          <td colspan="2" style="padding:12px 0;color:#0a0a0a;font-weight:600;">Totale</td>
          <td style="padding:12px 0;color:#ea580c;font-weight:600;text-align:right;font-size:18px;">EUR ${input.total.toFixed(2)}</td>
        </tr>
      </table>
      <p style="margin:0 0 16px;color:#57534e;font-size:14px;">
        Ordine #${escapeHtml(input.orderId)}
      </p>
      <p style="margin:24px 0 16px;">
        Se hai domande sull'ordine, puoi rispondere direttamente a questa email.
      </p>
      <p style="margin:32px 0 0;">
        A presto,<br/>
        <span style="font-family:'Fraunces',serif;font-style:italic;color:#ea580c;font-size:18px;">Rodrigo &amp; Betta</span>
      </p>
    </div>
  `;
  const itemsText = input.items
    .map((item) => `  - ${item.name} (${item.quantity}x) EUR ${item.price.toFixed(2)}`)
    .join('\n');
  const text = `${greeting}

Grazie. Il tuo ordine e stato ricevuto e confermato.

Ordine #${input.orderId}
${itemsText}

Totale: EUR ${input.total.toFixed(2)}

Se hai domande sull'ordine, puoi rispondere direttamente a questa email.

A presto,
Rodrigo & Betta`;
  return { subject, html, text };
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

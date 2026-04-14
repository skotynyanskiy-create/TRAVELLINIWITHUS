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
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        '[email] RESEND_API_KEY mancante — email skipped (predisposizione mode). ' +
          `Subject: "${input.subject}"`,
      );
    }
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
        lead.message,
      )}</div>
    </div>
  `;
  const text = `Nuovo contatto dal sito\nNome: ${lead.name}\nEmail: ${lead.email}\n${
    lead.topic ? `Topic: ${lead.topic}\n` : ''
  }\n${lead.message}`;
  return { subject, html, text };
}

export function renderContactAutoReply(lead: { name: string }): Pick<SendEmailInput, 'subject' | 'html' | 'text'> {
  const subject = 'Abbiamo ricevuto il tuo messaggio — Travelliniwithus';
  const html = `
    <div style="font-family:system-ui,sans-serif;color:#111;line-height:1.6;">
      <p>Ciao ${escapeHtml(lead.name)},</p>
      <p>Grazie per averci scritto. Leggiamo ogni messaggio personalmente e rispondiamo entro 48 ore (giorni feriali).</p>
      <p>Nel frattempo, se vuoi scoprire i posti particolari che stiamo raccontando in questi giorni:</p>
      <p><a href="https://travelliniwithus.it/destinazioni" style="color:#C4A47C;">Esplora le destinazioni</a></p>
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
}): Pick<SendEmailInput, 'subject' | 'html' | 'text'> {
  const subject = `Richiesta media kit — ${lead.company}`;
  const html = `
    <div style="font-family:system-ui,sans-serif;color:#111;">
      <h2 style="margin:0 0 12px;">Nuova richiesta media kit</h2>
      <p><strong>Azienda:</strong> ${escapeHtml(lead.company)}</p>
      <p><strong>Email:</strong> ${escapeHtml(lead.email)}</p>
      ${lead.website ? `<p><strong>Website:</strong> ${escapeHtml(lead.website)}</p>` : ''}
      ${lead.focus ? `<p><strong>Focus:</strong> ${escapeHtml(lead.focus)}</p>` : ''}
      ${lead.brief ? `<p><strong>Brief:</strong></p><div style="white-space:pre-wrap;">${escapeHtml(lead.brief)}</div>` : ''}
    </div>
  `;
  const text = `Media kit request\nAzienda: ${lead.company}\nEmail: ${lead.email}`;
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

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

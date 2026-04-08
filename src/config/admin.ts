const ADMIN_EMAILS = ['skotynyanskiy@gmail.com'];

export function isAdminEmail(email?: string | null) {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

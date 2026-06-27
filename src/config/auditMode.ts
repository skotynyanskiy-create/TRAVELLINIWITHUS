export function isAuditMode() {
  if (import.meta.env.VITE_TWU_AUDIT_MODE === 'true') {
    return true;
  }

  if (typeof window === 'undefined') {
    return false;
  }

  return new URLSearchParams(window.location.search).has('twu_audit');
}

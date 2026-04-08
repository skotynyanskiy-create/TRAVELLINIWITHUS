export const DEMO_CONTENT_ENABLED =
  import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEMO_CONTENT === 'true';

export const REMOTE_MONITORING_ENABLED =
  import.meta.env.PROD || import.meta.env.VITE_ENABLE_REMOTE_MONITORING === 'true';

const requiredServer = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE',
  'OPENAI_API_KEY',
  'OPENAI_MODEL'
];

export function requireServerEnv() {
  const missing = requiredServer.filter((key) => !process.env[key]);
  if (missing.length) {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      console.warn(`Missing env during build: ${missing.join(', ')}`);
      return;
    }
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing env: ${missing.join(', ')}`);
    }
    console.warn(`Missing env: ${missing.join(', ')}`);
  }
}

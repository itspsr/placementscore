const requiredServer = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE'
];

export function requireServerEnv() {
  const missing = requiredServer.filter((key) => !process.env[key]);
  if (missing.length) {
    // During build, Vercel sets NODE_ENV=production.
    // We should only throw if it's actually RUNNING, not BUILDING.
    // Next.js sets NEXT_PHASE during build.
    if (process.env.NEXT_PHASE === 'phase-production-build' || process.env.CI === 'true') {
      console.warn(`Missing env during build: ${missing.join(', ')}`);
      return;
    }
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing env: ${missing.join(', ')}`);
    }
    console.warn(`Missing env: ${missing.join(', ')}`);
  }
}

const requiredServer = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE'
];

export function requireServerEnv() {
  const missing = requiredServer.filter((key) => !process.env[key]);
  if (missing.length) {
    // Check various ways build phase is signaled
    const isBuild = 
      process.env.NEXT_PHASE === 'phase-production-build' || 
      process.env.CI === 'true' || 
      process.env.VERCEL === '1' ||
      process.env.NODE_ENV === 'test';

    if (isBuild) {
      console.warn(`Missing env during build: ${missing.join(', ')}`);
      return;
    }
    
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing env: ${missing.join(', ')}`);
    }
    console.warn(`Missing env: ${missing.join(', ')}`);
  }
}

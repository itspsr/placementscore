const requiredServer = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE'
];

export function requireServerEnv() {
  const missing = requiredServer.filter((key) => !process.env[key]);
  if (missing.length) {
    // Extensive build detection to prevent build crashes
    const isBuild = 
      process.env.NEXT_PHASE === 'phase-production-build' || 
      process.env.CI === 'true' || 
      process.env.VERCEL === '1' ||
      process.env.GITHUB_ACTIONS === 'true' ||
      process.env.NODE_ENV === 'test' ||
      (process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL); // Vercel sets VERCEL_URL in runtime

    if (isBuild) {
      console.warn(`[Build Safety] Missing env vars: ${missing.join(', ')}`);
      return;
    }
    
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`CRITICAL: Missing environment variables: ${missing.join(', ')}`);
    }
    console.warn(`Warning: Missing env: ${missing.join(', ')}`);
  }
}

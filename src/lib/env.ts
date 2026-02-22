const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE',
  'OPENAI_API_KEY',
  'OPENAI_MODEL'
];

export function requireEnv() {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing env: ${missing.join(', ')}`);
    }
    console.warn(`Missing env: ${missing.join(', ')}`);
  }
}

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
);

async function checkBlogs() {
  const { data, error } = await supabase
    .from('blogs')
    .select('title, slug, created_at, published')
    .order('created_at', { ascending: false })
    .limit(15);

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Latest blogs in Supabase:');
    data.forEach(b => {
      console.log(`- [${b.published ? 'PUBLISHED' : 'DRAFT'}] ${b.created_at} | ${b.title} (${b.slug})`);
    });
  }
}

checkBlogs();

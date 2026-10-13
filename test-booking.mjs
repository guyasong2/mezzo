import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('URL configured:', !!url);
console.log('Service key configured:', !!serviceKey);
console.log('Anon key configured:', !!anonKey);
console.log();

// Test with anon key (what the book page uses)
const anonClient = createClient(url, anonKey);
const { data: anonPackages, error: anonError } = await anonClient
  .from('pricing_packages')
  .select('id, name, active')
  .eq('active', true);

console.log('=== ANON KEY (book page) ===');
console.log('Error:', anonError);
console.log('Packages:', JSON.stringify(anonPackages, null, 2));
console.log();

// Test with service role key (what the API route uses)
const adminClient = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

if (anonPackages && anonPackages.length > 0) {
  const testId = anonPackages[0].id;
  console.log('=== ADMIN KEY (API route) ===');
  console.log('Looking up package_id:', testId);

  const { data: pkgData, error: pkgError } = await adminClient
    .from('pricing_packages')
    .select('id, active')
    .eq('id', testId)
    .single();

  console.log('Result:', JSON.stringify(pkgData));
  console.log('Error:', JSON.stringify(pkgError));

  if (pkgError || !pkgData || !pkgData.active) {
    console.log('\n>>> THIS IS THE BUG: Admin client cannot find/read the package!');
    console.log('packageError:', !!pkgError);
    console.log('packageData:', !!pkgData);
    console.log('packageData.active:', pkgData?.active);
  } else {
    console.log('\n>>> Admin client CAN read the package. Bug is elsewhere.');
  }
} else {
  console.log('No packages found with anon key either — check RLS or data.');
}

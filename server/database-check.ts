import { createExpressClient } from './lib/supabase.js';

export async function testDatabaseConnection(): Promise<boolean> {
  try {
    console.log('🔍 Testing database connection...');
    
    // Check environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('❌ Missing Supabase environment variables');
      console.error('   NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓' : '❌');
      console.error('   NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓' : '❌');
      return false;
    }

    const supabase = createExpressClient();
    
    // Test basic connection by trying to query a simple table
    const { data, error } = await supabase
      .from('settings')
      .select('key')
      .limit(1);

    if (error) {
      console.error('❌ Database connection failed:', error.message);
      console.error('   Make sure you have run the supabase-init.sql script');
      console.error('   Check your Supabase URL and API key');
      return false;
    }

    console.log('✅ Database connection successful');
    
    // Test if required tables exist
    const tables = ['users', 'dish_types', 'dishes', 'reservations', 'orders', 'messages'];
    console.log('🔍 Checking required tables...');
    
    for (const table of tables) {
      const { error: tableError } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (tableError) {
        console.error(`❌ Table '${table}' not accessible:`, tableError.message);
        return false;
      } else {
        console.log(`✅ Table '${table}' is accessible`);
      }
    }

    console.log('✅ All required tables are accessible');
    return true;
    
  } catch (error) {
    console.error('❌ Unexpected database connection error:', error);
    return false;
  }
}

export async function ensureDatabaseReady(): Promise<void> {
  const maxRetries = 3;
  let retries = 0;
  
  while (retries < maxRetries) {
    const connected = await testDatabaseConnection();
    
    if (connected) {
      return;
    }
    
    retries++;
    if (retries < maxRetries) {
      console.log(`🔄 Retrying database connection in 2 seconds... (${retries}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.error('❌ Could not establish database connection after multiple attempts');
  console.error('🚨 STARTUP ABORTED: Database connection required');
  console.error('');
  console.error('📋 Please check:');
  console.error('   1. Supabase project is running');
  console.error('   2. Environment variables are correct in .env file');
  console.error('   3. supabase-init.sql script has been executed');
  console.error('   4. Network connectivity to Supabase');
  console.error('');
  
  process.exit(1);
}

import { createExpressClient } from './server/lib/supabase.js';
import 'dotenv/config';

async function testAuth() {
  console.log('🔍 Testing Supabase authentication...');
  
  const supabase = createExpressClient();
  
  // Check if admin user exists in users table
  console.log('📊 Checking users table...');
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('*')
    .eq('email', 'admin@assouan-fes.com');
  
  if (usersError) {
    console.error('❌ Error checking users table:', usersError.message);
    return;
  }
  
  console.log('👤 Users found in database:', users);
  
  // Try to sign in with the admin credentials
  console.log('🔐 Testing authentication...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@assouan-fes.com',
    password: 'password123' // Try common passwords
  });
  
  if (authError) {
    console.error('❌ Authentication error:', authError.message);
    console.error('💡 This means the user exists in the users table but not in Supabase Auth');
  } else {
    console.log('✅ Authentication successful:', authData.user?.email);
  }
  
  // List all auth users (this might not work with anon key)
  console.log('👥 Checking auth users...');
  const { data: authUsers, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.error('❌ Cannot list auth users with anon key:', listError.message);
  } else {
    console.log('📋 Auth users:', authUsers.users.map(u => ({ id: u.id, email: u.email })));
  }
}

testAuth().catch(console.error);

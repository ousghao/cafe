@echo off
echo Building application with environment variables...

REM Load environment variables
set NODE_ENV=production
set VITE_SUPABASE_URL=https://szqenlopnbjshiachmlh.supabase.co
set VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6cWVubG9wbmJqc2hpYWNobWxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MjM1MzcsImV4cCI6MjA2NzI5OTUzN30.8fjswRq5n08rqIDiE4LbJs6J72uy6gerNdKET2xUtgM

echo VITE_SUPABASE_URL=%VITE_SUPABASE_URL%
echo Building frontend...
vite build
echo Building server...
esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist
echo Build complete!

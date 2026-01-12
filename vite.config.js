import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify('https://ullfdkgxjseubwjigdhb.supabase.co'),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsbGZka2d4anNldWJ3amlnZGhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5NTE3NDIsImV4cCI6MjA4MzUyNzc0Mn0.FfhCScs5wvPOw0JhuqUFqiskxgnLf-j1H6z9kyu_ipo'),
  },
})
const SUPABASE_URL = "https://sdakvoeythnbfqfgupzf.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkYWt2b2V5dGhuYmZxZmd1cHpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxMDA1MjksImV4cCI6MjA5MzY3NjUyOX0.U13KCcwWUTStp1-k8at9CudflI66uJ8YhMzSErQAlrM";

export const ServiceSupabase = {
    client: function(){
      return window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
}

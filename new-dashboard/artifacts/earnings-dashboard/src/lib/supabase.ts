// Simple Supabase client without SDK
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase env vars:', { supabaseUrl: !!supabaseUrl, supabaseKey: !!supabaseKey });
  throw new Error('Missing Supabase environment variables');
}

console.log('Supabase client initialized:', { url: supabaseUrl });

export const supabase = {
  auth: {
    async signInWithPassword({ email, password }: { email: string; password: string }) {
      console.log('Attempting login...');
      const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Login response:', { ok: response.ok, status: response.status });

      if (!response.ok) {
        console.error('Login failed:', data);
        return { data: null, error: data };
      }

      // Store session
      localStorage.setItem('sb-auth-token', JSON.stringify(data));
      console.log('Session stored');
      return { data, error: null };
    },

    async getSession() {
      const stored = localStorage.getItem('sb-auth-token');
      console.log('Getting session:', { hasStored: !!stored });

      if (!stored) return { data: { session: null } };

      try {
        const session = JSON.parse(stored);
        // Check if token is expired
        if (session.expires_at && new Date(session.expires_at * 1000) < new Date()) {
          console.log('Session expired');
          localStorage.removeItem('sb-auth-token');
          return { data: { session: null } };
        }
        console.log('Session valid');
        return { data: { session } };
      } catch (err) {
        console.error('Session parse error:', err);
        return { data: { session: null } };
      }
    },

    async signOut() {
      console.log('Signing out');
      localStorage.removeItem('sb-auth-token');
      return { error: null };
    },
  },

  from(table: string) {
    const stored = localStorage.getItem('sb-auth-token');
    const session = stored ? JSON.parse(stored) : null;

    return {
      select(columns: string) {
        return {
          eq(column: string, value: any) {
            return {
              eq(column2: string, value2: any) {
                return {
                  async maybeSingle() {
                    if (!session) {
                      console.log('No session for query');
                      return { data: null, error: null };
                    }

                    console.log('Querying:', { table, column, value, column2, value2 });
                    const response = await fetch(
                      `${supabaseUrl}/rest/v1/${table}?${column}=eq.${value}&${column2}=eq.${value2}&select=${columns}`,
                      {
                        headers: {
                          'apikey': supabaseKey,
                          'Authorization': `Bearer ${session.access_token}`,
                        },
                      }
                    );

                    const data = await response.json();
                    console.log('Query response:', { ok: response.ok, data });
                    return { data: data[0] || null, error: null };
                  },
                };
              },
              async maybeSingle() {
                if (!session) {
                  console.log('No session for query');
                  return { data: null, error: null };
                }

                console.log('Querying:', { table, column, value });
                const response = await fetch(
                  `${supabaseUrl}/rest/v1/${table}?${column}=eq.${value}&select=${columns}`,
                  {
                    headers: {
                      'apikey': supabaseKey,
                      'Authorization': `Bearer ${session.access_token}`,
                    },
                  }
                );

                const data = await response.json();
                console.log('Query response:', { ok: response.ok, data });
                return { data: data[0] || null, error: null };
              },
            };
          },
        };
      },
    };
  },
};


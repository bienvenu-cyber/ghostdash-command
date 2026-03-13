import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface LoginModalProps {
  open: boolean;
  onSuccess: () => void;
}

export default function LoginModal({ open, onSuccess }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Check if user has active subscription
      const { data: subData, error: subError } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', data.user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (subError) {
        console.error('Subscription check error:', subError);
      }

      if (!subData) {
        setError('No active subscription found. Please subscribe first.');
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      // Success
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000002] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" />
      <div className="bg-card rounded-xl shadow-2xl w-full max-w-md relative z-10 border border-border">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-foreground">Sign In</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full border border-border rounded-lg px-4 py-3 text-sm bg-background text-foreground outline-none focus:border-primary transition-colors disabled:opacity-50"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full border border-border rounded-lg px-4 py-3 text-sm bg-background text-foreground outline-none focus:border-primary transition-colors disabled:opacity-50"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 text-sm font-bold uppercase tracking-wide rounded-full transition-colors flex items-center justify-center gap-2 ${
                loading
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-primary hover:bg-primary/90 text-white'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-6">
            Don't have an account?{' '}
            <a href="/" className="text-primary hover:underline">
              Go to Ghostdash
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

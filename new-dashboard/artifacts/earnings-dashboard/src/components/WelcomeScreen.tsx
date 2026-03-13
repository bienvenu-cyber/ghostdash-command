import React from 'react';
import { LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface WelcomeScreenProps {
  loginDate: string;
  onContinue: () => void;
}

export default function WelcomeScreen({ loginDate, onContinue }: WelcomeScreenProps) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const formatLoginDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-[10000002] flex items-center justify-center p-4 bg-background">
      <div className="bg-card rounded-xl shadow-2xl w-full max-w-md border border-border p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <svg className="w-10 h-10" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
              <path className="fill-primary" d="M137.5,75a125,125,0,1,0,125,125A125,125,0,0,0,137.5,75Zm0,162.5A37.5,37.5,0,1,1,175,200,37.45,37.45,0,0,1,137.5,237.5Z" />
              <path className="fill-primary/80" d="M278,168.75c31.76,9.14,69.25,0,69.25,0-10.88,47.5-45.38,77.25-95.13,80.87A124.73,124.73,0,0,1,137.5,325L175,205.81C213.55,83.3,233.31,75,324.73,75H387.5C377,121.25,340.81,156.58,278,168.75Z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h2>
          <p className="text-sm text-muted-foreground">
            Already connected since
          </p>
          <p className="text-sm font-medium text-foreground mt-1">
            {formatLoginDate(loginDate)}
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onContinue}
            className="w-full bg-primary hover:bg-primary/90 text-white rounded-full py-3 font-bold text-sm uppercase tracking-wide transition-colors"
          >
            Access Dashboard
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full border border-border hover:border-foreground text-muted-foreground hover:text-foreground rounded-full py-3 font-medium text-sm transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

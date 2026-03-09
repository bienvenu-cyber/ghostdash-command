import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Ghost, ExternalLink, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const { user, signOut, isAdmin } = useAuth();
  const [subStatus, setSubStatus] = useState<string>("pending");

  useEffect(() => {
    if (!user) return;
    supabase.from("subscriptions").select("status").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).single()
      .then(({ data }) => {
        if (data) setSubStatus(data.status);
      });
  }, [user]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border/30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Ghost className="h-6 w-6 text-primary" />
          <span className="font-bold tracking-tight-custom">Ghost<span className="text-primary">dash</span></span>
        </div>
        <div className="flex items-center gap-4">
          {isAdmin && (
            <Button asChild variant="ghost" size="sm">
              <Link to="/admin">Admin Panel</Link>
            </Button>
          )}
          <span className="text-sm text-muted-foreground hidden sm:block">{user?.email}</span>
          <Button variant="ghost" size="icon" onClick={signOut}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-lg">
          <Ghost className="h-16 w-16 text-primary mx-auto mb-6 animate-glow-pulse" />
          <h1 className="text-3xl md:text-4xl font-black tracking-tight-custom text-foreground mb-4">
            Your Dashboard
          </h1>

          {subStatus === "active" ? (
            <>
              <p className="text-muted-foreground mb-8">
                Your access is active. Click below to open your fully customizable OnlyFans dashboard.
              </p>
              <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 px-10 py-6 text-lg font-semibold glow-blue">
                <a href="https://your-editable-dashboard-link.com" target="_blank" rel="noopener noreferrer">
                  Access My Custom Dashboard <ExternalLink className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </>
          ) : (
            <>
              <p className="text-muted-foreground mb-4">
                Your subscription is currently <span className="text-primary font-semibold">{subStatus}</span>.
              </p>
              <p className="text-sm text-muted-foreground/70 mb-8">
                Contact us on Telegram to complete your payment and activate your account within 24h.
              </p>
              <Button asChild variant="outline" size="lg" className="py-6 px-8">
                <a href="https://t.me/ghostdashadmin" target="_blank" rel="noopener noreferrer">
                  Contact on Telegram
                </a>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

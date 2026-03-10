import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ghost, ExternalLink, LogOut, User, CreditCard, Settings, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { useAutoLogout } from "@/hooks/useAutoLogout";

const Dashboard = () => {
  const { user, signOut, isAdmin } = useAuth();
  const [subStatus, setSubStatus] = useState<string>("pending");
  const [subPlan, setSubPlan] = useState<string>("");

  // Auto logout after 30 minutes of inactivity
  useAutoLogout();

  useEffect(() => {
    if (!user) return;
    supabase.from("subscriptions").select("status").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).single()
      .then(({ data }) => {
        if (data) {
          setSubStatus(data.status);
        }
      });
  }, [user]);

  const handleOpenDashboard = () => {
    const dashboardUrl = import.meta.env.VITE_ONLYFANS_DASHBOARD_URL || "http://localhost:8484";
    window.open(dashboardUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border/30 px-6 py-4 bg-background/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="relative">
              <Ghost className="h-6 w-6 text-primary" />
              <div className="absolute inset-0 blur-xl bg-primary/30" />
            </div>
            <span className="font-bold tracking-tight-custom">Ghost<span className="text-primary">dash</span></span>
          </Link>
          <div className="flex items-center gap-4">
            {isAdmin && (
              <Button asChild variant="ghost" size="sm">
                <Link to="/admin">Admin Panel</Link>
              </Button>
            )}
            <span className="text-sm text-muted-foreground hidden sm:block">{user?.email}</span>
            <Button variant="ghost" size="icon" onClick={signOut} className="hover:text-destructive">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-black tracking-tight-custom text-foreground mb-3">
            Welcome to <span className="text-gradient">My Space</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your subscription and access your custom dashboards
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Subscription Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="p-6 bg-card/50 border-border hover:border-primary/30 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-foreground">Subscription</h3>
              </div>
              <div className="space-y-2">
                <Badge className={`${subStatus === "active" ? "bg-green-500/20 text-green-400 border-green-500/50" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"}`}>
                  {subStatus.toUpperCase()}
                </Badge>
              </div>
            </Card>
          </motion.div>

          {/* Account Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-6 bg-card/50 border-border hover:border-primary/30 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <User className="h-5 w-5 text-secondary" />
                </div>
                <h3 className="font-bold text-foreground">Account</h3>
              </div>
              <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
            </Card>
          </motion.div>

          {/* Quick Actions Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="p-6 bg-card/50 border-border hover:border-primary/30 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Settings className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-foreground">Quick Actions</h3>
              </div>
              <Button asChild variant="ghost" size="sm" className="w-full justify-start px-0 hover:text-primary">
                <Link to="/payment">Upgrade Plan</Link>
              </Button>
            </Card>
          </motion.div>
        </div>

        {/* Main Dashboard Access */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="p-8 md:p-12 bg-gradient-to-br from-card/80 to-card/40 border-primary/20 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">OnlyFans Dashboard</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-black tracking-tight-custom text-foreground mb-4">
                Your Custom Dashboard
              </h2>

              {subStatus === "active" ? (
                <>
                  <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Access your fully customizable OnlyFans dashboard. Edit earnings, subscribers, analytics, and export professional screenshots.
                  </p>
                  <Button onClick={handleOpenDashboard} size="lg" className="bg-secondary hover:bg-secondary/90 px-10 py-7 text-lg font-semibold glow-blue group">
                    Open Dashboard
                    <ExternalLink className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-muted-foreground mb-4">
                      Your subscription is currently <span className="text-yellow-400 font-semibold">{subStatus}</span>.
                    </p>
                    <p className="text-sm text-muted-foreground/70 mb-8 max-w-xl mx-auto">
                      Complete your payment via Telegram to activate your account within 24h and unlock full dashboard access.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button asChild variant="outline" size="lg" className="py-6 px-8 border-primary/30 hover:border-primary/50">
                        <a href="https://t.me/ghostdashadmin" target="_blank" rel="noopener noreferrer">
                          Contact on Telegram
                        </a>
                      </Button>
                      <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 py-6 px-8">
                        <Link to="/payment">
                          Complete Payment
                        </Link>
                      </Button>
                    </div>
                </>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Additional Info */}
        {subStatus === "active" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-muted-foreground">
              Need help? <a href="https://t.me/ghostdashadmin" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Contact support</a>
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

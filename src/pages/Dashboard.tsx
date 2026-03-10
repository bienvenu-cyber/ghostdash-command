import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Ghost, ExternalLink, LogOut, User, CreditCard, Sparkles, Calendar, Clock, Edit2, Check, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { useAutoLogout } from "@/hooks/useAutoLogout";
import { toast } from "sonner";
import { SEO } from "@/components/SEO";

interface SubscriptionData {
  status: string;
  amount: number;
  currency: string;
  expires_at: string | null;
  created_at: string;
}

const Dashboard = () => {
  const { user, signOut, isAdmin } = useAuth();
  const [subData, setSubData] = useState<SubscriptionData | null>(null);
  const [displayName, setDisplayName] = useState<string>("");
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState("");

  // Auto logout after 30 minutes of inactivity
  useAutoLogout();

  useEffect(() => {
    if (!user) return;
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    // Load subscription
    const { data: subData, error } = await supabase
      .from("subscriptions")
      .select("status, amount, currency, expires_at, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching subscription:', error);
    }
    setSubData(subData);

    // Load profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .single();

    if (profile) {
      setDisplayName(profile.display_name || "");
    }
  };

  const updateDisplayName = async () => {
    if (!user || !tempName.trim()) return;

    const { error } = await supabase
      .from("profiles")
      .update({ display_name: tempName.trim() })
      .eq("id", user.id);

    if (error) {
      toast.error("Failed to update name");
    } else {
      setDisplayName(tempName.trim());
      setEditingName(false);
      toast.success("Name updated!");
    }
  };

  const getDaysRemaining = () => {
    if (!subData?.expires_at) return null;
    const now = new Date();
    const expires = new Date(subData.expires_at);
    const diff = expires.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const daysRemaining = getDaysRemaining();

  const handleOpenDashboard = () => {
    const dashboardUrl = import.meta.env.VITE_DASHBOARD_URL || "http://localhost:8484";
    window.open(dashboardUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <SEO
        title="My Space — Ghostdash Dashboard"
        description="Manage your Ghostdash subscription and access your custom OnlyFans dashboard."
        noindex={true}
      />
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
          <div className="flex items-center gap-4 mb-3">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight-custom text-foreground">
              Welcome to <span className="text-gradient">My Space</span>
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Manage your subscription and access your custom dashboards
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border hover:border-primary/30 transition-all h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <User className="h-5 w-5 text-secondary" />
                </div>
                <h3 className="font-bold text-foreground">Profile</h3>
              </div>
              <div className="space-y-3">
                {editingName ? (
                  <div className="flex gap-2">
                    <Input
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      placeholder="Display name"
                      className="h-8 text-sm"
                      autoFocus
                    />
                    <Button size="sm" variant="ghost" onClick={updateDisplayName} className="h-8 w-8 p-0">
                      <Check className="h-4 w-4 text-green-500" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingName(false)} className="h-8 w-8 p-0">
                      <X className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{displayName || "No name set"}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setTempName(displayName);
                        setEditingName(true);
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Subscription Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border hover:border-primary/30 transition-all h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-foreground">Subscription</h3>
              </div>
              <div className="space-y-3">
                <Badge className={`${subData?.status === "active" ? "bg-green-500/20 text-green-400 border-green-500/50" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"}`}>
                  {subData?.status?.toUpperCase() || "PENDING"}
                </Badge>
                {subData && (
                  <>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Plan:</span>
                      <span className="font-medium">{subData.amount}€ {subData.amount >= 200 ? "Annual" : "Monthly"}</span>
                    </div>
                    {subData.expires_at && daysRemaining !== null && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className={`font-medium ${daysRemaining < 7 ? "text-yellow-400" : "text-muted-foreground"}`}>
                          {daysRemaining > 0 ? `${daysRemaining} days left` : "Expired"}
                        </span>
                      </div>
                    )}
                    {!subData.expires_at && subData.status === "active" && (
                      <div className="flex items-center gap-2 text-sm">
                        <Sparkles className="h-3 w-3 text-primary" />
                        <span className="text-primary font-medium">Lifetime Access</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Activity Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="md:col-span-2 lg:col-span-1"
          >
            <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border hover:border-primary/30 transition-all h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-foreground">Activity</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Member since</span>
                  <span className="font-medium">{user && new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                </div>
                {subData?.created_at && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subscribed</span>
                    <span className="font-medium">{new Date(subData.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Payment History Card (if has subscription) */}
        {subData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <Card className="p-6 bg-card/50 border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-foreground">Payment History</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{subData.amount}€ - {subData.amount >= 200 ? "Annual Plan" : "Monthly Plan"}</p>
                    <p className="text-xs text-muted-foreground">{new Date(subData.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <Badge variant={subData.status === "active" ? "default" : "secondary"}>
                    {subData.status}
                  </Badge>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Main Dashboard Access */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="p-8 md:p-12 bg-gradient-to-br from-card/80 to-card/40 border-primary/20 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />

            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">OnlyFans Dashboard</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-black tracking-tight-custom text-foreground mb-4">
                Your Custom Dashboard
              </h2>

              {subData?.status === "active" ? (
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
                      Your subscription is currently <span className="text-yellow-400 font-semibold">{subData?.status || "pending"}</span>.
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
        {subData?.status === "active" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
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

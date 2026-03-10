import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Ghost, LogOut, ArrowLeft, Check, X, Save, Search, Download, Calendar, Clock, TrendingUp, DollarSign, Users, CreditCard, Zap, Shield, Eye, Settings as SettingsIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { motion } from "framer-motion";

interface UserRow {
  id: string;
  email: string | null;
  display_name: string | null;
  created_at: string;
  sub_status: string;
  sub_id: string | null;
  sub_amount: number | null;
  sub_expires: string | null;
  sub_created: string | null;
  crypto_currency: string | null;
  crypto_tx_hash: string | null;
}

interface Stats {
  totalRevenue: number;
  activeUsers: number;
  pendingRequests: number;
  conversionRate: number;
  expiringThisWeek: number;
}

const Admin = () => {
  const { signOut } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [showScreenshot, setShowScreenshot] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [selectedPlanForActivation, setSelectedPlanForActivation] = useState<"monthly" | "annual">("monthly");
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    activeUsers: 0,
    pendingRequests: 0,
    conversionRate: 0,
    expiringThisWeek: 0,
  });

  // Settings
  const [telegramUsername, setTelegramUsername] = useState("");
  const [btcAddress, setBtcAddress] = useState("");
  const [ethAddress, setEthAddress] = useState("");
  const [usdtAddress, setUsdtAddress] = useState("");
  const [settingsId, setSettingsId] = useState<string | null>(null);

  const fetchUsers = async () => {
    const { data: profiles } = await supabase.from("profiles").select("id, email, display_name, created_at");
    if (!profiles) return;

    const { data: subs } = await supabase.from("subscriptions").select("id, user_id, status, amount, expires_at, created_at, crypto_currency, crypto_tx_hash");

    const mapped: UserRow[] = profiles.map((p) => {
      const sub = subs?.find((s) => s.user_id === p.id);
      return {
        id: p.id,
        email: p.email,
        display_name: p.display_name,
        created_at: p.created_at,
        sub_status: sub?.status || "none",
        sub_id: sub?.id || null,
        sub_amount: sub?.amount || null,
        sub_expires: sub?.expires_at || null,
        sub_created: sub?.created_at || null,
        crypto_currency: sub?.crypto_currency || null,
        crypto_tx_hash: sub?.crypto_tx_hash || null,
      };
    });

    setUsers(mapped);

    // Calculate stats
    const totalRevenue = subs?.reduce((sum, s) => s.status === 'active' ? sum + Number(s.amount) : sum, 0) || 0;
    const activeUsers = subs?.filter(s => s.status === 'active').length || 0;
    const pendingRequests = subs?.filter(s => s.status === 'pending').length || 0;
    const conversionRate = profiles.length > 0 ? (activeUsers / profiles.length) * 100 : 0;

    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
    const expiringThisWeek = subs?.filter(s =>
      s.status === 'active' &&
      s.expires_at &&
      new Date(s.expires_at) <= oneWeekFromNow &&
      new Date(s.expires_at) > new Date()
    ).length || 0;

    setStats({ totalRevenue, activeUsers, pendingRequests, conversionRate, expiringThisWeek });
    setLoading(false);
  };

  const fetchSettings = async () => {
    const { data } = await supabase.from("admin_settings").select("*").limit(1).single();
    if (data) {
      setSettingsId(data.id);
      setTelegramUsername(data.telegram_username || "");
      setBtcAddress(data.btc_address || "");
      setEthAddress(data.eth_address || "");
      setUsdtAddress(data.usdt_address || "");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchSettings();
  }, []);

  const toggleSubscription = async (userId: string, subId: string | null, currentStatus: string) => {
    console.log('[Admin] toggleSubscription called:', { userId, subId, currentStatus });

    // For activation, show modal to choose plan
    if (currentStatus !== "active") {
      console.log('[Admin] Status is not active, showing activation modal');
      const user = users.find(u => u.id === userId);
      console.log('[Admin] Found user for activation:', user);
      setSelectedUser(user || null);
      setShowActivateModal(true);
      return;
    }

    // For deactivation, just update status
    console.log('[Admin] Deactivating subscription:', subId);
    if (subId) {
      const { data, error } = await supabase.from("subscriptions").update({
        status: "inactive",
        expires_at: null
      }).eq("id", subId).select();

      if (error) {
        console.error('[Admin] Deactivation error:', error);
        toast.error(`Error: ${error.message}`);
      } else {
        console.log('[Admin] Deactivation success:', data);
        toast.success("Subscription deactivated");
        fetchUsers();
      }
    }
  };

  const activateSubscription = async () => {
    console.log('[Admin] ========== ACTIVATION STARTED ==========');

    if (!selectedUser) {
      console.error('[Admin] ❌ No user selected for activation');
      toast.error('No user selected');
      return;
    }

    console.log('[Admin] ✅ User selected:', {
      userId: selectedUser.id,
      email: selectedUser.email,
      plan: selectedPlanForActivation,
      existingSubId: selectedUser.sub_id,
      currentStatus: selectedUser.sub_status
    });

    const planConfig = {
      monthly: { amount: 79, days: 30 },
      annual: { amount: 474, days: 365 }
    };

    const config = planConfig[selectedPlanForActivation];
    const expiresAt = new Date(Date.now() + config.days * 24 * 60 * 60 * 1000).toISOString();

    console.log('[Admin] 📋 Plan configuration:', {
      selectedPlan: selectedPlanForActivation,
      amount: config.amount,
      days: config.days,
      expiresAt: expiresAt,
      expiresAtReadable: new Date(expiresAt).toLocaleString('fr-FR')
    });

    try {
      if (selectedUser.sub_id) {
        console.log('[Admin] 🔄 Updating existing subscription:', selectedUser.sub_id);
        console.log('[Admin] 📤 Sending UPDATE request with:', {
          status: "active",
          amount: config.amount,
          expires_at: expiresAt
        });

        const { data, error } = await supabase.from("subscriptions").update({
          status: "active",
          amount: config.amount,
          expires_at: expiresAt
        }).eq("id", selectedUser.sub_id).select();

        if (error) {
          console.error('[Admin] ❌ UPDATE ERROR:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          toast.error(`Error: ${error.message}`);
          return;
        }
        console.log('[Admin] ✅ UPDATE SUCCESS:', data);
        console.log('[Admin] 📊 Updated subscription data:', JSON.stringify(data, null, 2));
      } else {
        console.log('[Admin] ➕ Creating new subscription (no existing sub_id)');
        console.log('[Admin] 📤 Sending INSERT request with:', {
          user_id: selectedUser.id,
          status: "active",
          amount: config.amount,
          expires_at: expiresAt
        });

        const { data, error } = await supabase.from("subscriptions").insert({
          user_id: selectedUser.id,
          status: "active" as any,
          amount: config.amount,
          expires_at: expiresAt
        }).select();

        if (error) {
          console.error('[Admin] ❌ INSERT ERROR:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          toast.error(`Error: ${error.message}`);
          return;
        }
        console.log('[Admin] ✅ INSERT SUCCESS:', data);
        console.log('[Admin] 📊 New subscription data:', JSON.stringify(data, null, 2));
      }

      console.log('[Admin] 🎉 Activation completed successfully');
      toast.success(`${selectedPlanForActivation === "monthly" ? "Monthly" : "Annual"} subscription activated!`);

      console.log('[Admin] 🔄 Refreshing user list...');
      setShowActivateModal(false);
      setSelectedUser(null);
      await fetchUsers();
      console.log('[Admin] ✅ User list refreshed');
      console.log('[Admin] ========== ACTIVATION ENDED ==========');
    } catch (err) {
      console.error('[Admin] ❌ UNEXPECTED ERROR:', err);
      console.error('[Admin] Error stack:', err instanceof Error ? err.stack : 'No stack trace');
      toast.error('Unexpected error occurred');
    }
  };

  const renewSubscription = async (subId: string, currentAmount: number) => {
    console.log('[Admin] 🔄 Renewing subscription:', subId);
    const user = users.find(u => u.sub_id === subId);
    if (!user) {
      console.error('[Admin] ❌ User not found for renewal');
      return;
    }

    // Determine plan based on amount
    const isAnnual = currentAmount >= 400; // Annual is 474€
    const days = isAnnual ? 365 : 30;

    console.log('[Admin] 📋 Renewal plan:', { isAnnual, days, currentAmount });

    // Calculate new expiry from current expiry date (not today)
    const currentExpiry = user.sub_expires ? new Date(user.sub_expires) : new Date();
    const newExpiry = new Date(currentExpiry.getTime() + days * 24 * 60 * 60 * 1000);

    console.log('[Admin] 📅 Dates:', {
      currentExpiry: currentExpiry.toISOString(),
      newExpiry: newExpiry.toISOString(),
      daysAdded: days
    });

    const { data, error } = await supabase.from('subscriptions').update({
      expires_at: newExpiry.toISOString(),
      status: 'active'
    }).eq('id', subId).select();

    if (error) {
      console.error('[Admin] ❌ Renewal error:', error);
      toast.error('Erreur: ' + error.message);
    } else {
      console.log('[Admin] ✅ Renewal success:', data);
      toast.success(`Abonnement renouvelé pour ${days} jours`);
      fetchUsers();
    }
  };

  const viewScreenshot = async (fileName: string) => {
    const { data } = await supabase.storage.from('payment-screenshots').createSignedUrl(fileName, 3600);
    if (data) {
      setScreenshotUrl(data.signedUrl);
      setShowScreenshot(true);
    } else {
      toast.error('Screenshot not found');
    }
  };

  const getDaysUntilExpiry = (expiresAt: string | null) => {
    if (!expiresAt) return null;
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const exportData = () => {
    const data = users.map(u => ({
      email: u.email,
      display_name: u.display_name,
      status: u.sub_status,
      amount: u.sub_amount,
      crypto: u.crypto_currency,
      created: new Date(u.created_at).toLocaleDateString(),
      sub_created: u.sub_created ? new Date(u.sub_created).toLocaleDateString() : 'N/A',
      expires: u.sub_expires ? new Date(u.sub_expires).toLocaleDateString() : 'Never',
    }));

    const csv = [
      ['Email', 'Name', 'Status', 'Amount', 'Crypto', 'Joined', 'Subscribed', 'Expires'],
      ...data.map(d => [d.email, d.display_name, d.status, d.amount, d.crypto, d.created, d.sub_created, d.expires])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ghostdash-users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Data exported!');
  };

  const filteredUsers = users.filter(u =>
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingUsers = filteredUsers.filter(u => u.sub_status === 'pending');
  const activeUsers = filteredUsers.filter(u => u.sub_status === 'active');
  const inactiveUsers = filteredUsers.filter(u => u.sub_status === 'inactive' || u.sub_status === 'none');

  const saveSettings = async () => {
    if (!settingsId) return;
    const { error } = await supabase.from("admin_settings").update({
      telegram_username: telegramUsername,
      btc_address: btcAddress,
      eth_address: ethAddress,
      usdt_address: usdtAddress,
    }).eq("id", settingsId);
    if (error) toast.error(error.message);
    else toast.success("Settings saved");
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'pending': return 'secondary';
      case 'inactive': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <header className="h-14 border-b border-border/50 bg-card/80 backdrop-blur-lg flex items-center justify-between px-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
            <Shield className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-sm">Admin Panel</span>
        </div>
        <Button size="sm" variant="ghost" className="gap-1 text-xs" onClick={signOut}>
          <LogOut className="w-3 h-3" /> Logout
        </Button>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Enhanced Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6"
        >
          <Card className="bg-gradient-to-br from-card to-card/50 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{users.length}</p>
                  <p className="text-xs text-muted-foreground">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/50 border-green-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.activeUsers}</p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/50 border-yellow-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pendingRequests}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/50 border-blue-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalRevenue}€</p>
                  <p className="text-xs text-muted-foreground">Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/50 border-orange-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.conversionRate.toFixed(0)}%</p>
                  <p className="text-xs text-muted-foreground">Conversion</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Expiring Soon Alert */}
        {stats.expiringThisWeek > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="bg-orange-500/10 border-orange-500/30">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <p className="text-sm font-medium">
                    <span className="text-orange-500">{stats.expiringThisWeek}</span> subscription{stats.expiringThisWeek > 1 ? 's' : ''} expiring within 7 days
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <Tabs defaultValue="pending">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <TabsList>
              <TabsTrigger value="pending">Pending ({pendingUsers.length})</TabsTrigger>
              <TabsTrigger value="active">Active ({activeUsers.length})</TabsTrigger>
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Button variant="outline" size="sm" onClick={exportData} className="gap-2">
                <Download className="w-4 h-4" /> Export
              </Button>
            </div>
          </div>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pending Requests</CardTitle>
                <CardDescription>Review and approve payment requests.</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : pendingUsers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No pending requests.</p>
                ) : (
                  <div className="space-y-4">
                    {pendingUsers.map((u, idx) => (
                      <motion.div
                        key={u.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="p-4 rounded-lg border border-border/50 bg-gradient-to-r from-card to-card/50 hover:border-primary/30 transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium">{u.email}</span>
                              <Badge variant="secondary">Pending</Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-muted-foreground">
                              <div>💰 Amount: {u.sub_amount || 79}€</div>
                              <div>🪙 Crypto: {u.crypto_currency || 'N/A'}</div>
                              <div>📅 Date: {u.sub_created ? new Date(u.sub_created).toLocaleDateString('fr-FR') : 'N/A'}</div>
                              <div>👤 Name: {u.display_name || 'N/A'}</div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {u.crypto_tx_hash && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => viewScreenshot(u.crypto_tx_hash!)}
                              className="gap-1"
                            >
                              <Eye className="w-3 h-3" /> Screenshot
                            </Button>
                          )}
                          <Button
                            size="sm"
                            onClick={() => toggleSubscription(u.id, u.sub_id, u.sub_status)}
                            className="gap-1 bg-green-500 hover:bg-green-600"
                          >
                            <Check className="w-3 h-3" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => toggleSubscription(u.id, u.sub_id, "inactive")}
                            className="gap-1"
                          >
                            <X className="w-3 h-3" /> Reject
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Active Subscriptions</CardTitle>
                <CardDescription>Manage active users and renewals.</CardDescription>
              </CardHeader>
              <CardContent>
                {activeUsers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No active subscriptions.</p>
                ) : (
                  <div className="space-y-3">
                    {activeUsers.map((u, idx) => {
                      const daysLeft = getDaysUntilExpiry(u.sub_expires);
                      const isExpiringSoon = daysLeft !== null && daysLeft < 7 && daysLeft > 0;
                      const canRenew = daysLeft !== null && daysLeft <= 3; // Renewal only if 3 days or less

                      return (
                        <motion.div
                          key={u.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          className={`flex items-center justify-between p-4 rounded-lg border ${isExpiringSoon ? 'border-orange-500/30 bg-orange-500/5' : 'border-border/50 bg-card/50'}`}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium">{u.display_name || u.email}</span>
                              <Badge variant="default">Active</Badge>
                              {isExpiringSoon && (
                                <Badge variant="outline" className="text-orange-500 border-orange-500/50">
                                  <Clock className="w-3 h-3 mr-1" /> {daysLeft} jours restants
                                </Badge>
                              )}
                              {daysLeft === null && (
                                <Badge variant="outline" className="text-primary border-primary/50">
                                  Lifetime
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{u.email}</p>
                            <p className="text-xs text-muted-foreground">
                              {u.sub_amount}€ • {u.crypto_currency || 'N/A'}
                              {u.sub_expires && ` • Expire: ${new Date(u.sub_expires).toLocaleDateString('fr-FR')}`}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {u.sub_id && (
                              <>
                                {canRenew && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => renewSubscription(u.sub_id!, u.sub_amount || 79)}
                                    className="gap-1 border-green-500/50 text-green-500 hover:bg-green-500/10"
                                  >
                                    <Calendar className="w-3 h-3" /> Renouveler
                                  </Button>
                                )}
                                <Button size="sm" variant="outline" onClick={() => toggleSubscription(u.id, u.sub_id, u.sub_status)} className="text-destructive hover:text-destructive">
                                  Désactiver
                                </Button>
                              </>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">All Users</CardTitle>
                <CardDescription>Complete user list with subscription status.</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : filteredUsers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No users found.</p>
                ) : (
                  <div className="space-y-2">
                    {filteredUsers.map((u, idx) => (
                      <motion.div
                        key={u.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.02 }}
                        className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">{u.display_name || u.email}</span>
                            <Badge variant={statusColor(u.sub_status) as any}>{u.sub_status}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString('fr-FR')}</span>
                          {u.sub_status !== "active" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleSubscription(u.id, u.sub_id, u.sub_status)}
                              className="bg-secondary hover:bg-secondary/90"
                            >
                              Activate
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                      </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5" />
                  Admin Settings
                </CardTitle>
                <CardDescription>Configure crypto addresses and Telegram.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Telegram Username</label>
                  <Input
                    value={telegramUsername}
                    onChange={(e) => setTelegramUsername(e.target.value)}
                    placeholder="@ghostdashadmin"
                    className="bg-background border-border"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Bitcoin Address</label>
                  <Input
                    value={btcAddress}
                    onChange={(e) => setBtcAddress(e.target.value)}
                    placeholder="bc1q..."
                    className="bg-background border-border"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Ethereum Address</label>
                  <Input
                    value={ethAddress}
                    onChange={(e) => setEthAddress(e.target.value)}
                    placeholder="0x..."
                    className="bg-background border-border"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">USDT Address (TRC-20)</label>
                  <Input
                    value={usdtAddress}
                    onChange={(e) => setUsdtAddress(e.target.value)}
                    placeholder="T..."
                    className="bg-background border-border"
                  />
                </div>
                <Button onClick={saveSettings} className="bg-secondary hover:bg-secondary/90 glow-blue">
                  <Save className="h-4 w-4 mr-2" /> Save Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Screenshot Dialog */}
        <Dialog open={showScreenshot} onOpenChange={setShowScreenshot}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Payment Screenshot</DialogTitle>
            </DialogHeader>
            {screenshotUrl && (
              <img src={screenshotUrl} alt="Payment proof" className="w-full rounded-lg" />
            )}
          </DialogContent>
        </Dialog>

        {/* Activation Modal */}
        <Dialog open={showActivateModal} onOpenChange={setShowActivateModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Activate Subscription</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-sm text-muted-foreground">
                Select the plan for <span className="font-medium text-foreground">{selectedUser?.email}</span>
              </p>

              <div className="space-y-3">
                <Card
                  onClick={() => setSelectedPlanForActivation("monthly")}
                  className={`p-4 cursor-pointer transition-all ${selectedPlanForActivation === "monthly"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold">Monthly Plan</p>
                      <p className="text-sm text-muted-foreground">€79 / 30 days</p>
                    </div>
                    {selectedPlanForActivation === "monthly" && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </Card>

                <Card
                  onClick={() => setSelectedPlanForActivation("annual")}
                  className={`p-4 cursor-pointer transition-all ${selectedPlanForActivation === "annual"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold">Annual Plan</p>
                      <p className="text-sm text-muted-foreground">€474 / 365 days</p>
                      <Badge className="mt-1 bg-green-500/20 text-green-400 border-green-500/50 text-xs">
                        6 months FREE
                      </Badge>
                    </div>
                    {selectedPlanForActivation === "annual" && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </Card>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowActivateModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={activateSubscription} className="flex-1 bg-green-500 hover:bg-green-600">
                  <Check className="w-4 h-4 mr-2" /> Activate
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Admin;

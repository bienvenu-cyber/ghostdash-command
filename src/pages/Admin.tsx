import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Ghost, LogOut, ArrowLeft, UserPlus, Check, X, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface UserRow {
  id: string;
  email: string | null;
  created_at: string;
  sub_status: string;
  sub_id: string | null;
}

const Admin = () => {
  const { signOut } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Settings
  const [telegramUsername, setTelegramUsername] = useState("");
  const [btcAddress, setBtcAddress] = useState("");
  const [ethAddress, setEthAddress] = useState("");
  const [usdtAddress, setUsdtAddress] = useState("");
  const [settingsId, setSettingsId] = useState<string | null>(null);

  // Create user
  const [newEmail, setNewEmail] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchUsers = async () => {
    const { data: profiles } = await supabase.from("profiles").select("id, email, created_at");
    if (!profiles) return;

    const { data: subs } = await supabase.from("subscriptions").select("id, user_id, status");

    const mapped: UserRow[] = profiles.map((p) => {
      const sub = subs?.find((s) => s.user_id === p.id);
      return {
        id: p.id,
        email: p.email,
        created_at: p.created_at,
        sub_status: sub?.status || "none",
        sub_id: sub?.id || null,
      };
    });
    setUsers(mapped);
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
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    if (subId) {
      await supabase.from("subscriptions").update({ status: newStatus }).eq("id", subId);
    } else {
      await supabase.from("subscriptions").insert({ user_id: userId, status: newStatus as any, amount: 200 });
    }
    toast.success(`Subscription ${newStatus}`);
    fetchUsers();
  };

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

  const createUser = async () => {
    if (!newEmail) return;
    setCreating(true);
    // We can't create auth users from client. Inform admin to use Supabase dashboard.
    toast.info("To create users, use the Supabase Auth dashboard or invite them to sign up.");
    setCreating(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <Ghost className="h-6 w-6 text-primary" />
            <span className="font-bold tracking-tight-custom">Admin Panel</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={signOut}>
          <LogOut className="h-4 w-4" />
        </Button>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl space-y-10">
        {/* Users Table */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">Users</h2>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-card/50">
                  <th className="text-left p-3 text-muted-foreground font-medium">Email</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Joined</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Status</th>
                  <th className="text-right p-3 text-muted-foreground font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">Loading...</td></tr>
                ) : users.map((u) => (
                  <tr key={u.id} className="border-b border-border/50 hover:bg-card/30">
                    <td className="p-3 text-foreground">{u.email}</td>
                    <td className="p-3 text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        u.sub_status === "active" ? "bg-primary/10 text-primary" :
                        u.sub_status === "pending" ? "bg-yellow-500/10 text-yellow-400" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {u.sub_status === "active" ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        {u.sub_status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Button
                        size="sm"
                        variant={u.sub_status === "active" ? "outline" : "default"}
                        onClick={() => toggleSubscription(u.id, u.sub_id, u.sub_status)}
                        className={u.sub_status !== "active" ? "bg-secondary hover:bg-secondary/90" : ""}
                      >
                        {u.sub_status === "active" ? "Deactivate" : "Activate"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Settings */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">Settings</h2>
          <div className="grid md:grid-cols-2 gap-4 p-6 rounded-xl border border-border bg-card/30">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Telegram Username</label>
              <Input value={telegramUsername} onChange={(e) => setTelegramUsername(e.target.value)} placeholder="ghostdashadmin" className="bg-background border-border" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">BTC Address</label>
              <Input value={btcAddress} onChange={(e) => setBtcAddress(e.target.value)} placeholder="bc1q..." className="bg-background border-border" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">ETH Address</label>
              <Input value={ethAddress} onChange={(e) => setEthAddress(e.target.value)} placeholder="0x..." className="bg-background border-border" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">USDT Address (TRC-20)</label>
              <Input value={usdtAddress} onChange={(e) => setUsdtAddress(e.target.value)} placeholder="T..." className="bg-background border-border" />
            </div>
            <div className="md:col-span-2">
              <Button onClick={saveSettings} className="bg-secondary hover:bg-secondary/90 glow-blue">
                <Save className="h-4 w-4 mr-2" /> Save Settings
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Admin;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Ghost, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      // Redirect to external dashboard with session token
      const dashboardUrl = import.meta.env.VITE_DASHBOARD_URL || "http://localhost:8080";
      window.location.href = `${dashboardUrl}?access_token=${data.session?.access_token}&refresh_token=${data.session?.refresh_token}`;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>

        <div className="flex items-center gap-2 mb-8">
          <Ghost className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold tracking-tight-custom">Ghost<span className="text-primary">dash</span></span>
        </div>

        <h1 className="text-3xl font-black tracking-tight-custom text-foreground mb-2">Welcome back</h1>
        <p className="text-muted-foreground mb-8">Sign in to access your dashboard.</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="bg-card border-border" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Password</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="bg-card border-border" />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-secondary hover:bg-secondary/90 py-6 text-base font-semibold glow-blue">
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-sm text-muted-foreground mt-6 text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary hover:underline">Get access</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

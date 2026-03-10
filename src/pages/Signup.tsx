import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Ghost, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import authSignupSvg from "@/assets/auth-signup.svg";
import { SEO } from "@/components/SEO";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Account created! Check your email to verify, then log in.");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex">
      <SEO
        title="Sign Up — Ghostdash"
        description="Create your Ghostdash account and get access to the ultimate editable OnlyFans dashboard."
        noindex={true}
      />
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to dashboard
          </Link>

          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="relative">
              <Ghost className="h-8 w-8 text-primary" />
              <div className="absolute inset-0 blur-xl bg-primary/30" />
            </div>
            <span className="text-2xl font-bold tracking-tight-custom">Ghost<span className="text-primary">dash</span></span>
          </Link>

          <h1 className="text-4xl font-black tracking-tight-custom text-foreground mb-2">Get Instant Access</h1>
          <p className="text-muted-foreground mb-8">Join elite creators and agencies.</p>

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="bg-card border-border h-12 text-base"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
                  className="bg-card border-border h-12 text-base pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary hover:bg-secondary/90 h-12 text-base font-semibold glow-blue"
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <p className="text-sm text-muted-foreground mt-6 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Illustration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-secondary/10 via-primary/5 to-background relative overflow-hidden items-center justify-center p-12"
      >
        <div className="absolute inset-0">
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 180, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/3 right-1/3 w-[500px] h-[500px] bg-secondary/15 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.3, 1, 1.3],
              rotate: [180, 0, 180],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-1/3 left-1/3 w-[500px] h-[500px] bg-primary/15 rounded-full blur-3xl"
          />
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative z-10 w-full max-w-2xl"
        >
          <img
            src={authSignupSvg}
            alt="Authentication"
            className="w-full h-auto drop-shadow-2xl"
          />

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-12 text-center"
          >
            <h2 className="text-3xl font-black tracking-tight-custom mb-3">
              <span className="text-gradient">Elite Dashboard</span> Control
            </h2>
            <p className="text-muted-foreground text-lg">
              Customize every metric. Impress clients instantly.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signup;

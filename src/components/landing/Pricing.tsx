import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PricingPlan {
  id: string;
  plan_name: string;
  price: number;
  currency: string;
  duration_days: number;
  description: string;
  features: string[];
}

const Pricing = () => {
  const [plan, setPlan] = useState<PricingPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const { data } = await supabase
          .from("pricing" as any)
          .select("*")
          .eq("is_active", true)
          .limit(1)
          .single();

        if (data && !('error' in data)) {
          setPlan(data as any as PricingPlan);
        } else {
          // Fallback to default pricing
          setPlan({
            id: "default",
            plan_name: "Monthly",
            price: 79,
            currency: "EUR",
            duration_days: 30,
            description: "Full dashboard access with all features",
            features: [
              "Full dashboard access",
              "All metrics editable",
              "Screenshot export",
              "Email support",
              "Monthly updates",
            ],
          });
        }
      } catch (err) {
        console.error("Error:", err);
        // Fallback to default pricing
        setPlan({
          id: "default",
          plan_name: "Monthly",
          price: 79,
          currency: "EUR",
          duration_days: 30,
          description: "Full dashboard access with all features",
          features: [
            "Full dashboard access",
            "All metrics editable",
            "Screenshot export",
            "Email support",
            "Monthly updates",
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPricing();
  }, []);

  if (loading) {
    return (
      <section id="pricing" className="py-24 md:py-32 relative">
        <div className="absolute inset-0 bg-radial-blue" />
        <div className="container mx-auto px-4 max-w-4xl relative">
          <div className="text-center">
            <p className="text-muted-foreground">Loading pricing...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!plan) {
    return null;
  }

  return (
    <section id="pricing" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 bg-radial-blue" />
      <div className="container mx-auto px-4 max-w-4xl relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black tracking-tight-custom text-foreground mb-4">
            Choose Your <span className="text-primary">Edge</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Secure crypto payment via Telegram. Account activated manually within 24h.
          </p>
        </motion.div>

        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative p-8 rounded-2xl border border-primary/50 glow-cyan bg-card/60 max-w-md w-full"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
              ONLY PLAN
            </div>
            <Zap className="h-8 w-8 text-primary mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-1">
              {plan.plan_name}
            </h3>
            <div className="mb-6">
              <span className="text-4xl font-black text-foreground">
                ${plan.price.toFixed(2)}
              </span>
              <span className="text-muted-foreground ml-1 text-sm">
                /{plan.duration_days} days
              </span>
            </div>
            {plan.description && (
              <p className="text-sm text-muted-foreground mb-6">
                {plan.description}
              </p>
            )}
            <ul className="space-y-3 mb-8">
              {plan.features.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <Check className="h-4 w-4 text-primary flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Button
              asChild
              className="w-full py-6 text-base font-semibold bg-secondary hover:bg-secondary/90 text-secondary-foreground glow-blue"
            >
              <Link to="/payment?plan=monthly">Choose Plan</Link>
            </Button>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs text-muted-foreground/60 mt-8"
        >
          Secure Crypto Payment • BTC / ETH / USDT
        </motion.p>
      </div>
    </section>
  );
};

export default Pricing;

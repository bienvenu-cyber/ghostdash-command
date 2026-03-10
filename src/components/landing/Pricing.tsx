import { motion } from "framer-motion";
import { Check, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Pricing = () => {
  const plans = [
    {
      id: "monthly",
      name: "Monthly",
      price: "€79",
      period: "/month",
      icon: Zap,
      features: ["Full dashboard access", "All metrics editable", "Screenshot export", "Email support", "Monthly updates"],
      popular: false,
    },
    {
      id: "annual",
      name: "Elite Annual",
      price: "€474",
      period: "/year",
      icon: Crown,
      features: ["Everything in Monthly", "12 months access", "6 months FREE", "Priority support", "All future updates", "Early access to new features"],
      popular: true,
    },
  ];

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

        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className={`relative p-8 rounded-2xl border ${plan.popular ? "border-primary/50 glow-cyan bg-card/60" : "border-border bg-card/30"}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                  MOST POPULAR
                </div>
              )}
              <plan.icon className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-1">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-black text-foreground">{plan.price}</span>
                <span className="text-muted-foreground ml-1 text-sm">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className={`w-full py-6 text-base font-semibold ${plan.popular ? "bg-secondary hover:bg-secondary/90 glow-blue" : "bg-secondary/80 hover:bg-secondary text-secondary-foreground"}`}
              >
                <Link to={`/payment?plan=${plan.id}`}>
                  Choose Plan
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs text-muted-foreground/60 mt-8"
        >
          Secure Crypto Payment • BTC / ETH / USDT • Elite Annual: Save 40% — Get 6 Months Free
        </motion.p>
      </div>
    </section>
  );
};

export default Pricing;

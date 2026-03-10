import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Payment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedPlan, setSelectedPlan] = useState(searchParams.get("plan") || "");
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [telegramUsername, setTelegramUsername] = useState("ghostdashadmin");

  useEffect(() => {
    supabase.from("admin_settings").select("telegram_username").limit(1).single()
      .then(({ data }) => {
        if (data?.telegram_username) setTelegramUsername(data.telegram_username);
      });
  }, []);

  const plans = [
    { id: "monthly", name: "Monthly", price: "€79", period: "/month" },
    { id: "annual", name: "Elite Annual", price: "€474", period: "/year", popular: true },
  ];

  const cryptos = [
    { id: "btc", name: "Bitcoin", symbol: "BTC", icon: "₿" },
    { id: "eth", name: "Ethereum", symbol: "ETH", icon: "Ξ" },
    { id: "usdt", name: "Tether", symbol: "USDT", icon: "₮" },
  ];

  const handleProceed = () => {
    if (!selectedPlan || !selectedCrypto) return;

    const plan = plans.find(p => p.id === selectedPlan);
    const crypto = cryptos.find(c => c.id === selectedCrypto);
    
    // Telegram pre-filled message (like WhatsApp)
    const message = `Hi! I want to subscribe to GhostDash ${plan?.name} (${plan?.price}) and pay with ${crypto?.name} (${crypto?.symbol}).`;
    const telegramUrl = `https://t.me/${telegramUsername}?text=${encodeURIComponent(message)}`;
    
    window.open(telegramUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8 hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-black tracking-tight-custom mb-4">
            Complete Your <span className="text-gradient">Purchase</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Select your plan and preferred cryptocurrency
          </p>
        </motion.div>

        {/* Plan Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-4">1. Choose Your Plan</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative p-6 cursor-pointer transition-all duration-300 ${
                  selectedPlan === plan.id
                    ? "border-primary/50 bg-primary/5 glow-cyan"
                    : "border-border hover:border-primary/30"
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-2 right-4 bg-primary text-primary-foreground">
                    Popular
                  </Badge>
                )}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <div className="mt-2">
                      <span className="text-3xl font-black">{plan.price}</span>
                      <span className="text-muted-foreground text-sm ml-1">{plan.period}</span>
                    </div>
                  </div>
                  {selectedPlan === plan.id && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Crypto Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-4">2. Select Cryptocurrency</h2>
          <div className="grid grid-cols-3 gap-4">
            {cryptos.map((crypto) => (
              <Card
                key={crypto.id}
                onClick={() => setSelectedCrypto(crypto.id)}
                className={`p-6 cursor-pointer transition-all duration-300 text-center ${
                  selectedCrypto === crypto.id
                    ? "border-primary/50 bg-primary/5 glow-cyan"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <div className="text-4xl mb-2">{crypto.icon}</div>
                <div className="font-bold text-sm">{crypto.symbol}</div>
                <div className="text-xs text-muted-foreground">{crypto.name}</div>
                {selectedCrypto === crypto.id && (
                  <div className="mt-3 w-5 h-5 mx-auto rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Summary & Proceed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="p-8 bg-card/50 border-border">
            <h2 className="text-2xl font-bold mb-6">3. Complete Payment</h2>
            
            {selectedPlan && selectedCrypto ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="font-bold">{plans.find(p => p.id === selectedPlan)?.name}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-bold text-2xl">{plans.find(p => p.id === selectedPlan)?.price}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-bold">{cryptos.find(c => c.id === selectedCrypto)?.name}</span>
                </div>

                <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    You'll be redirected to Telegram to complete your payment manually with our admin.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Your account will be activated within 24 hours after payment confirmation.
                  </p>
                </div>

                <Button
                  onClick={handleProceed}
                  size="lg"
                  className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground py-7 text-lg font-semibold group"
                >
                  Proceed to Telegram
                  <ExternalLink className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Please select a plan and cryptocurrency to continue
                </p>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Payment;

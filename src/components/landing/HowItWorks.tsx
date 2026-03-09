import { motion } from "framer-motion";
import howItWorksImg from "@/assets/how-it-works.jpg";

const steps = [
  { num: "01", title: "Select Your Plan", desc: "Choose monthly or lifetime access based on your needs." },
  { num: "02", title: "Pay via Telegram", desc: "Secure crypto payment (BTC/ETH/USDT) through our Telegram." },
  { num: "03", title: "Account Activation", desc: "Our team creates & activates your access within 24 hours." },
  { num: "04", title: "Start Customizing", desc: "Login and start editing your dashboard instantly." },
];

const HowItWorks = () => (
  <section className="py-24 md:py-32 bg-radial-dark">
    <div className="container mx-auto px-4 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-black tracking-tight-custom text-foreground mb-4">
          How It <span className="text-primary">Works</span>
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-16 rounded-2xl overflow-hidden border border-border/30"
      >
        <img src={howItWorksImg} alt="How Ghostdash works - 4 step process" className="w-full h-auto" loading="lazy" />
      </motion.div>

      <div className="grid md:grid-cols-4 gap-6">
        {steps.map((s, i) => (
          <motion.div
            key={s.num}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="text-center"
          >
            <div className="text-5xl font-black text-primary/20 mb-2">{s.num}</div>
            <h3 className="text-lg font-bold text-foreground mb-2">{s.title}</h3>
            <p className="text-muted-foreground text-sm">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;

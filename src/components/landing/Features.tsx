import { motion } from "framer-motion";
import { DollarSign, Users, MessageSquare, BarChart3, Camera } from "lucide-react";

const features = [
  { icon: DollarSign, title: "Editable Earnings & Revenue", desc: "Set any revenue figure, customize daily/monthly breakdowns with realistic formatting." },
  { icon: Users, title: "Custom Subscriber Counts & Growth", desc: "Design your subscriber trajectory with fully editable growth graphs and metrics." },
  { icon: MessageSquare, title: "PPV / Tips Simulator", desc: "Simulate pay-per-view income and tip distributions with believable patterns." },
  { icon: BarChart3, title: "Full Analytics Dashboard Replica", desc: "Every section of the OnlyFans dashboard, pixel-perfect and fully customizable." },
  { icon: Camera, title: "Instant Screenshot Export", desc: "Export high-resolution screenshots ready for social media, decks, or presentations." },
];

const Features = () => (
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
          Master Your <span className="text-primary">Metrics</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Every data point, every chart, every number — fully under your control.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group p-6 rounded-xl border border-border bg-card/50 hover:bg-card hover:border-primary/30 transition-all duration-300 hover:glow-cyan"
          >
            <f.icon className="h-10 w-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-foreground mb-2">{f.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;

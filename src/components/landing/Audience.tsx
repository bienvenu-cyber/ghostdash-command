import { motion } from "framer-motion";
import { Building2, User, Briefcase } from "lucide-react";

const audiences = [
  { icon: Building2, title: "OnlyFans Agencies & Managers", desc: "Impress top talent with proof-level stats. Close more deals with realistic dashboards that showcase potential." },
  { icon: User, title: "Independent Creators", desc: "Flex your vision, test strategies, create compelling content. Show the world what your brand is capable of." },
  { icon: Briefcase, title: "Professionals", desc: "Mockups, client pitches, elite social proof. Present data-driven narratives that command attention." },
];

const Audience = () => (
  <section className="py-24 md:py-32 relative">
    <div className="absolute inset-0 bg-radial-blue" />
    <div className="container mx-auto px-4 max-w-6xl relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-black tracking-tight-custom text-foreground mb-4">
          Built For <span className="text-primary">Winners</span>
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {audiences.map((a, i) => (
          <motion.div
            key={a.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className="text-center p-8 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <a.icon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">{a.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{a.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Audience;

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  { quote: "Closed 5 new models this week thanks to realistic dashboards. The screenshots are indistinguishable from real ones.", author: "Agency Director", role: "Top 1% Management" },
  { quote: "Finally a tool that lets me present my brand the way I envision it. Game changer for my content strategy.", author: "Independent Creator", role: "500K+ followers" },
  { quote: "Our client pitches went from 20% close rate to 65%. Ghostdash pays for itself in a single deal.", author: "Marketing Lead", role: "Digital Agency" },
];

const Testimonials = () => (
  <section className="py-24 md:py-32 bg-radial-dark">
    <div className="container mx-auto px-4 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-black tracking-tight-custom text-foreground mb-4">
          Trusted by the <span className="text-primary">Elite</span>
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="p-6 rounded-xl border border-border bg-card/40"
          >
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, j) => (
                <Star key={j} className="h-4 w-4 fill-primary text-primary" />
              ))}
            </div>
            <p className="text-foreground/90 text-sm leading-relaxed mb-4 italic">"{t.quote}"</p>
            <div>
              <p className="text-foreground font-semibold text-sm">{t.author}</p>
              <p className="text-muted-foreground text-xs">{t.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;

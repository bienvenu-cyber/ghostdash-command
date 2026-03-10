import { motion } from "framer-motion";
import { Star } from "lucide-react";
import mockupMobile from "@/assets/mockup-mobile.jpg";
import { OptimizedImage } from "@/components/OptimizedImage";

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

      {/* Phone Mockup */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="flex justify-center mb-16"
      >
        <motion.div
          animate={{
            y: [0, -15, 0],
            rotateZ: [0, 1, 0, -1, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative"
        >
          {/* Glow effects */}
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30 rounded-[3rem] blur-3xl opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-[2.5rem] blur-2xl" />

          {/* Phone frame */}
          <div className="relative bg-gradient-to-br from-slate-900 to-slate-950 p-3 rounded-[2.5rem] border-4 border-slate-800 shadow-2xl max-w-[280px]">
            <div className="relative rounded-[2rem] overflow-hidden bg-black">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-950 rounded-b-3xl z-10" />

              {/* Screen */}
              <OptimizedImage
                src={mockupMobile}
                alt="GhostDash mobile dashboard"
                className="w-full h-auto relative z-0"
                priority={false}
                aspectRatio="9/19.5"
              />
            </div>
          </div>

          {/* Accent dots */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -top-4 -right-4 w-16 h-16 bg-primary rounded-full blur-xl"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -bottom-4 -left-4 w-20 h-20 bg-secondary rounded-full blur-xl"
          />
        </motion.div>
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
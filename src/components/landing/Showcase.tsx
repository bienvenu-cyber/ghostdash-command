import { motion } from "framer-motion";
import mockupDesktop from "@/assets/mockup-desktop.jpg";
import mockupMobile from "@/assets/mockup-mobile.jpg";
import mockupAnalytics from "@/assets/mockup-analytics.jpg";

const Showcase = () => (
  <section className="py-16 md:py-24 overflow-hidden">
    <div className="container mx-auto px-4 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mb-12 rounded-2xl overflow-hidden border border-border/30 glow-cyan"
      >
        <img src={mockupDesktop} alt="Ghostdash dashboard on MacBook" className="w-full h-auto" loading="lazy" />
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl overflow-hidden border border-border/30"
        >
          <img src={mockupMobile} alt="Ghostdash mobile view" className="w-full h-auto" loading="lazy" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl overflow-hidden border border-border/30"
        >
          <img src={mockupAnalytics} alt="Ghostdash analytics dashboard" className="w-full h-auto" loading="lazy" />
        </motion.div>
      </div>
    </div>
  </section>
);

export default Showcase;

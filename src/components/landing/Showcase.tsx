import { motion } from "framer-motion";
import statisticsScreenshot from "@/assets/statistics-screenshot.jpeg";
import { OptimizedImage } from "@/components/OptimizedImage";

const Showcase = () => (
  <section className="py-16 md:py-24 overflow-hidden">
    <div className="container mx-auto px-4 max-w-6xl">
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text text-transparent">
          What You'll Get
        </h2>
      </motion.div>

      {/* Main Statistics Screenshot - Premium Frame */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative group"
      >
        {/* Glow effect background */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />

        {/* Image container with premium styling */}
        <div className="relative rounded-2xl overflow-hidden border-2 border-blue-500/30 bg-gradient-to-br from-blue-950/50 to-black/50 p-2 sm:p-3 md:p-4 shadow-2xl">
          <div className="rounded-xl overflow-hidden bg-black/20 backdrop-blur-sm">
            <OptimizedImage
              src={statisticsScreenshot}
              alt="GhostDash statistics dashboard - Full control panel"
              className="w-full h-auto object-contain max-w-full"
              aspectRatio="16/9"
            />
          </div>
        </div>

        {/* Corner accent */}
        <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full blur-2xl opacity-40" />
        <div className="absolute -bottom-2 -left-2 w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full blur-2xl opacity-40" />
      </motion.div>
    </div>
  </section>
);

export default Showcase;

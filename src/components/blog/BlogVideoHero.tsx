import { motion } from "framer-motion";

interface BlogVideoHeroProps {
  title?: string;
  description?: string;
  videoUrl?: string;
  videoType?: "youtube" | "cloudinary";
}

const BlogVideoHero = ({
  title = "Inside the Game",
  description = "Exclusive insights, strategies, and behind-the-scenes content from the top performers in the industry.",
  videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ",
  videoType = "youtube",
}: BlogVideoHeroProps) => {
  return (
    <section className="relative pt-28 pb-20 px-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 container mx-auto max-w-4xl">
        {/* Editorial header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-4">
            Blog & Media
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-foreground mb-4">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            {description}
          </p>
        </motion.div>

        {/* Video container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative group"
        >
          {/* Glow shadow */}
          <div className="absolute -inset-3 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-2xl blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-500" />

          {/* Video wrapper */}
          <div className="relative rounded-xl overflow-hidden border border-border bg-card shadow-2xl">
            <div className="aspect-video">
              {videoType === "youtube" ? (
                <iframe
                  src={videoUrl}
                  title="Featured video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                  loading="lazy"
                />
              ) : (
                <video
                  src={videoUrl}
                  controls
                  playsInline
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Bottom gradient fade */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-card/80 to-transparent pointer-events-none" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogVideoHero;

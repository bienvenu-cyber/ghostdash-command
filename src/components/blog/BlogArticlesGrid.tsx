import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = ["All", "Strategies", "Growth", "Analytics"];

const articles = [
  {
    id: 1,
    title: "How Top Creators 10x Their Revenue in 90 Days",
    excerpt: "Discover the exact frameworks elite creators use to scale earnings beyond six figures consistently.",
    category: "Strategies",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
    author: "GhostDash Team",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80",
    readTime: "5 min",
    date: "Mar 10, 2026",
  },
  {
    id: 2,
    title: "The Psychology Behind High-Converting Profiles",
    excerpt: "Learn what makes audiences commit — and how to engineer your presence for maximum impact.",
    category: "Growth",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
    author: "Alex Morgan",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80",
    readTime: "7 min",
    date: "Mar 8, 2026",
  },
  {
    id: 3,
    title: "Advanced Analytics: Reading the Numbers That Matter",
    excerpt: "Stop guessing. Start using data-driven decisions to optimize every aspect of your dashboard.",
    category: "Analytics",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
    author: "Data Team",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&q=80",
    readTime: "6 min",
    date: "Mar 5, 2026",
  },
  {
    id: 4,
    title: "Building Authority: From Zero to Industry Leader",
    excerpt: "A step-by-step blueprint for establishing dominance in your niche using smart positioning.",
    category: "Growth",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80",
    author: "Sarah Kim",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80",
    readTime: "8 min",
    date: "Mar 3, 2026",
  },
  {
    id: 5,
    title: "The Secret Metrics That Predict Explosive Growth",
    excerpt: "Forget vanity metrics. These hidden indicators reveal your true trajectory before anyone else sees it.",
    category: "Analytics",
    image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&q=80",
    author: "GhostDash Team",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80",
    readTime: "4 min",
    date: "Feb 28, 2026",
  },
  {
    id: 6,
    title: "Pricing Strategies That Maximize Lifetime Value",
    excerpt: "The counterintuitive pricing moves that separate top earners from everyone else in the industry.",
    category: "Strategies",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&q=80",
    author: "Alex Morgan",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80",
    readTime: "6 min",
    date: "Feb 25, 2026",
  },
];

const INITIAL_COUNT = 6;

const BlogArticlesGrid = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const filtered = activeCategory === "All"
    ? articles
    : articles.filter((a) => a.category === activeCategory);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Category filter bar */}
        <div className="flex flex-wrap gap-3 justify-center mb-14">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setVisibleCount(INITIAL_COUNT);
              }}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground border-primary shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
                  : "bg-card/50 text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          <AnimatePresence mode="popLayout">
            {visible.map((article, i) => (
              <motion.article
                key={article.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="group relative rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl shadow-lg hover:shadow-[0_8px_40px_hsl(var(--primary)/0.15)] hover:-translate-y-1 hover:scale-[1.02] transition-all duration-400 cursor-pointer"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Category pill */}
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-primary/80 text-primary-foreground backdrop-blur-sm">
                    {article.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 pt-4">
                  <h3 className="text-lg font-bold text-foreground leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                    {article.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                    <div className="flex items-center gap-2">
                      <img
                        src={article.avatar}
                        alt={article.author}
                        className="w-6 h-6 rounded-full object-cover ring-1 ring-border"
                        loading="lazy"
                      />
                      <span className="text-xs font-medium text-muted-foreground">{article.author}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground/70">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {article.readTime}
                      </span>
                      <span>{article.date}</span>
                    </div>
                  </div>
                </div>

                {/* Hover glow border */}
                <div className="absolute inset-0 rounded-2xl border border-primary/0 group-hover:border-primary/20 transition-all duration-400 pointer-events-none" />
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {/* Load More */}
        {hasMore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mt-14"
          >
            <Button
              onClick={() => setVisibleCount((c) => c + 6)}
              variant="outline"
              size="lg"
              className="px-10 py-6 text-base font-semibold border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
            >
              Load More Articles
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default BlogArticlesGrid;

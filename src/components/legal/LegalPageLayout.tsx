import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { SEO } from "@/components/SEO";

interface Section {
  id: string;
  title: string;
  content: string;
}

interface LegalPageLayoutProps {
  title: string;
  description: string;
  lastUpdated: string;
  sections: Section[];
}

const LegalPageLayout = ({ title, description, lastUpdated, sections }: LegalPageLayoutProps) => {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-100px 0px -60% 0px", threshold: 0.1 }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  return (
    <>
      <SEO title={`${title} — GhostDash`} description={description} />
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="container mx-auto max-w-6xl px-4 pt-28 pb-20">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-3">Legal</p>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-3">{title}</h1>
            <p className="text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
          </motion.div>

          <div className="flex gap-12">
            {/* Sticky TOC — desktop only */}
            <nav className="hidden lg:block w-56 shrink-0 self-start sticky top-28">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Contents</p>
              <ul className="space-y-1 border-l border-border">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className={`block pl-4 py-1.5 text-sm transition-colors duration-200 ${
                        activeId === s.id
                          ? "text-primary border-l-2 border-primary -ml-[1px] font-medium"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {sections.map((s, i) => (
                <motion.section
                  key={s.id}
                  id={s.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.03 }}
                  className="mb-12 scroll-mt-28"
                >
                  <h2 className="text-xl font-bold text-foreground mb-4">{s.title}</h2>
                  <div className="text-muted-foreground leading-relaxed whitespace-pre-line text-[15px]">
                    {s.content}
                  </div>
                  {i < sections.length - 1 && (
                    <div className="mt-10 border-b border-border/30" />
                  )}
                </motion.section>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default LegalPageLayout;

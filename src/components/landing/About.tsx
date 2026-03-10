import { motion } from "framer-motion";
import { Edit3, Image, TrendingUp } from "lucide-react";

const About = () => {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black tracking-tight-custom mb-6">
            The Ultimate <span className="text-gradient">Editable Dashboard</span> Replica
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Customize earnings, subscribers, analytics, and graphs in real-time. 
            Generate stunning screenshots for agencies, creators, and elite showcases.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Edit3,
              title: "Real-Time Editing",
              description: "Modify every metric instantly. Change earnings, subscriber counts, and analytics on the fly."
            },
            {
              icon: Image,
              title: "Professional Screenshots",
              description: "Generate pixel-perfect dashboard captures. Perfect for portfolios, pitches, and showcases."
            },
            {
              icon: TrendingUp,
              title: "Complete Control",
              description: "Customize graphs, charts, and statistics. Make your numbers tell the story you want."
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300">
                <div className="relative mb-6">
                  <item.icon className="h-12 w-12 text-primary" />
                  <div className="absolute inset-0 blur-xl bg-primary/20 group-hover:bg-primary/40 transition-all duration-300" />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;

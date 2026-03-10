import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About";
import Showcase from "@/components/landing/Showcase";
import Features from "@/components/landing/Features";
import Audience from "@/components/landing/Audience";
import Testimonials from "@/components/landing/Testimonials";
import Pricing from "@/components/landing/Pricing";
import HowItWorks from "@/components/landing/HowItWorks";
import Footer from "@/components/landing/Footer";
import { SEO } from "@/components/SEO";

const Index = () => (
  <main className="bg-background min-h-screen">
    <SEO
      title="Ghostdash — Editable OnlyFans Dashboard for Agencies & Creators"
      description="Stop chasing, start closing. The ultimate editable OnlyFans dashboard replica. Customize earnings, subscribers, analytics and export professional screenshots."
      keywords="onlyfans dashboard, editable dashboard, onlyfans replica, creator dashboard, agency tools, onlyfans analytics, custom dashboard, onlyfans stats, screenshot generator, onlyfans agency"
      canonical="https://ghostdashof.com"
    />
    <Navbar />
    <div id="hero">
      <Hero />
    </div>
    <About />
    <Showcase />
    <div id="features">
      <Features />
    </div>
    <Audience />
    <div id="testimonials">
      <Testimonials />
    </div>
    <div id="pricing">
      <Pricing />
    </div>
    <div id="how-it-works">
      <HowItWorks />
    </div>
    <Footer />
  </main>
);

export default Index;

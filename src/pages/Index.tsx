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

const Index = () => (
  <main className="bg-background min-h-screen">
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

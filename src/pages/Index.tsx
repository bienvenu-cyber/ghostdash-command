import Hero from "@/components/landing/Hero";
import Showcase from "@/components/landing/Showcase";
import Features from "@/components/landing/Features";
import Audience from "@/components/landing/Audience";
import Testimonials from "@/components/landing/Testimonials";
import Pricing from "@/components/landing/Pricing";
import HowItWorks from "@/components/landing/HowItWorks";
import Footer from "@/components/landing/Footer";

const Index = () => (
  <main className="bg-background min-h-screen">
    <Hero />
    <Showcase />
    <Features />
    <Audience />
    <Testimonials />
    <Pricing />
    <HowItWorks />
    <Footer />
  </main>
);

export default Index;

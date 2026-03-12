import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import BlogVideoHero from "@/components/blog/BlogVideoHero";
import SEO from "@/components/SEO";

const Blog = () => {
  return (
    <>
      <SEO
        title="Blog — GhostDash"
        description="Exclusive insights, strategies, and behind-the-scenes content from top performers."
      />
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <BlogVideoHero
          title="Inside the Game"
          description="Exclusive insights, strategies, and behind-the-scenes content from the top performers in the industry."
          videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ"
          videoType="youtube"
        />
        <Footer />
      </div>
    </>
  );
};

export default Blog;

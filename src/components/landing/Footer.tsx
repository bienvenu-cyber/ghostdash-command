import { Ghost } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="py-12 border-t border-border/30">
    <div className="container mx-auto px-4 max-w-6xl">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <Ghost className="h-5 w-5 text-primary" />
          <span className="font-bold tracking-tight-custom">Ghost<span className="text-primary">dash</span></span>
        </div>
        <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
          <a href="https://t.me/ghostdashadmin" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Telegram</a>
          <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          <Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link>
        </div>
        <p className="text-xs text-muted-foreground/50">© {new Date().getFullYear()} Ghostdash. All rights reserved.</p>
      </div>

      {/* Structured Data for Organization */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Ghostdash",
          "url": "https://ghostdashof.com",
          "logo": "https://ghostdashof.com/logo.png",
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "Customer Support",
            "url": "https://t.me/ghostdashadmin"
          },
          "sameAs": [
            "https://t.me/ghostdashadmin"
          ]
        })
      }} />
    </div>
  </footer>
);

export default Footer;

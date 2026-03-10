import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Ghost, Sparkles, DollarSign, MessageSquare, LogIn, UserPlus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      // Detect active section
      const sections = ["hero", "features", "pricing", "testimonials"];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const navLinks = [
    { id: "features", label: "Features", icon: Sparkles },
    { id: "hero", label: "Home", icon: Ghost, isCenter: true },
    { id: "pricing", label: "Pricing", icon: DollarSign },
    { id: "testimonials", label: "Reviews", icon: MessageSquare },
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-4 left-0 right-0 z-50 px-4 transition-all duration-500 hidden md:block"
      >
        <div className={`mx-auto transition-all duration-500 ${
          scrolled ? "max-w-6xl" : "max-w-7xl"
        }`}>
          <div
            className={`relative rounded-2xl transition-all duration-500 ${
              scrolled
                ? "bg-background/95 backdrop-blur-xl border border-border/50 shadow-2xl shadow-primary/5"
                : "bg-background/60 backdrop-blur-md border border-border/30"
            }`}
          >
            <div className={`absolute inset-0 rounded-2xl transition-opacity duration-500 ${
              scrolled ? "opacity-100" : "opacity-0"
            }`}>
              <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            </div>

            <div className="relative px-6 py-4">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => scrollToSection("hero")} 
                  className="flex items-center gap-2 group"
                >
                  <div className="relative">
                    <Ghost className="h-7 w-7 text-primary transition-transform group-hover:scale-110 duration-300" />
                    <div className="absolute inset-0 blur-xl bg-primary/20 group-hover:bg-primary/40 transition-all duration-300" />
                  </div>
                  <span className="text-xl font-bold tracking-tight-custom">
                    Ghost<span className="text-primary">dash</span>
                  </span>
                </button>

                <div className="flex items-center gap-1">
                  {navLinks.filter(link => !link.isCenter).map((link) => (
                    <button
                      key={link.id}
                      onClick={() => scrollToSection(link.id)}
                      className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
                    >
                      {link.label}
                      <span className="absolute inset-x-2 -bottom-px h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  {user ? (
                    <Link to="/dashboard">
                      <Button 
                        size="sm" 
                        className="relative bg-secondary hover:bg-secondary/90 text-sm font-semibold px-6 overflow-hidden group"
                      >
                        <User className="h-4 w-4 mr-2" />
                        <span className="relative z-10">My Space</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link to="/login">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-sm font-medium hover:bg-muted/50 transition-all duration-300"
                        >
                          Sign In
                        </Button>
                      </Link>
                      <Link to="/signup">
                        <Button 
                          size="sm" 
                          className="relative bg-secondary hover:bg-secondary/90 text-sm font-semibold px-6 overflow-hidden group"
                        >
                          <span className="relative z-10">Get Access</span>
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Top Bar */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-xl border-b border-border/50"
      >
        <div className="px-4 py-3 flex items-center justify-between">
          <button 
            onClick={() => scrollToSection("hero")} 
            className="flex items-center gap-2"
          >
            <Ghost className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold tracking-tight-custom">
              Ghost<span className="text-primary">dash</span>
            </span>
          </button>
          <div className="flex items-center gap-2">
            {user ? (
              <Link to="/dashboard">
                <Button size="sm" className="bg-secondary text-xs px-3 h-8 font-semibold">
                  <User className="h-4 w-4 mr-1" />
                  My Space
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-xs px-3 h-8">
                    <LogIn className="h-4 w-4 mr-1" />
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-secondary text-xs px-3 h-8 font-semibold">
                    <UserPlus className="h-4 w-4 mr-1" />
                    Join
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Mobile Bottom Navigation - Ultra Premium */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      >
        {/* Gradient glow at top */}
        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
        <div className="absolute inset-x-0 -top-4 h-4 bg-gradient-to-t from-background/50 to-transparent pointer-events-none" />
        
        <div className="relative bg-background/98 backdrop-blur-2xl border-t border-border/50">
          <div className="grid grid-cols-4 gap-0 px-1 py-1.5 pb-safe">
            {navLinks.map((link, index) => {
              const Icon = link.icon;
              const isActive = activeSection === link.id;
              const isCenter = link.isCenter;
              
              return (
                <motion.button
                  key={link.id}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  onClick={() => scrollToSection(link.id)}
                  className={`relative flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl transition-all active:scale-95 ${
                    isCenter ? "scale-110" : ""
                  }`}
                >
                  {/* Active indicator */}
                  {isActive && !isCenter && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary/10 rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  
                  {/* Icon with glow effect */}
                  <div className={`relative ${isCenter ? "mb-1" : ""}`}>
                    <Icon 
                      className={`transition-all duration-300 ${
                        isCenter 
                          ? "h-7 w-7 text-primary" 
                          : isActive 
                            ? "h-6 w-6 text-primary" 
                            : "h-5 w-5 text-muted-foreground"
                      }`}
                    />
                    {/* Glow effect */}
                    <div className={`absolute inset-0 blur-xl transition-all duration-300 ${
                      isCenter 
                        ? "bg-primary/30" 
                        : isActive 
                          ? "bg-primary/20" 
                          : "bg-primary/0"
                    }`} />
                  </div>
                  
                  {/* Label */}
                  <span className={`relative text-[10px] font-medium leading-tight text-center transition-all duration-300 ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}>
                    {link.label}
                  </span>
                  
                  {/* Active dot indicator */}
                  {isActive && !isCenter && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-0.5 w-1 h-1 bg-primary rounded-full"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.nav>
    </>
  );
};

export default Navbar;

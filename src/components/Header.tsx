import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Artists", href: "/#audience" },
  { label: "Studios", href: "/#audience" },
  { label: "Events", href: "/#features" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Testimonials", href: "/#social-proof" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-xl font-bold text-foreground">
            Tattoo<span className="text-accent-light">NOW</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                location.hash === link.href.split("#")[1] &&
                  "text-foreground"
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-3 md:flex">
          <Link to="/artist-software">
            <Button variant="outline" size="sm">
              Artist Software
            </Button>
          </Link>
          <Button variant="default" size="sm">
            Get Started
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-2 pt-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <hr className="my-2 border-border" />
            <Link
              to="/artist-software"
              onClick={() => setMobileOpen(false)}
            >
              <Button variant="outline" size="sm" className="w-full">
                Artist Software
              </Button>
            </Link>
            <Button variant="default" size="sm" className="w-full">
              Get Started
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}

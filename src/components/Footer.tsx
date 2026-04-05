import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-hero-gradient flex items-center justify-center">
                <Heart className="w-4 h-4 text-primary-foreground" fill="currentColor" />
              </div>
              <span className="font-heading font-bold">MediSlot AI</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Smart healthcare, simplified. Book appointments instantly with AI-powered assistance.
            </p>
          </div>
          {[
            { title: "Product", links: [["Find Doctors", "/doctors"], ["AI Checker", "/symptom-checker"], ["Book Appointment", "/doctors"]] },
            { title: "Company", links: [["About Us", "#"], ["Careers", "#"], ["Contact", "#"]] },
            { title: "Legal", links: [["Privacy Policy", "#"], ["Terms of Service", "#"], ["Cookie Policy", "#"]] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-heading font-semibold text-sm mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link to={href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-border mt-10 pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} MediSlot AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

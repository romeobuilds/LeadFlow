import Link from "next/link";
import { Brand } from "@/components/marketing/brand";

const FOOTER_SECTIONS = [
  {
    title: "Product",
    links: [
      { href: "#pipeline", label: "Pipeline board" },
      { href: "#features", label: "Features" },
      { href: "#dashboard", label: "Dashboard" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/signup", label: "Create account" },
      { href: "/login", label: "Log in" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1.5fr_1fr_1fr] md:px-6">
        <div className="grid content-start gap-2">
          <Brand />
          <p className="max-w-xs text-sm text-muted-foreground">
            Lead management for agencies and freelancers. Capture every lead, drag
            it through your pipeline, close more deals.
          </p>
        </div>
        {FOOTER_SECTIONS.map((section) => (
          <div key={section.title} className="grid content-start gap-2">
            <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {section.title}
            </h2>
            <ul className="grid gap-1.5">
              {section.links.map((link) =>
                link.href.startsWith("#") ? (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                    >
                      {link.label}
                    </a>
                  </li>
                ) : (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground md:px-6">
          <p>© {new Date().getFullYear()} LeadFlow</p>
          <p>Built with Next.js and Supabase</p>
        </div>
      </div>
    </footer>
  );
}
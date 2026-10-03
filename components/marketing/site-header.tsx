import { ButtonLink } from "@/components/marketing/button-link";
import { Brand } from "@/components/marketing/brand";

const NAV_LINKS = [
  { href: "#pipeline", label: "Pipeline" },
  { href: "#features", label: "Features" },
  { href: "#dashboard", label: "Dashboard" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-6 px-4 md:px-6">
        <div className="flex items-center gap-8">
          <Brand />
          <nav className="hidden items-center gap-5 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <ButtonLink variant="ghost" size="sm" href="/login">
            Log in
          </ButtonLink>
          <ButtonLink size="sm" href="/signup">
            Get started
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
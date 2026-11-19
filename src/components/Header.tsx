import Link from "next/link";
import { Shield } from "@/lib/heraldry/Shield";
import type { ShieldSpec } from "@/lib/heraldry/types";

const logo: ShieldSpec = {
  field: { k: "party", d: "pale", a: "gueules", b: "azur" },
  charges: [{ type: "fleurdelis", t: "or", at: [[50, 52]], s: 52 }],
};

const links = [
  { href: "/apprendre", label: "Apprendre" },
  { href: "/quiz", label: "Quiz" },
  { href: "/armorial", label: "Armorial" },
  { href: "/atelier", label: "Atelier" },
  { href: "/classement", label: "Classement" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-parch/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Shield spec={logo} className="h-10 w-9" />
          <span className="text-xl font-bold tracking-wide text-wine-dark">Blasons</span>
        </Link>
        <nav className="flex items-center gap-1 overflow-x-auto text-[15px] sm:gap-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="whitespace-nowrap rounded-full px-3 py-1.5 font-semibold text-ink-soft transition hover:bg-wine/10 hover:text-wine-dark"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

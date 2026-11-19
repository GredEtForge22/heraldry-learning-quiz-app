import { GLOSSARY } from "@/lib/heraldry/glossary";
import { TINCTURE_COLORS, TINCTURE_LABELS, type Tincture } from "@/lib/heraldry/types";
import { Shield } from "@/lib/heraldry/Shield";

const ORDER: Tincture[] = ["or", "argent", "azur", "gueules", "sable", "sinople", "pourpre", "hermine"];

const GROUPS: { label: string; items: Tincture[] }[] = [
  { label: "Métaux", items: ["or", "argent"] },
  { label: "Couleurs", items: ["azur", "gueules", "sable", "sinople", "pourpre"] },
  { label: "Fourrures", items: ["hermine"] },
];

export function TinctureList() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {GROUPS.map((g) => (
        <div key={g.label} className="rounded-xl border border-line bg-white/60 p-4">
          <h4 className="mb-3 font-bold text-wine-dark">{g.label}</h4>
          <ul className="space-y-2">
            {g.items.map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span
                  className="inline-block h-8 w-8 rounded-full border border-ink/40"
                  style={
                    t === "hermine"
                      ? { background: "radial-gradient(circle at 50% 40%, #1c1c1f 0 2px, transparent 3px) #f6f4ee" }
                      : { background: TINCTURE_COLORS[t] }
                  }
                />
                <span>
                  <span className="font-semibold">{TINCTURE_LABELS[t]}</span>
                  <span className="block text-xs text-ink-soft">
                    {GLOSSARY.find((x) => x.term === TINCTURE_LABELS[t])?.def.replace(/\.$/, "")}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function HachuresTable() {
  return (
    <div>
      <svg width="0" height="0" className="absolute">
        <defs>
          <pattern id="h-or" width="8" height="8" patternUnits="userSpaceOnUse">
            <rect width="8" height="8" fill="#fff" />
            <circle cx="2" cy="2" r="0.9" fill="#222" />
            <circle cx="6" cy="6" r="0.9" fill="#222" />
          </pattern>
          <pattern id="h-azur" width="6" height="6" patternUnits="userSpaceOnUse">
            <rect width="6" height="6" fill="#fff" />
            <path d="M0,3 H6" stroke="#222" strokeWidth="1" />
          </pattern>
          <pattern id="h-gueules" width="6" height="6" patternUnits="userSpaceOnUse">
            <rect width="6" height="6" fill="#fff" />
            <path d="M3,0 V6" stroke="#222" strokeWidth="1" />
          </pattern>
          <pattern id="h-sable" width="6" height="6" patternUnits="userSpaceOnUse">
            <rect width="6" height="6" fill="#fff" />
            <path d="M3,0 V6 M0,3 H6" stroke="#222" strokeWidth="1" />
          </pattern>
          <pattern id="h-sinople" width="6" height="6" patternUnits="userSpaceOnUse">
            <rect width="6" height="6" fill="#fff" />
            <path d="M0,6 L6,0 M-1,1 L1,-1 M5,7 L7,5" stroke="#222" strokeWidth="1" />
          </pattern>
          <pattern id="h-pourpre" width="6" height="6" patternUnits="userSpaceOnUse">
            <rect width="6" height="6" fill="#fff" />
            <path d="M0,0 L6,6 M-1,5 L1,7 M5,-1 L7,1" stroke="#222" strokeWidth="1" />
          </pattern>
        </defs>
      </svg>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {ORDER.filter((t) => t !== "hermine").map((t) => (
          <div key={t} className="text-center">
            <div className="grid grid-cols-2 gap-1">
              <div className="h-14 rounded border border-ink/40" style={{ background: t === "argent" ? "#fff" : TINCTURE_COLORS[t as Exclude<Tincture, "hermine">] }} />
              <svg className="h-14 w-full rounded border border-ink/40" aria-hidden>
                <rect width="100%" height="100%" fill={t === "argent" ? "#fff" : `url(#h-${t})`} />
              </svg>
            </div>
            <div className="mt-1 text-sm font-semibold">{TINCTURE_LABELS[t]}</div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm text-ink-soft">
        Or : points · Argent : blanc uni · Azur : traits horizontaux · Gueules : traits verticaux · Sable : quadrillage ·
        Sinople : diagonales descendant vers la dextre · Pourpre : diagonales descendant vers la senestre.
      </p>
    </div>
  );
}

export function EcuPoints() {
  const spec = { field: { k: "plain", t: "argent" } as const };
  return (
    <div className="mx-auto max-w-sm">
      <div className="relative">
        <Shield spec={spec} className="w-full" />
        <div className="pointer-events-none absolute inset-0 text-center text-sm font-bold text-wine-dark">
          <span className="absolute left-1/2 top-[8%] -translate-x-1/2">CHEF</span>
          <span className="absolute left-[12%] top-[42%] max-w-[26%] leading-tight">DEXTRE<br /><span className="text-[11px] font-normal text-ink-soft">(à gauche)</span></span>
          <span className="absolute right-[12%] top-[42%] max-w-[26%] leading-tight">SENESTRE<br /><span className="text-[11px] font-normal text-ink-soft">(à droite)</span></span>
          <span className="absolute left-1/2 top-[44%] -translate-x-1/2 rounded-full border-2 border-dashed border-wine/50 px-2 py-0.5 text-xs">CŒUR</span>
          <span className="absolute left-1/2 top-[80%] -translate-x-1/2">POINTE</span>
        </div>
      </div>
      <p className="mt-2 text-center text-sm text-ink-soft">
        L&apos;écu vu de face : la dextre est du côté de la main droite du porteur, donc à gauche de l&apos;image.
      </p>
    </div>
  );
}

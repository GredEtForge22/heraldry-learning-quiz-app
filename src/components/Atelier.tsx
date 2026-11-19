"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Shield } from "@/lib/heraldry/Shield";
import {
  TINCTURE_COLORS,
  TINCTURE_LABELS,
  type Charge,
  type ChargeType,
  type FieldSpec,
  type Ordinary,
  type OrdinaryType,
  type ShieldSpec,
  type Tincture,
} from "@/lib/heraldry/types";

type FieldKind = "plain" | "pale" | "fess" | "bend" | "bendsin" | "barry" | "paly" | "bendy" | "chequy" | "lozengy" | "hermine" | "vair";
const FIELD_KINDS: { id: FieldKind; label: string }[] = [
  { id: "plain", label: "Uni" },
  { id: "hermine", label: "Hermine" },
  { id: "vair", label: "Vair" },
  { id: "pale", label: "Parti" },
  { id: "fess", label: "Coupé" },
  { id: "bend", label: "Tranché" },
  { id: "bendsin", label: "Taillé" },
  { id: "barry", label: "Fascé" },
  { id: "paly", label: "Palé" },
  { id: "bendy", label: "Bandé" },
  { id: "chequy", label: "Échiqueté" },
  { id: "lozengy", label: "Losangé" },
];

const PLAIN_COLORS: Tincture[] = ["or", "argent", "azur", "gueules", "sable", "sinople", "pourpre"];

const ORDINARIES: { id: OrdinaryType | "none"; label: string; phrase: string }[] = [
  { id: "none", label: "Aucune", phrase: "" },
  { id: "cross", label: "Croix", phrase: "à la croix" },
  { id: "saltire", label: "Sautoir", phrase: "au sautoir" },
  { id: "fess", label: "Fasce", phrase: "à la fasce" },
  { id: "pale", label: "Pal", phrase: "au pal" },
  { id: "bend", label: "Bande", phrase: "à la bande" },
  { id: "chevron", label: "Chevron", phrase: "au chevron" },
  { id: "chief", label: "Chef", phrase: "au chef" },
  { id: "bordure", label: "Bordure", phrase: "à la bordure" },
  { id: "canton", label: "Canton", phrase: "au canton" },
];

interface ChargeInfo {
  label: string;
  one: string;
  many: string;
  animal?: boolean;
}

const CHARGES: Record<ChargeType | "none", ChargeInfo> = {
  none: { label: "Aucun", one: "", many: "" },
  lion: { label: "Lion", one: "au lion", many: "lions", animal: true },
  leopard: { label: "Léopard", one: "au léopard", many: "léopards", animal: true },
  eagle: { label: "Aigle", one: "à l'aigle", many: "aigles", animal: true },
  eagle2: { label: "Aigle bicéphale", one: "à l'aigle bicéphale", many: "aigles bicéphales", animal: true },
  fleurdelis: { label: "Fleur de lys", one: "à la fleur de lys", many: "fleurs de lys" },
  roundel: { label: "Tourteau", one: "au tourteau", many: "tourteaux" },
  star: { label: "Étoile", one: "à l'étoile", many: "étoiles" },
  crescent: { label: "Croissant", one: "au croissant", many: "croissants" },
  crown: { label: "Couronne", one: "à la couronne", many: "couronnes" },
  castle: { label: "Château", one: "au château", many: "châteaux" },
  mascle: { label: "Macle", one: "à la macle", many: "macles" },
  billet: { label: "Billette", one: "à la billette", many: "billettes" },
  heart: { label: "Cœur", one: "au cœur", many: "cœurs" },
  dolphin: { label: "Dauphin", one: "au dauphin", many: "dauphins", animal: true },
  alerion: { label: "Alérion", one: "à l'alérion", many: "alérions" },
  crosslet: { label: "Croisette", one: "à la croisette", many: "croisettes" },
  ship: { label: "Nef", one: "à la nef", many: "nefs" },
  lozenge: { label: "Losange", one: "au losange", many: "losanges" },
  crosspotent: { label: "Croix potencée", one: "à la croix potencée", many: "croix potencées" },
  croixtoulouse: { label: "Croix occitane", one: "à la croix cléchée", many: "croix cléchées" },
  rose: { label: "Rose", one: "à la rose", many: "roses" },
  key: { label: "Clé", one: "à la clé", many: "clés" },
  sword: { label: "Épée", one: "à l'épée", many: "épées" },
  bear: { label: "Ours", one: "à l'ours", many: "ours", animal: true },
  harp: { label: "Harpe", one: "à la harpe", many: "harpes" },
  escallop: { label: "Coquille", one: "à la coquille", many: "coquilles" },
  tree: { label: "Arbre", one: "à l'arbre", many: "arbres" },
  tower: { label: "Tour", one: "à la tour", many: "tours" },
};
const SHOWN_CHARGES: (ChargeType | "none")[] = [
  "none", "lion", "leopard", "eagle", "eagle2", "fleurdelis", "roundel", "star",
  "crescent", "crown", "castle", "tower", "mascle", "billet", "heart", "dolphin",
  "alerion", "ship", "rose", "key", "sword", "bear", "harp", "escallop", "tree",
];
type Layout = "1" | "2pal" | "2-1" | "3pal" | "3fess" | "semy";

const LAYOUTS: { id: Layout; label: string }[] = [
  { id: "1", label: "Un seul" },
  { id: "2pal", label: "Deux en pal" },
  { id: "2-1", label: "Trois (2 et 1)" },
  { id: "3pal", label: "Trois en pal" },
  { id: "3fess", label: "Trois en fasce" },
  { id: "semy", label: "Semé" },
];

const NUMBER_WORDS: Record<Layout, string> = { "1": "", "2pal": "deux", "2-1": "trois", "3pal": "trois", "3fess": "trois", semy: "" };

const isMetal = (t: Tincture) => t === "or" || t === "argent";
const de = (t: Tincture) => (/^[aeiouyh]/.test(TINCTURE_LABELS[t].toLowerCase()) ? "d'" : "de ") + TINCTURE_LABELS[t].toLowerCase();
const Cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

interface State {
  kind: FieldKind;
  c1: Tincture;
  c2: Tincture;
  ord: OrdinaryType | "none";
  ordC: Tincture;
  charge: ChargeType | "none";
  chargeC: Tincture;
  layout: Layout;
}

const INITIAL: State = {
  kind: "plain",
  c1: "azur",
  c2: "or",
  ord: "bend",
  ordC: "or",
  charge: "none",
  chargeC: "argent",
  layout: "1",
};

function buildSpec(s: State): ShieldSpec {
  let field: FieldSpec;
  if (s.kind === "plain") field = { k: "plain", t: s.c1 };
  else if (s.kind === "hermine") field = { k: "plain", t: "hermine" };
  else if (s.kind === "vair") field = { k: "plain", t: "vair" };
  else if (["pale", "fess", "bend", "bendsin"].includes(s.kind))
    field = { k: "party", d: s.kind as "pale", a: s.c1, b: s.c2 };
  else {
    const n = s.kind === "barry" ? 8 : s.kind === "paly" ? 6 : s.kind === "bendy" ? 6 : s.kind === "chequy" ? 6 : 5;
    field = { k: "pattern", p: s.kind as "barry", a: s.c1, b: s.c2, n };
  }
  const ordinaries: Ordinary[] = s.ord === "none" ? [] : [{ k: s.ord, t: s.ordC }];
  const charges: Charge[] = [];
  if (s.charge !== "none") {
    const animal = CHARGES[s.charge].animal;
    if (s.layout === "1") charges.push({ type: s.charge, t: s.chargeC, at: [[50, 56]], s: animal ? 72 : 56 });
    else if (s.layout === "semy") charges.push({ type: s.charge, t: s.chargeC, at: "semy", s: 16 });
    else charges.push({ type: s.charge, t: s.chargeC, at: s.layout, s: animal && s.layout === "2-1" ? 34 : undefined });
  }
  return { field, ordinaries, charges };
}

function blazonText(s: State): string {
  let t: string;
  const pieces: Record<string, string> = { barry: "Fascé", paly: "Palé", bendy: "Bandé", chequy: "Échiqueté", lozengy: "Losangé" };
  const parties: Record<string, string> = { pale: "Parti", fess: "Coupé", bend: "Tranché", bendsin: "Taillé" };
  if (s.kind === "plain") t = Cap(de(s.c1));
  else if (s.kind === "hermine") t = "D'hermine plain";
  else if (s.kind === "vair") t = "De vair plain";
  else if (parties[s.kind]) t = `${parties[s.kind]} ${de(s.c1)} et ${de(s.c2)}`;
  else {
    const n = s.kind === "barry" ? "huit pièces" : s.kind === "paly" ? "six pièces" : s.kind === "bendy" ? "six pièces" : "";
    t = `${pieces[s.kind]} ${de(s.c1)} et ${de(s.c2)}${n ? " de " + n : ""}`;
  }
  const clauses: string[] = [];
  if (s.charge !== "none" && s.layout === "semy") {
    t += ` semé de ${CHARGES[s.charge].many} ${de(s.chargeC)}`;
  }
  if (s.ord !== "none") {
    const o = ORDINARIES.find((x) => x.id === s.ord)!;
    clauses.push(`${o.phrase} ${de(s.ordC)}`);
  }
  if (s.charge !== "none" && s.layout !== "semy") {
    const c = CHARGES[s.charge];
    if (s.layout === "1") clauses.push(`${c.one} ${de(s.chargeC)}`);
    else {
      const extra = s.layout === "2-1" ? ", deux et un" : s.layout === "3fess" ? ", rangés en fasce" : ", posés en pal";
      clauses.push(`à ${NUMBER_WORDS[s.layout]} ${c.many} ${de(s.chargeC)}${extra}`);
    }
  }
  return t + (clauses.length ? " " + clauses.join(", ") : "") + ".";
}

function warnings(s: State): string[] {
  const out: string[] = [];
  if (s.kind === "plain") {
    if (s.ord !== "none" && s.ord !== "bordure" && isMetal(s.ordC) === isMetal(s.c1) && s.ordC !== s.c1 && s.ordC !== "pourpre")
      out.push("La pièce est du même type d'émail que le champ (métal sur métal ou couleur sur couleur) : c'est contraire à la règle.");
    if (s.charge !== "none" && s.ord === "none" && isMetal(s.chargeC) === isMetal(s.c1))
      out.push("Le meuble est du même type d'émail que le champ : le contraste sera faible, et la règle de contrariété n'est pas respectée.");
    if (s.ord !== "none" && s.ordC === s.c1) out.push("La pièce a le même émail que le champ : elle est invisible !");
  }
  if (s.charge !== "none" && s.ord !== "none" && s.chargeC === s.ordC)
    out.push("Le meuble et la pièce ont le même émail : on ne verrait plus le meuble posé dessus.");
  return out;
}

function Swatches({ value, onChange, label }: { value: Tincture; onChange: (t: Tincture) => void; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-20 shrink-0 text-xs font-semibold uppercase tracking-wider text-ink-soft">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {PLAIN_COLORS.map((t) => (
          <button
            key={t}
            type="button"
            title={TINCTURE_LABELS[t]}
            aria-label={TINCTURE_LABELS[t]}
            onClick={() => onChange(t)}
            className={`h-8 w-8 rounded-full border-2 transition ${value === t ? "scale-110 border-wine ring-2 ring-wine/30" : "border-ink/30 hover:scale-105"}`}
            style={{
              background:
                t === "hermine" || t === "vair"
                  ? undefined
                  : TINCTURE_COLORS[t as Exclude<Tincture, "hermine" | "vair">],
            }}
          />
        ))}
      </div>
    </div>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="card space-y-3 p-4">
      <legend className="px-2 text-sm font-bold uppercase tracking-wider text-wine-dark">{title}</legend>
      {children}
    </fieldset>
  );
}

const rand = <T,>(a: T[]): T => a[Math.floor(Math.random() * a.length)];

export function Atelier() {
  const [s, setS] = useState<State>(INITIAL);
  const [copied, setCopied] = useState(false);
  const spec = useMemo(() => buildSpec(s), [s]);
  const text = blazonText(s);
  const warns = warnings(s);
  const set = <K extends keyof State>(k: K, v: State[K]) => setS((cur) => ({ ...cur, [k]: v }));
  const twoColors = s.kind !== "plain" && s.kind !== "hermine";

  const randomize = () => {
    const metals: Tincture[] = ["or", "argent"];
    const colors: Tincture[] = ["azur", "gueules", "sable", "sinople"];
    const fieldMetal = Math.random() < 0.4;
    const c1 = rand(fieldMetal ? metals : colors);
    const over = rand(fieldMetal ? colors : metals);
    const kind = rand<FieldKind>(["plain", "plain", "plain", "pale", "fess", "barry", "chequy", "paly"]);
    const c2 = kind === "plain" ? c1 : rand(fieldMetal ? colors : metals);
    setS({
      kind,
      c1,
      c2,
      ord: rand<OrdinaryType | "none">(["none", "cross", "bend", "fess", "chevron", "chief", "saltire", "bordure"]),
      ordC: over,
      charge: rand<ChargeType | "none">(["none", "lion", "eagle", "fleurdelis", "roundel", "star", "crescent", "castle"]),
      chargeC: over,
      layout: rand<Layout>(["1", "1", "2-1", "3pal"]),
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="card flex flex-col items-center p-6">
          <Shield spec={spec} className="shield-shadow h-72 w-60" title="Blason composé" />
          <p className="mt-5 rounded-lg border-l-4 border-gold bg-white/70 px-4 py-3 text-center text-lg italic leading-snug">
            {text}
          </p>
          {warns.map((w) => (
            <p key={w} className="mt-3 rounded-lg bg-gold/15 px-3 py-2 text-sm text-ink">
              ⚠️ {w}
            </p>
          ))}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button
              className="btn btn-primary !py-2 !text-sm"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(text);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                } catch {
                  /* presse-papiers indisponible */
                }
              }}
            >
              {copied ? "Copié ✔" : "Copier le blasonnement"}
            </button>
            <button className="btn btn-ghost !py-2 !text-sm" onClick={randomize}>
              🎲 Au hasard
            </button>
            <button className="btn btn-ghost !py-2 !text-sm" onClick={() => setS(INITIAL)}>
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <Group title="1 · Le champ">
          <div className="flex flex-wrap gap-2">
            {FIELD_KINDS.map((f) => (
              <button key={f.id} className="chip" data-on={s.kind === f.id} onClick={() => set("kind", f.id)}>
                {f.label}
              </button>
            ))}
          </div>
          {s.kind !== "hermine" && <Swatches label={twoColors ? "Émail 1" : "Émail"} value={s.c1} onChange={(t) => set("c1", t)} />}
          {twoColors && <Swatches label="Émail 2" value={s.c2} onChange={(t) => set("c2", t)} />}
        </Group>

        <Group title="2 · La pièce honorable">
          <div className="flex flex-wrap gap-2">
            {ORDINARIES.map((o) => (
              <button key={o.id} className="chip" data-on={s.ord === o.id} onClick={() => set("ord", o.id)}>
                {o.label}
              </button>
            ))}
          </div>
          {s.ord !== "none" && <Swatches label="Émail" value={s.ordC} onChange={(t) => set("ordC", t)} />}
        </Group>

        <Group title="3 · Le meuble">
          <div className="flex flex-wrap gap-2">
            {SHOWN_CHARGES.map((c) => (
              <button key={c} className="chip" data-on={s.charge === c} onClick={() => set("charge", c)}>
                {CHARGES[c].label}
              </button>
            ))}
          </div>
          {s.charge !== "none" && (
            <>
              <Swatches label="Émail" value={s.chargeC} onChange={(t) => set("chargeC", t)} />
              <div className="flex flex-wrap gap-2">
                {LAYOUTS.map((l) => (
                  <button key={l.id} className="chip" data-on={s.layout === l.id} onClick={() => set("layout", l.id)}>
                    {l.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </Group>
        <p className="text-sm text-ink-soft">
          Astuce : respectez la règle de contrariété (jamais métal sur métal, ni couleur sur couleur) et regardez comment
          le blasonnement se construit : champ, pièce, puis meuble.
        </p>
      </div>
    </div>
  );
}

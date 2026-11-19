export type Tincture =
  | "or"
  | "argent"
  | "azur"
  | "gueules"
  | "sable"
  | "sinople"
  | "pourpre"
  | "hermine"
  | "vair";

export const TINCTURE_COLORS: Record<Exclude<Tincture, "hermine" | "vair">, string> = {
  or: "#e9b824",
  argent: "#f6f4ee",
  azur: "#2457b3",
  gueules: "#cc2431",
  sable: "#1c1c1f",
  sinople: "#25873f",
  pourpre: "#7a2f8f",
};

export const TINCTURE_LABELS: Record<Tincture, string> = {
  or: "Or",
  argent: "Argent",
  azur: "Azur",
  gueules: "Gueules",
  sable: "Sable",
  sinople: "Sinople",
  pourpre: "Pourpre",
  hermine: "Hermine",
  vair: "Vair",
};

export type FieldSpec =
  | { k: "plain"; t: Tincture }
  | { k: "party"; d: "pale" | "fess" | "bend" | "bendsin"; a: Tincture; b: Tincture }
  | {
      k: "pattern";
      p: "barry" | "paly" | "bendy" | "chequy" | "lozengy";
      a: Tincture;
      b: Tincture;
      n?: number;
    };

export type OrdinaryType =
  | "cross"
  | "saltire"
  | "fess"
  | "pale"
  | "bend"
  | "bendsin"
  | "chevron"
  | "chief"
  | "bordure"
  | "canton"
  | "tressure"
  | "label"
  | "chains";

export interface Ordinary {
  k: OrdinaryType;
  t: Tincture;
  w?: number;
  over?: boolean;
}

export type ChargeType =
  | "fleurdelis"
  | "lion"
  | "leopard"
  | "eagle"
  | "eagle2"
  | "alerion"
  | "roundel"
  | "star"
  | "crescent"
  | "crown"
  | "mascle"
  | "lozenge"
  | "billet"
  | "castle"
  | "ship"
  | "dolphin"
  | "heart"
  | "crosslet"
  | "crosspotent"
  | "croixtoulouse"
  // nouveaux meubles
  | "rose"
  | "key"
  | "sword"
  | "bear"
  | "harp"
  | "escallop"
  | "tree"
  | "tower";

export type LayoutName =
  | "1"
  | "2pal"
  | "3pal"
  | "2-1"
  | "3fess"
  | "2fess"
  | "3x3"
  | "4cantons";

export interface Charge {
  type: ChargeType;
  t: Tincture;
  at: LayoutName | "semy" | [number, number][];
  s?: number;
  crowned?: boolean;
  under?: boolean;
  t2?: Tincture;
  gap?: number;
}

export interface ShieldSpec {
  field: FieldSpec;
  ordinaries?: Ordinary[];
  charges?: Charge[];
  quarters?: [ShieldSpec, ShieldSpec, ShieldSpec, ShieldSpec];
}

export type Category = "etats" | "provinces" | "villes" | "maisons";

export const CATEGORY_LABELS: Record<Category, string> = {
  etats: "Royaumes & États",
  provinces: "Provinces & principautés",
  villes: "Villes",
  maisons: "Maisons & personnages",
};

export interface ArmEntry {
  id: string;
  name: string;
  subtitle: string;
  category: Category;
  difficulty: 1 | 2 | 3;
  blazon: string;
  note: string;
  shield: ShieldSpec;
}

import type { ReactNode } from "react";
import type { ChargeType } from "./types";

export interface DrawProps {
  /** couleur de remplissage (ou de contour pour la passe d'ombre) */
  c: string;
  /** épaisseur ajoutée (passe de contour) ; 0 pour la passe de couleur */
  ox: number;
  /** couleur des détails (traits fins) */
  d: string;
  /** couleur secondaire (langue, fond de croix vidée) */
  t2: string;
  crowned?: boolean;
}

type Drawer = (p: DrawProps) => ReactNode;

const star = (R: number, r: number) => {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? R : r;
    const a = (-90 + i * 36) * (Math.PI / 180);
    pts.push(`${(rad * Math.cos(a)).toFixed(2)},${(rad * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(" ");
};

function solid(c: string, ox: number, d: string, key?: string) {
  return (
    <path
      key={key}
      d={d}
      fill={c}
      stroke={c}
      strokeWidth={ox}
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  );
}

function limb(c: string, ox: number, d: string, w: number, key?: string) {
  return (
    <path
      key={key}
      d={d}
      fill="none"
      stroke={c}
      strokeWidth={w + ox}
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  );
}

function fine(d: string, color: string, w = 1.6, key?: string) {
  return (
    <path
      key={key}
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={w}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function crownShape(c: string, ox: number, d: string, cx: number, cy: number, sc: number) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${sc})`}>
      {solid(c, ox, "M-16,10 L-18,-6 L-9,2 L-5,-12 L0,0 L5,-12 L9,2 L18,-6 L16,10 Z")}
      {[
        [-18, -8],
        [-5, -14],
        [5, -14],
        [18, -8],
      ].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={2.6} fill={c} stroke={c} strokeWidth={ox} />
      ))}
      {ox === 0 && fine("M-16,6 L16,6", d, 1)}
    </g>
  );
}

const fleurdelis: Drawer = ({ c, ox, d }) => {
  const side =
    "M5,6 C8,-10 24,-30 40,-26 C54,-22 50,-2 38,6 C30,11 20,10 14,6 C22,4 30,-2 30,-10 C30,-18 20,-16 14,-8 C10,-2 8,4 5,6 Z";
  const low =
    "M4,22 C6,32 16,38 30,40 C36,41 41,44 44,50 C32,52 12,50 0,38 Z";
  return (
    <g>
      {solid(c, ox, "M0,-50 C11,-38 16,-22 11,-6 C9,2 5,7 0,10 C-5,7 -9,2 -11,-6 C-16,-22 -11,-38 0,-50 Z")}
      {solid(c, ox, side)}
      <g transform="scale(-1 1)">{solid(c, ox, side)}</g>
      {solid(c, ox, "M-24,12 L24,12 L24,22 L-24,22 Z")}
      {solid(c, ox, low)}
      <g transform="scale(-1 1)">{solid(c, ox, low)}</g>
      {solid(c, ox, "M-6,22 L6,22 L6,40 L0,50 L-6,40 Z")}
      {ox === 0 && fine("M-24,12 L24,12 M-24,22 L24,22", d, 1)}
    </g>
  );
};

const lion: Drawer = ({ c, ox, d, t2, crowned }) => (
  <g>
    {/* queue en S, houppe */}
    {limb(c, ox, "M16,22 C40,28 52,6 44,-14 C40,-24 48,-30 43,-40", 4.6)}
    {solid(c, ox, "M43,-38 C50,-48 56,-40 52,-33 C50,-28 44,-28 41,-33 Z")}
    {/* jambes postérieures */}
    {limb(c, ox, "M14,14 L9,30", 15)}
    {limb(c, ox, "M9,30 L-1,43 L-16,46", 8.5)}
    {limb(c, ox, "M18,12 L32,24 L26,38", 8)}
    {/* corps */}
    {solid(c, ox, "M-26,-26 C-16,-32 2,-28 6,-16 C9,-8 9,0 16,8 C25,15 26,28 18,34 C10,38 2,30 -2,20 C-6,10 -4,2 -10,-4 C-18,-10 -28,-14 -26,-26 Z")}
    {/* jambes antérieures */}
    {limb(c, ox, "M-12,-14 L-29,-10 L-46,-22", 9)}
    {limb(c, ox, "M-9,0 L-28,5 L-45,1", 9)}
    {/* crinière en flammèches */}
    {[
      [-8, -44, 9],
      [-2, -35, 9],
      [-4, -24, 9],
      [-12, -16, 8],
      [-20, -12, 7],
      [-16, -50, 6],
    ].map(([x, y, r]) => (
      <circle key={`${x}${y}`} cx={x} cy={y} r={r} fill={c} stroke={c} strokeWidth={ox} />
    ))}
    {/* tête */}
    {solid(c, ox, "M-16,-52 C-26,-54 -38,-47 -44,-39 L-35,-35 L-46,-31 L-36,-26 L-40,-22 C-28,-20 -16,-26 -10,-38 Z")}
    {/* oreille */}
    {solid(c, ox, "M-12,-54 L-8,-62 L-3,-52 Z")}
    {crowned && crownShape("#e9b824", ox, d, -9, -62, 0.62)}
    {ox === 0 && (
      <g>
        <path d="M-37,-34 C-33,-30 -39,-29 -37,-26" fill={t2} stroke={t2} strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="-27" cy="-43" r="2" fill={d} />
        {fine("M-6,-46 C-10,-42 -10,-38 -8,-34 M-1,-38 C-6,-34 -7,-30 -5,-26 M-6,-26 C-10,-22 -12,-20 -12,-16 M-2,-52 C-8,-52 -12,-50 -14,-46", d, 1.2)}
        {fine("M-16,-14 C-8,-10 -2,-4 2,6 M6,6 C12,10 16,16 14,22", d, 1.2)}
        {fine("M-46,-22 L-49,-26 M-46,-22 L-51,-20 M-45,1 L-49,-3 M-45,1 L-50,3", d, 1.1)}
      </g>
    )}
  </g>
);

const leopard: Drawer = ({ c, ox, d, t2, crowned }) => (
  <g>
    {limb(c, ox, "M26,-4 C46,-6 48,-24 38,-32 C34,-36 38,-42 44,-40", 4.5)}
    {solid(c, ox, "M44,-46 C51,-44 51,-34 44,-33 C38,-34 38,-44 44,-46 Z")}
    {limb(c, ox, "M18,10 L16,28 L6,29", 8.5)}
    {limb(c, ox, "M24,6 L34,18 L28,28", 7)}
    {solid(c, ox, "M-26,-8 C-12,-16 12,-16 26,-8 C33,-3 32,9 25,13 C12,18 -12,18 -26,12 C-33,8 -33,-4 -26,-8 Z")}
    {limb(c, ox, "M-12,12 L-12,30 L-22,31", 8.5)}
    {limb(c, ox, "M-20,8 L-34,16 L-42,12", 7)}
    {/* tête de face : crinière puis visage */}
    {solid(c, ox, "M-28,-36 C-14,-38 -8,-22 -14,-10 C-20,-4 -34,-4 -40,-10 C-46,-22 -40,-36 -28,-36 Z")}
    {solid(c, ox, "M-38,-34 L-34,-44 L-28,-37 Z")}
    {solid(c, ox, "M-18,-34 L-22,-44 L-28,-37 Z")}
    {crowned && crownShape("#e9b824", ox, d, -28, -46, 0.6)}
    {ox === 0 && (
      <g>
        <ellipse cx="-27" cy="-22" rx="8.5" ry="10" fill={c} stroke={d} strokeWidth="1.1" />
        <circle cx="-31" cy="-25" r="1.6" fill={d} />
        <circle cx="-23" cy="-25" r="1.6" fill={d} />
        <path d="M-29.5,-19 L-24.5,-19 L-27,-16 Z" fill={d} />
        <path d="M-31,-14 C-29,-12 -25,-12 -23,-14" fill="none" stroke={d} strokeWidth="1.1" />
        <path d="M-27,-13 C-27,-11 -27,-9 -26,-8" fill="none" stroke={t2} strokeWidth="2.2" strokeLinecap="round" />
        {fine("M-24,-8 C-6,-14 10,-14 22,-8", d, 1)}
      </g>
    )}
  </g>
);

const wing = (c: string, ox: number) =>
  solid(
    c,
    ox,
    "M8,-20 C22,-32 38,-36 50,-48 C47,-38 51,-34 47,-26 C50,-22 50,-16 45,-10 C48,-5 45,1 39,5 C38,10 33,14 27,16 C25,20 19,23 11,24 Z",
  );

const eagleBody =
  "M-13,-20 C-19,-8 -15,16 -9,28 L9,28 C15,16 19,-8 13,-20 C7,-27 -7,-27 -13,-20 Z";

const eagle: Drawer = ({ c, ox, d, t2 }) => (
  <g>
    {limb(c, ox, "M-9,22 L-26,36", 6)}
    {limb(c, ox, "M9,22 L26,36", 6)}
    {solid(c, ox, "M-10,22 L-16,48 L-7,43 L0,50 L7,43 L16,48 L10,22 Z")}
    {wing(c, ox)}
    <g transform="scale(-1 1)">{wing(c, ox)}</g>
    {solid(c, ox, eagleBody)}
    {limb(c, ox, "M0,-22 C-2,-28 -4,-30 -4,-34", 9)}
    {solid(c, ox, "M-3,-42 C-10,-42 -13,-35 -10,-30 C-6,-26 2,-28 3,-34 C4,-39 1,-42 -3,-42 Z")}
    {solid(c, ox, "M-10,-38 C-18,-39 -25,-34 -24,-27 C-20,-30 -15,-30 -10,-31 Z")}
    {ox === 0 && (
      <g>
        <path d="M-10,-38 C-18,-39 -25,-34 -24,-27 C-20,-30 -15,-30 -10,-31 Z" fill={c} />
        <path d="M-12,-34 L-18,-33" stroke={t2} strokeWidth="2" strokeLinecap="round" />
        <circle cx="-5" cy="-36" r="1.6" fill={d} />
        {fine("M-26,36 L-31,34 M-26,36 L-30,40 M-26,36 L-26,41 M26,36 L31,34 M26,36 L30,40 M26,36 L26,41", t2, 1.6)}
        {fine("M-4,-14 C-6,0 -4,14 -2,24 M4,-14 C6,0 4,14 2,24", d, 1)}
        {fine("M12,-14 C22,-22 34,-28 44,-38 M14,-4 C26,-10 36,-16 44,-22 M16,6 C26,2 34,-4 40,-6", d, 1)}
        <g transform="scale(-1 1)">
          {fine("M12,-14 C22,-22 34,-28 44,-38 M14,-4 C26,-10 36,-16 44,-22 M16,6 C26,2 34,-4 40,-6", d, 1)}
        </g>
      </g>
    )}
  </g>
);

const eagle2: Drawer = ({ c, ox, d, t2 }) => (
  <g>
    {limb(c, ox, "M-9,22 L-26,36", 6)}
    {limb(c, ox, "M9,22 L26,36", 6)}
    {solid(c, ox, "M-10,22 L-16,48 L-7,43 L0,50 L7,43 L16,48 L10,22 Z")}
    {wing(c, ox)}
    <g transform="scale(-1 1)">{wing(c, ox)}</g>
    {solid(c, ox, eagleBody)}
    {limb(c, ox, "M-6,-20 C-9,-28 -13,-32 -14,-36", 7)}
    {limb(c, ox, "M6,-20 C9,-28 13,-32 14,-36", 7)}
    {solid(c, ox, "M-14,-45 C-21,-45 -24,-38 -21,-33 C-17,-29 -9,-31 -8,-37 C-7,-42 -10,-45 -14,-45 Z")}
    {solid(c, ox, "M14,-45 C21,-45 24,-38 21,-33 C17,-29 9,-31 8,-37 C7,-42 10,-45 14,-45 Z")}
    {solid(c, ox, "M-21,-41 C-29,-42 -35,-37 -34,-30 C-30,-33 -26,-33 -21,-34 Z")}
    {solid(c, ox, "M21,-41 C29,-42 35,-37 34,-30 C30,-33 26,-33 21,-34 Z")}
    {ox === 0 && (
      <g>
        <circle cx="-15" cy="-39" r="1.5" fill={d} />
        <circle cx="15" cy="-39" r="1.5" fill={d} />
        {fine("M-24,-38 L-30,-36 M24,-38 L30,-36", t2, 1.8)}
        {fine("M-26,36 L-31,34 M-26,36 L-30,40 M26,36 L31,34 M26,36 L30,40", t2, 1.6)}
        {fine("M12,-14 C22,-22 34,-28 44,-38 M14,-4 C26,-10 36,-16 44,-22 M16,6 C26,2 34,-4 40,-6", d, 1)}
        <g transform="scale(-1 1)">
          {fine("M12,-14 C22,-22 34,-28 44,-38 M14,-4 C26,-10 36,-16 44,-22 M16,6 C26,2 34,-4 40,-6", d, 1)}
        </g>
      </g>
    )}
    {crownShape("#e9b824", ox, d, 0, -54, 0.55)}
  </g>
);

const alerion: Drawer = ({ c, ox, d }) => (
  <g transform="translate(0 4)">
    {solid(c, ox, "M-10,22 L-14,44 L0,38 L14,44 L10,22 Z")}
    {wing(c, ox)}
    <g transform="scale(-1 1)">{wing(c, ox)}</g>
    {solid(c, ox, eagleBody)}
    {limb(c, ox, "M0,-22 C-2,-28 -4,-30 -4,-34", 9)}
    {solid(c, ox, "M-3,-42 C-10,-42 -13,-35 -10,-30 C-6,-26 2,-28 3,-34 C4,-39 1,-42 -3,-42 Z")}
    {ox === 0 && (
      <g>
        <circle cx="-5" cy="-36" r="1.6" fill={d} />
        {fine("M12,-14 C22,-22 34,-28 44,-38 M14,-4 C26,-10 36,-16 44,-22", d, 1.2)}
        <g transform="scale(-1 1)">
          {fine("M12,-14 C22,-22 34,-28 44,-38 M14,-4 C26,-10 36,-16 44,-22", d, 1.2)}
        </g>
      </g>
    )}
  </g>
);

const roundel: Drawer = ({ c, ox }) => (
  <circle r={46} fill={c} stroke={c} strokeWidth={ox} />
);

const starC: Drawer = ({ c, ox }) => (
  <polygon points={star(48, 20)} fill={c} stroke={c} strokeWidth={ox} strokeLinejoin="round" />
);

const crescent: Drawer = ({ c, ox }) =>
  solid(c, ox, "M-44,-24 A48,48 0 0 0 44,-24 C34,-4 18,6 0,6 C-18,6 -34,-4 -44,-24 Z");

const crown: Drawer = ({ c, ox, d }) => (
  <g>
    {solid(c, ox, "M-38,26 L-42,-18 L-22,6 L-12,-30 L0,2 L12,-30 L22,6 L42,-18 L38,26 Z")}
    {[
      [-42, -22],
      [-12, -34],
      [12, -34],
      [42, -22],
      [0, -2],
    ].map(([x, y]) => (
      <circle key={`${x}${y}`} cx={x} cy={y} r={5.5} fill={c} stroke={c} strokeWidth={ox} />
    ))}
    {ox === 0 && fine("M-39,14 L39,14 M-40,4 L-40,4", d, 1.4)}
  </g>
);

const mascle: Drawer = ({ c, ox }) => (
  <path
    d="M0,-48 L36,0 L0,48 L-36,0 Z M0,-24 L17,0 L0,24 L-17,0 Z"
    fillRule="evenodd"
    fill={c}
    stroke={c}
    strokeWidth={ox}
    strokeLinejoin="round"
  />
);

const lozenge: Drawer = ({ c, ox }) => solid(c, ox, "M0,-48 L34,0 L0,48 L-34,0 Z");

const billet: Drawer = ({ c, ox }) => solid(c, ox, "M-17,-30 L17,-30 L17,30 L-17,30 Z");

const merlons = (x: number, w: number, y: number, c: string, ox: number) =>
  [0, 1, 2].map((i) => (
    <rect
      key={`${x}-${i}`}
      x={x + i * (w / 2.5)}
      y={y - 9}
      width={w / 5}
      height={10}
      fill={c}
      stroke={c}
      strokeWidth={ox}
      strokeLinejoin="round"
    />
  ));

const castle: Drawer = ({ c, ox, t2 }) => (
  <g>
    {solid(c, ox, "M-44,-12 H-20 V46 H-44 Z")}
    {solid(c, ox, "M20,-12 H44 V46 H20 Z")}
    {solid(c, ox, "M-18,-34 H18 V46 H-18 Z")}
    {solid(c, ox, "M-44,18 H44 V46 H-44 Z")}
    {merlons(-44, 24, -12, c, ox)}
    {merlons(20, 24, -12, c, ox)}
    {merlons(-18, 36, -34, c, ox)}
    {ox === 0 && (
      <g fill={t2}>
        <path d="M-7,46 V30 A7,7 0 0 1 7,30 V46 Z" />
        <rect x="-4" y="-22" width="8" height="12" rx="4" />
        <rect x="-35" y="2" width="6" height="10" rx="3" />
        <rect x="29" y="2" width="6" height="10" rx="3" />
      </g>
    )}
  </g>
);

const ship: Drawer = ({ c, ox, d }) => (
  <g>
    {solid(c, ox, "M-46,8 L46,8 C42,28 30,34 0,34 C-30,34 -42,28 -46,8 Z")}
    {limb(c, ox, "M0,-44 L0,10", 3.6)}
    {solid(c, ox, "M-32,-34 C-14,-28 14,-28 32,-34 L28,-2 C12,-6 -12,-6 -28,-2 Z")}
    {solid(c, ox, "M0,-46 L16,-42 L0,-37 Z")}
    {limb(c, ox, "M-48,42 q8,-7 16,0 t16,0 t16,0 t16,0 t16,0 t16,0", 3.4)}
    {ox === 0 && fine("M-30,-20 C-12,-14 12,-14 30,-20 M-44,16 L44,16", d, 1)}
  </g>
);

const dolphin: Drawer = ({ c, ox, d, t2 }) => (
  <g>
    {solid(c, ox, "M-4,-36 C0,-44 8,-50 14,-52 C12,-46 14,-40 18,-34 Z")}
    {solid(c, ox, "M-38,-30 C-8,-52 36,-36 40,4 C42,24 32,38 20,44 L28,54 L6,52 L2,40 C14,30 20,20 18,6 C14,-14 -10,-20 -32,-8 Z")}
    {solid(c, ox, "M-52,-36 C-46,-48 -30,-48 -26,-36 C-28,-22 -42,-20 -50,-26 Z")}
    {solid(c, ox, "M-52,-34 L-58,-32 L-50,-28 Z")}
    {solid(c, ox, "M24,12 L44,14 L32,28 Z")}
    {ox === 0 && (
      <g>
        <circle cx="-38" cy="-38" r="2" fill={d} />
        {fine("M-26,-30 C-28,-24 -32,-18 -34,-14", t2, 1.8)}
        {fine("M-50,-30 L-34,-30", d, 1)}
      </g>
    )}
  </g>
);

const heart: Drawer = ({ c, ox }) =>
  solid(c, ox, "M0,40 C-52,2 -34,-40 0,-14 C34,-40 52,2 0,40 Z");

const crosslet: Drawer = ({ c, ox }) => (
  <g>
    {solid(c, ox, "M-5,-40 H5 V40 H-5 Z")}
    {solid(c, ox, "M-40,-5 H40 V5 H-40 Z")}
    {solid(c, ox, "M-14,-44 H14 V-36 H-14 Z")}
    {solid(c, ox, "M-14,36 H14 V44 H-14 Z")}
    {solid(c, ox, "M-44,-14 H-36 V14 H-44 Z")}
    {solid(c, ox, "M36,-14 H44 V14 H36 Z")}
  </g>
);

const crosspotent: Drawer = ({ c, ox }) => (
  <g>
    {solid(c, ox, "M-8,-38 H8 V38 H-8 Z")}
    {solid(c, ox, "M-38,-8 H38 V8 H-38 Z")}
    {solid(c, ox, "M-24,-48 H24 V-36 H-24 Z")}
    {solid(c, ox, "M-24,36 H24 V48 H-24 Z")}
    {solid(c, ox, "M-48,-24 H-36 V24 H-48 Z")}
    {solid(c, ox, "M36,-24 H48 V24 H36 Z")}
  </g>
);

const croixtoulouse: Drawer = ({ c, ox, t2 }) => (
  <g>
    {solid(c, ox, "M-11,-42 H11 V-11 H42 V11 H11 V42 H-11 V11 H-42 V-11 H-11 Z")}
    {[
      [0, -45],
      [0, 45],
      [-45, 0],
      [45, 0],
    ].map(([x, y]) => (
      <circle key={`${x}${y}`} cx={x} cy={y} r={7} fill={c} stroke={c} strokeWidth={ox} />
    ))}
    {ox === 0 && (
      <g fill={t2}>
        <rect x="-3.5" y="-38" width="7" height="76" />
        <rect x="-38" y="-3.5" width="76" height="7" />
      </g>
    )}
  </g>
);

export const CHARGE_DRAWERS: Record<ChargeType, Drawer> = {
  fleurdelis,
  lion,
  leopard,
  eagle,
  eagle2,
  alerion,
  roundel,
  star: starC,
  crescent,
  crown,
  mascle,
  lozenge,
  billet,
  castle,
  ship,
  dolphin,
  heart,
  crosslet,
  crosspotent,
  croixtoulouse,
};

export const CHARGE_NAMES: Record<ChargeType, string> = {
  fleurdelis: "fleur de lys",
  lion: "lion",
  leopard: "léopard",
  eagle: "aigle",
  eagle2: "aigle bicéphale",
  alerion: "alérion",
  roundel: "tourteau / besant",
  star: "étoile",
  crescent: "croissant",
  crown: "couronne",
  mascle: "macle",
  lozenge: "losange",
  billet: "billette",
  castle: "château",
  ship: "nef",
  dolphin: "dauphin",
  heart: "cœur",
  crosslet: "croisette",
  crosspotent: "croix potencée",
  croixtoulouse: "croix cléchée",
};

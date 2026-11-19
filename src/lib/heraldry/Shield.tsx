import { useId } from "react";
import type { ReactNode } from "react";
import { CHARGE_DRAWERS } from "./charges";
import {
  TINCTURE_COLORS,
  type Charge,
  type ChargeType,
  type FieldSpec,
  type LayoutName,
  type Ordinary,
  type ShieldSpec,
  type Tincture,
} from "./types";

export const SHIELD_PATH =
  "M4,4 H96 V58 C96,88 78,108 50,118 C22,108 4,88 4,58 Z";

const OUT = "#26262a";

interface Ctx {
  uid: string;
  n: { v: number };
}

const fillOf = (t: Tincture, ctx: Ctx) =>
  t === "hermine" ? `url(#${ctx.uid}-erm)` :
  t === "vair" ? `url(#${ctx.uid}-vair)` :
  TINCTURE_COLORS[t];

const LAYOUTS: Record<LayoutName, { pos: [number, number][]; s: number }> = {
  "1": { pos: [[50, 52]], s: 56 },
  "2pal": {
    pos: [
      [50, 33],
      [50, 78],
    ],
    s: 44,
  },
  "3pal": {
    pos: [
      [50, 30],
      [50, 60],
      [50, 90],
    ],
    s: 42,
  },
  "2-1": {
    pos: [
      [28, 31],
      [72, 31],
      [50, 76],
    ],
    s: 38,
  },
  "3fess": {
    pos: [
      [24, 50],
      [50, 50],
      [76, 50],
    ],
    s: 28,
  },
  "2fess": {
    pos: [
      [29, 50],
      [71, 50],
    ],
    s: 40,
  },
  "3x3": {
    pos: [
      [24, 27],
      [50, 27],
      [76, 27],
      [24, 57],
      [50, 57],
      [76, 57],
      [30, 87],
      [50, 87],
      [70, 87],
    ],
    s: 25,
  },
  "4cantons": {
    pos: [
      [26, 24],
      [74, 24],
      [26, 72],
      [74, 72],
    ],
    s: 22,
  },
};

function semyPositions(s: number, gap = 1): [number, number][] {
  const dx = s * 1.9 * gap;
  const dy = s * 1.55 * gap;
  const out: [number, number][] = [];
  for (let r = 0; r * dy < 125; r++) {
    const y = 6 + r * dy;
    for (let c = -7; c <= 7; c++) {
      const x = 50 + (c + (r % 2) * 0.5 - 0.25) * dx;
      if (x > -s / 2 && x < 100 + s / 2) out.push([x, y]);
    }
  }
  return out;
}

const isLight = (t: Tincture) =>
  t === "or" || t === "argent" || t === "hermine" || t === "vair";

function defaultSecondary(type: ChargeType, t: Tincture): Tincture {
  switch (type) {
    case "eagle":
    case "eagle2":
      return t === "or" ? "gueules" : "or";
    case "lion":
    case "leopard":
      return t === "gueules" ? "azur" : "gueules";
    case "castle":
      return t === "azur" ? "sable" : "azur";
    case "dolphin":
      return t === "gueules" ? "azur" : "gueules";
    default:
      return "gueules";
  }
}

function ChargeGlyph({
  type,
  t,
  t2,
  x,
  y,
  s,
  crowned,
  ctx,
}: {
  type: ChargeType;
  t: Tincture;
  t2?: Tincture;
  x: number;
  y: number;
  s: number;
  crowned?: boolean;
  ctx: Ctx;
}) {
  const draw = CHARGE_DRAWERS[type];
  const props = {
    d: isLight(t) ? "#2a2a2a" : "#d8d3c0",
    t2: fillOf(t2 ?? defaultSecondary(type, t), ctx),
    crowned,
  };
  return (
    <g transform={`translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${(s / 100).toFixed(4)})`}>
      {draw({ ...props, c: OUT, ox: 3.6 })}
      {draw({ ...props, c: fillOf(t, ctx), ox: 0 })}
    </g>
  );
}

function renderCharge(ch: Charge, ctx: Ctx, key: string): ReactNode {
  let positions: [number, number][];
  let s = ch.s;
  if (ch.at === "semy") {
    s = s ?? 16;
    positions = semyPositions(s, ch.gap);
  } else if (typeof ch.at === "string") {
    const l = LAYOUTS[ch.at];
    positions = l.pos;
    s = s ?? l.s;
  } else {
    positions = ch.at;
    s = s ?? 30;
  }
  return (
    <g key={key}>
      {positions.map(([x, y], i) => (
        <ChargeGlyph
          key={i}
          type={ch.type}
          t={ch.t}
          t2={ch.t2}
          x={x}
          y={y}
          s={s as number}
          crowned={ch.crowned}
          ctx={ctx}
        />
      ))}
    </g>
  );
}

function bar(cx: number, cy: number, len: number, w: number, angle: number) {
  return { x: cx - len / 2, y: cy - w / 2, width: len, height: w, transform: `rotate(${angle} ${cx} ${cy})` };
}

function ordinaryShapes(o: Ordinary, fill: string, stroke: string, sw: number, grow: number): ReactNode {
  const common = { fill, stroke, strokeWidth: sw, strokeLinejoin: "round" as const };
  const g = grow;
  switch (o.k) {
    case "cross": {
      const w = (o.w ?? 20) + g;
      const h = w / 2;
      const cx = 50;
      const cy = 46;
      return (
        <path
          {...common}
          d={`M${cx - h},-30 H${cx + h} V${cy - h} H130 V${cy + h} H${cx + h} V150 H${cx - h} V${cy + h} H-30 V${cy - h} H${cx - h} Z`}
        />
      );
    }
    case "saltire": {
      const w = (o.w ?? 18) + g;
      return (
        <g {...common}>
          <rect {...bar(50, 56, 300, w, 50)} />
          <rect {...bar(50, 56, 300, w, -50)} />
        </g>
      );
    }
    case "fess":
      return <rect {...common} {...bar(50, 52, 260, (o.w ?? 24) + g, 0)} />;
    case "pale":
      return <rect {...common} {...bar(50, 60, 260, (o.w ?? 24) + g, 90)} />;
    case "bend":
      return <rect {...common} {...bar(50, 58, 320, (o.w ?? 24) + g, 50)} />;
    case "bendsin":
      return <rect {...common} {...bar(50, 58, 320, (o.w ?? 24) + g, -50)} />;
    case "chevron": {
      const w = ((o.w ?? 20) + g) * 1.35;
      return (
        <path
          {...common}
          d={`M-20,104 L50,34 L120,104 L120,${104 + w} L50,${34 + w} L-20,${104 + w} Z`}
        />
      );
    }
    case "chief":
      return <rect {...common} x={-20} y={-20} width={140} height={(o.w ?? 30) + 20 + g / 2} />;
    case "canton": {
      const w = (o.w ?? 38) + g / 2;
      return <rect {...common} x={-20} y={-20} width={w + 20} height={w + 20} />;
    }
    case "bordure":
      return (
        <path
          d={SHIELD_PATH}
          fill="none"
          stroke={stroke === fill ? fill : fill}
          strokeWidth={(o.w ?? 8) * 2 + g}
          strokeLinejoin="round"
        />
      );
    case "tressure":
      return (
        <g fill="none" stroke={fill} strokeWidth={2 + g}>
          <path d={SHIELD_PATH} transform="translate(50 60) scale(.91) translate(-50 -60)" />
          <path d={SHIELD_PATH} transform="translate(50 60) scale(.83) translate(-50 -60)" />
        </g>
      );
    case "label":
      return (
        <g {...common}>
          <rect x={6} y={8} width={88} height={11 + g} />
          {[24, 50, 76].map((x) => (
            <path key={x} d={`M${x - 8 - g / 2},18 L${x + 8 + g / 2},18 L${x + 5 + g / 2},${38 + g} L${x - 5 - g / 2},${38 + g} Z`} />
          ))}
        </g>
      );
    case "chains":
      return null;
  }
}

function renderOrdinary(o: Ordinary, ctx: Ctx, key: string): ReactNode {
  if (o.k === "chains") {
    const c = fillOf(o.t, ctx);
    return (
      <g key={key} fill="none" stroke={c} strokeWidth={3.4} strokeDasharray="5.5 2.6" strokeLinecap="round">
        <path d={SHIELD_PATH} transform="translate(50 60) scale(.86) translate(-50 -60)" />
        <path d="M50,8 V108 M8,50 H92" />
        <path d="M14,14 L86,98 M86,14 L14,98" />
        <polygon points="50,40 60,50 50,60 40,50" fill="#25873f" stroke={OUT} strokeWidth="1.2" strokeDasharray="none" />
      </g>
    );
  }
  const fill = fillOf(o.t, ctx);
  if (o.k === "bordure" || o.k === "tressure") {
    return (
      <g key={key}>
        <g stroke={OUT}>{ordinaryShapes(o, OUT, OUT, 1, 2.2)}</g>
        {ordinaryShapes(o, fill, fill, 0, 0)}
      </g>
    );
  }
  return (
    <g key={key}>
      {ordinaryShapes(o, OUT, OUT, 0, 2)}
      {ordinaryShapes(o, fill, fill, 0, 0)}
    </g>
  );
}

function renderField(f: FieldSpec, ctx: Ctx): ReactNode {
  switch (f.k) {
    case "plain":
      return <rect x={-5} y={-5} width={110} height={130} fill={fillOf(f.t, ctx)} />;
    case "party": {
      const A = fillOf(f.a, ctx);
      const B = fillOf(f.b, ctx);
      return (
        <g>
          <rect x={-5} y={-5} width={110} height={130} fill={B} />
          {f.d === "pale" && <rect x={-5} y={-5} width={55} height={130} fill={A} />}
          {f.d === "fess" && <rect x={-5} y={-5} width={110} height={65} fill={A} />}
          {f.d === "bend" && <polygon points="-5,-5 105,-5 105,125" fill={A} />}
          {f.d === "bendsin" && <polygon points="-5,-5 105,-5 -5,125" fill={A} />}
          {f.d === "pale" && <path d="M50,0 V120" stroke={OUT} strokeWidth=".9" />}
          {f.d === "fess" && <path d="M0,60 H100" stroke={OUT} strokeWidth=".9" />}
          {f.d === "bend" && <path d="M0,0 L100,120" stroke={OUT} strokeWidth=".9" />}
          {f.d === "bendsin" && <path d="M100,0 L0,120" stroke={OUT} strokeWidth=".9" />}
        </g>
      );
    }
    case "pattern": {
      const A = fillOf(f.a, ctx);
      const B = fillOf(f.b, ctx);
      const bg = <rect x={-5} y={-5} width={110} height={130} fill={A} />;
      if (f.p === "barry") {
        const n = f.n ?? 8;
        const h = 120 / n;
        return (
          <g>
            {bg}
            {Array.from({ length: n }, (_, i) =>
              i % 2 === 1 ? <rect key={i} x={-5} y={i * h} width={110} height={h + 0.3} fill={B} /> : null,
            )}
          </g>
        );
      }
      if (f.p === "paly") {
        const n = f.n ?? 6;
        const w = 100 / n;
        return (
          <g>
            {bg}
            {Array.from({ length: n }, (_, i) =>
              i % 2 === 1 ? <rect key={i} x={i * w} y={-5} width={w + 0.3} height={130} fill={B} /> : null,
            )}
          </g>
        );
      }
      if (f.p === "bendy") {
        const n = f.n ?? 6;
        const h = 112 / n;
        return (
          <g>
            {bg}
            <g transform="translate(50 60) rotate(50)">
              {Array.from({ length: n }, (_, i) =>
                i % 2 === 1 ? (
                  <rect key={i} x={-200} y={-(n * h) / 2 + i * h} width={400} height={h + 0.3} fill={B} />
                ) : null,
              )}
            </g>
          </g>
        );
      }
      if (f.p === "chequy") {
        const n = f.n ?? 6;
        const cs = 100 / n;
        const rows = Math.ceil(120 / cs);
        const cells: ReactNode[] = [];
        for (let r = 0; r < rows; r++)
          for (let c = 0; c < n; c++)
            if ((r + c) % 2 === 1)
              cells.push(<rect key={`${r}-${c}`} x={c * cs} y={r * cs} width={cs + 0.2} height={cs + 0.2} fill={B} />);
        return (
          <g>
            {bg}
            {cells}
          </g>
        );
      }
      // lozengy
      const n = f.n ?? 5;
      const w = 100 / n;
      const h = w * 1.45;
      const cells: ReactNode[] = [];
      for (let r = 0; r * h < 130; r++)
        for (let c = 0; c <= n; c++) {
          const cx = c * w;
          const cy = r * h;
          cells.push(
            <path
              key={`${r}-${c}`}
              d={`M${cx},${cy - h / 2} L${cx + w / 2},${cy} L${cx},${cy + h / 2} L${cx - w / 2},${cy} Z`}
              fill={B}
              stroke={B}
              strokeWidth=".2"
            />,
          );
        }
      return (
        <g>
          {bg}
          {cells}
        </g>
      );
    }
  }
}

function renderContent(spec: ShieldSpec, ctx: Ctx): ReactNode {
  if (spec.quarters) {
    const cells: [number, number][] = [
      [0, 0],
      [50, 0],
      [0, 60],
      [50, 60],
    ];
    return (
      <g>
        {spec.quarters.map((q, i) => {
          const id = `${ctx.uid}-q${ctx.n.v++}`;
          const [x0, y0] = cells[i];
          return (
            <g key={i}>
              <clipPath id={id}>
                <rect x={x0 - (x0 === 0 ? 5 : 0)} y={y0 - (y0 === 0 ? 5 : 0)} width={x0 === 0 ? 55 : 55} height={y0 === 0 ? 65 : 65} />
              </clipPath>
              <g clipPath={`url(#${id})`}>
                <g transform={`translate(${x0} ${y0}) scale(.5)`}>{renderContent(q, ctx)}</g>
              </g>
            </g>
          );
        })}
        <path d="M50,0 V120 M0,60 H100" stroke={OUT} strokeWidth=".9" />
        {spec.ordinaries?.map((o, i) => renderOrdinary(o, ctx, `qo${i}`))}
      </g>
    );
  }
  const under = spec.charges?.filter((c) => c.under) ?? [];
  const over = spec.charges?.filter((c) => !c.under) ?? [];
  const ords = spec.ordinaries?.filter((o) => !o.over) ?? [];
  const ordsOver = spec.ordinaries?.filter((o) => o.over) ?? [];
  return (
    <g>
      {renderField(spec.field, ctx)}
      {under.map((c, i) => renderCharge(c, ctx, `u${i}`))}
      {ords.map((o, i) => renderOrdinary(o, ctx, `o${i}`))}
      {over.map((c, i) => renderCharge(c, ctx, `c${i}`))}
      {ordsOver.map((o, i) => renderOrdinary(o, ctx, `ov${i}`))}
    </g>
  );
}

export function Shield({
  spec,
  className,
  title,
}: {
  spec: ShieldSpec;
  className?: string;
  title?: string;
}) {
  const raw = useId();
  const uid = "sh" + raw.replace(/[^a-zA-Z0-9]/g, "");
  const ctx: Ctx = { uid, n: { v: 0 } };
  return (
    <svg
      viewBox="-3 -3 106 126"
      className={className}
      role="img"
      aria-label={title ?? "Blason"}
      xmlns="http://www.w3.org/2000/svg"
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <clipPath id={`${uid}-clip`}>
          <path d={SHIELD_PATH} />
        </clipPath>
        <pattern id={`${uid}-erm`} width="24" height="28" patternUnits="userSpaceOnUse">
          <rect width="24" height="28" fill={TINCTURE_COLORS.argent} />
          {[
            [12, 9],
            [0, 23],
            [24, 23],
          ].map(([x, y]) => (
            <g key={`${x}-${y}`} transform={`translate(${x} ${y})`} fill="#1c1c1f">
              <path d="M0,-7 Q3.4,-2 2.2,2 Q0,0.8 -2.2,2 Q-3.4,-2 0,-7 Z" />
              <circle cx="-3.4" cy="4.6" r="1.1" />
              <circle cx="0" cy="5.4" r="1.1" />
              <circle cx="3.4" cy="4.6" r="1.1" />
            </g>
          ))}
        </pattern>
        <pattern id={`${uid}-vair`} width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill={TINCTURE_COLORS.argent} />
          {/* cloche d'azur (vair classique) */}
          <path
            d="M0,0 H10 V6 Q10,14 5,18 Q0,14 0,6 Z"
            fill={TINCTURE_COLORS.azur}
          />
          <path
            d="M10,10 H20 V16 Q20,24 15,28 Q10,24 10,16 Z"
            fill={TINCTURE_COLORS.azur}
            transform="translate(0 -10)"
          />
        </pattern>
      </defs>
      <path d={SHIELD_PATH} fill="rgba(0,0,0,.22)" transform="translate(1.6 2.2)" />
      <g clipPath={`url(#${uid}-clip)`}>{renderContent(spec, ctx)}</g>
      <path d={SHIELD_PATH} fill="none" stroke={OUT} strokeWidth="2.2" strokeLinejoin="round" />
    </svg>
  );
}

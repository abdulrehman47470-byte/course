import { useId, type ComponentType } from "react";

export type CourseArtVariant =
  | "bioinformatics"
  | "drug-design"
  | "vaccine-design"
  | "data-analysis"
  | "data-visualization"
  | "ai-automation"
  | "ai-product"
  | "linkedin"
  | "job-hunting"
  | "online-earning";

function Motif({ variant }: { variant: CourseArtVariant }) {
  const stroke = "var(--emerald-bright)";
  switch (variant) {
    case "bioinformatics":
      return (
        <g opacity="0.55" fill="none" stroke={stroke} strokeWidth="2.5">
          <path d="M60 40 C140 90, 140 150, 60 200 S -20 310, 60 360" />
          <path d="M220 40 C140 90, 140 150, 220 200 S 300 310, 220 360" />
          {[70, 110, 150, 190, 230, 270, 310].map((y) => (
            <line
              key={y}
              x1={60 + 40 * Math.sin(((y - 40) / 60) * Math.PI)}
              y1={y}
              x2={220 - 40 * Math.sin(((y - 40) / 60) * Math.PI)}
              y2={y}
              strokeWidth="1.5"
              opacity="0.6"
            />
          ))}
        </g>
      );
    case "drug-design":
      return (
        <g opacity="0.55" fill="none" stroke={stroke} strokeWidth="2">
          <circle cx="150" cy="130" r="46" />
          <circle cx="230" cy="180" r="34" />
          <circle cx="130" cy="220" r="28" />
          <line x1="150" y1="130" x2="230" y2="180" />
          <line x1="150" y1="130" x2="130" y2="220" />
          <line x1="230" y1="180" x2="130" y2="220" />
          <circle cx="150" cy="130" r="4" fill={stroke} stroke="none" />
          <circle cx="230" cy="180" r="4" fill={stroke} stroke="none" />
          <circle cx="130" cy="220" r="4" fill={stroke} stroke="none" />
        </g>
      );
    case "vaccine-design":
      return (
        <g opacity="0.55" fill="none" stroke={stroke} strokeWidth="2">
          <circle cx="490" cy="90" r="24" />
          <circle cx="490" cy="90" r="46" />
          <circle cx="490" cy="90" r="68" />
          <circle cx="490" cy="90" r="4" fill={stroke} stroke="none" />
          <line x1="70" y1="300" x2="180" y2="190" strokeWidth="6" strokeLinecap="round" />
          <line x1="150" y1="220" x2="200" y2="270" strokeWidth="6" strokeLinecap="round" />
          <rect
            x="165"
            y="175"
            width="22"
            height="22"
            rx="4"
            transform="rotate(45 176 186)"
            fill={stroke}
            stroke="none"
            opacity="0.7"
          />
        </g>
      );
    case "data-analysis":
      return (
        <g opacity="0.6" stroke="none">
          {[
            { x: 60, h: 70 },
            { x: 110, h: 110 },
            { x: 160, h: 90 },
            { x: 210, h: 150 },
            { x: 260, h: 120 },
            { x: 310, h: 180 },
          ].map((b) => (
            <rect
              key={b.x}
              x={b.x}
              y={340 - b.h}
              width="34"
              height={b.h}
              rx="4"
              fill={stroke}
              opacity="0.5"
            />
          ))}
        </g>
      );
    case "data-visualization":
      return (
        <g opacity="0.6" fill="none" stroke={stroke}>
          <circle
            cx="480"
            cy="150"
            r="70"
            strokeWidth="18"
            strokeDasharray="140 300"
            strokeLinecap="round"
          />
          <circle
            cx="480"
            cy="150"
            r="70"
            strokeWidth="18"
            strokeDasharray="70 300"
            strokeDashoffset="-150"
            strokeLinecap="round"
            opacity="0.5"
          />
          <path
            d="M50 300 L110 260 L170 285 L230 210 L290 240 L350 170"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {[50, 110, 170, 230, 290, 350].map((x, i) => (
            <circle
              key={x}
              cx={x}
              cy={[300, 260, 285, 210, 240, 170][i]}
              r="4"
              fill={stroke}
              stroke="none"
            />
          ))}
        </g>
      );
    case "ai-automation":
      return (
        <g opacity="0.55" fill="none" stroke={stroke} strokeWidth="2">
          <circle cx="180" cy="160" r="50" />
          <circle cx="180" cy="160" r="14" fill={stroke} stroke="none" />
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i / 8) * Math.PI * 2;
            const x1 = 180 + Math.cos(a) * 58,
              y1 = 160 + Math.sin(a) * 58;
            const x2 = 180 + Math.cos(a) * 72,
              y2 = 160 + Math.sin(a) * 72;
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="6" strokeLinecap="round" />
            );
          })}
          <circle cx="300" cy="250" r="26" />
          <circle cx="300" cy="250" r="7" fill={stroke} stroke="none" />
          {Array.from({ length: 6 }).map((_, i) => {
            const a = (i / 6) * Math.PI * 2;
            const x1 = 300 + Math.cos(a) * 30,
              y1 = 250 + Math.sin(a) * 30;
            const x2 = 300 + Math.cos(a) * 39,
              y2 = 250 + Math.sin(a) * 39;
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="4" strokeLinecap="round" />
            );
          })}
        </g>
      );
    case "ai-product":
      return (
        <g opacity="0.55" fill="none" stroke={stroke}>
          <path
            d="M40 320 L300 80"
            strokeWidth="2.5"
            strokeDasharray="2 10"
            strokeLinecap="round"
          />
          <rect x="270" y="60" width="70" height="50" rx="8" strokeWidth="2" />
          <line x1="270" y1="78" x2="340" y2="78" strokeWidth="2" />
          <rect x="150" y="190" width="56" height="40" rx="6" strokeWidth="2" opacity="0.7" />
          <path
            d="M280 100 L300 80 L322 100"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>
      );
    case "linkedin":
      return (
        <g opacity="0.55" stroke={stroke} strokeWidth="1.5" fill="none">
          <line x1="120" y1="140" x2="230" y2="90" />
          <line x1="120" y1="140" x2="210" y2="220" />
          <line x1="230" y1="90" x2="330" y2="150" />
          <line x1="210" y1="220" x2="330" y2="150" />
          <line x1="210" y1="220" x2="150" y2="280" />
          {[
            [120, 140],
            [230, 90],
            [330, 150],
            [210, 220],
            [150, 280],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r={i === 3 ? 12 : 8} fill={stroke} stroke="none" />
          ))}
        </g>
      );
    case "job-hunting":
      return (
        <g opacity="0.55" fill="none" stroke={stroke} strokeWidth="2">
          <circle cx="220" cy="150" r="80" />
          <circle cx="220" cy="150" r="52" />
          <circle cx="220" cy="150" r="24" />
          <circle cx="220" cy="150" r="5" fill={stroke} stroke="none" />
          <rect x="70" y="270" width="90" height="60" rx="8" strokeWidth="2" />
          <path d="M95 270 v-16 a10 10 0 0 1 10 -10 h20 a10 10 0 0 1 10 10 v16" strokeWidth="2" />
        </g>
      );
    case "online-earning":
      return (
        <g opacity="0.55" fill="none" stroke={stroke} strokeWidth="1.8">
          <circle cx="180" cy="170" r="90" />
          <ellipse cx="180" cy="170" rx="90" ry="34" />
          <ellipse cx="180" cy="170" rx="40" ry="90" />
          <line x1="90" y1="170" x2="270" y2="170" />
          {[
            { cx: 330, cy: 90, r: 22 },
            { cx: 370, cy: 150, r: 14 },
            { cx: 320, cy: 210, r: 10 },
          ].map((c, i) => (
            <g key={i}>
              <circle cx={c.cx} cy={c.cy} r={c.r} fill="none" />
              <text
                x={c.cx}
                y={c.cy + 4}
                textAnchor="middle"
                fontSize={c.r}
                fill={stroke}
                stroke="none"
                fontWeight="700"
              >
                $
              </text>
            </g>
          ))}
        </g>
      );
    default:
      return null;
  }
}

export function CourseArt({
  variant,
  icon: Icon,
  className,
}: {
  variant: CourseArtVariant;
  icon: ComponentType<{ className?: string }>;
  className?: string;
}) {
  const uid = useId();
  const gradId = `ca-grad-${uid}`;
  const gridId = `ca-grid-${uid}`;

  return (
    <div className={`relative overflow-hidden bg-forest-deep ${className ?? ""}`}>
      <svg
        viewBox="0 0 640 360"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--forest-deep)" />
            <stop offset="100%" stopColor="var(--forest)" />
          </linearGradient>
          <pattern id={gridId} width="26" height="26" patternUnits="userSpaceOnUse">
            <path
              d="M 26 0 L 0 0 0 26"
              fill="none"
              stroke="var(--forest-foreground)"
              strokeOpacity="0.07"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="640" height="360" fill={`url(#${gradId})`} />
        <rect width="640" height="360" fill={`url(#${gridId})`} />
        <Motif variant={variant} />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <span className="grid size-16 place-items-center rounded-2xl bg-forest-foreground/10 ring-1 ring-forest-foreground/25 backdrop-blur-sm">
          <Icon className="size-8 text-emerald-bright" />
        </span>
      </div>
    </div>
  );
}

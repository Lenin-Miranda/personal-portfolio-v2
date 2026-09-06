import type { CSSProperties } from "react";

const desktopPath = "M40 200H160V120H400V200H660V120H920V200H1120V330H600";
const compactPath = "M30 140H130V220H300V140H480V330H300";
const nodes = [
  { name: "interface", label: "Interface", x: 160, y: 200, travel: 120 / 2050 },
  { name: "services", label: "Services", x: 400, y: 120, travel: 440 / 2050 },
  {
    name: "processing",
    label: "AI / Processing",
    x: 660,
    y: 200,
    travel: 780 / 2050,
  },
  { name: "data", label: "Data", x: 920, y: 120, travel: 1120 / 2050 },
];
const compactNodes = [
  { name: "interface", label: "Interface", x: 130, y: 140, travel: 100 / 980 },
  {
    name: "processing",
    label: "Services / AI",
    x: 300,
    y: 220,
    travel: 350 / 980,
  },
  { name: "data", label: "Data", x: 480, y: 140, travel: 610 / 980 },
];

function DiscoveryDiagram({ compact = false }: { compact?: boolean }) {
  const points = compact ? compactNodes : nodes;
  const width = compact ? 600 : 1200;
  const path = compact ? compactPath : desktopPath;
  return (
    <div
      className={`hero-discovery-diagram hero-diagram-${compact ? "compact" : "wide"}`}
    >
      <svg
        className="hero-boot-svg"
        viewBox={`0 0 ${width} 420`}
        preserveAspectRatio="none"
      >
        <path
          className="hero-coordinate-lines"
          d={
            compact
              ? "M30 72H570M30 370H570M130 55V365M300 55V365M480 55V365"
              : "M40 52H1160M40 380H1160M160 40V380M400 40V380M660 40V380M920 40V380"
          }
        />
        <path
          className="hero-coordinate-ticks"
          d={
            compact
              ? "M24 72H36M30 66V78M564 370H576M570 364V376"
              : "M34 52H46M40 46V58M1154 52H1166M1160 46V58M34 380H46M40 374V386M1154 380H1166M1160 374V386"
          }
        />
        <path className="hero-boot-foundation" d={path} pathLength="1" />
        <path
          className="hero-boot-branches"
          d={
            compact
              ? "M130 140V75H55M300 220V290H190M480 140V75H550"
              : "M160 200V285H68M400 120V52H530M660 200V270H820M920 120V52H1090"
          }
        />
        <path
          className="hero-signal hero-boot-signal"
          d={path}
          pathLength="1"
        />
        {points.map((node) => (
          <g
            className="hero-boot-node"
            key={node.name}
            style={{ "--node-travel": node.travel } as CSSProperties}
          >
            <rect
              className="hero-node-outline"
              x={node.x - 10}
              y={node.y - 10}
              width="20"
              height="20"
              rx="2"
            />
            <circle cx={node.x} cy={node.y} r="3" />
          </g>
        ))}
        <g className="hero-boot-junction">
          <circle cx={width / 2} cy="330" r="10" />
          <path d={`M${width / 2 - 5} 330h10m-5 -5v10`} />
        </g>
      </svg>
      {points.map((node, index) => (
        <span
          className="hero-discovery-label"
          key={node.name}
          style={
            {
              left: `${(node.x / width) * 100}%`,
              top: `${((node.y - 36) / 420) * 100}%`,
              "--node-travel": node.travel,
            } as CSSProperties
          }
        >
          <span>
            0{index + 1} / {node.name === "interface" ? "Input" : "Node"}
          </span>
          {node.label}
        </span>
      ))}
      <span className="hero-system-origin">SYS / 01</span>
      <span className="hero-junction-label">Identity junction</span>
    </div>
  );
}

/** A wide discovery stage converges into the same mark used by the resting rail. */
export default function HeroArchitecture() {
  return (
    <>
      <div aria-hidden="true" className="hero-boot-stage">
        <div className="hero-boot-collapse">
          <div className="hero-discovery-mask">
            <DiscoveryDiagram />
            <DiscoveryDiagram compact />
          </div>
          <div className="hero-scan" />
        </div>
      </div>
      <div aria-hidden="true" className="hero-path-plane">
        <svg
          className="hero-architecture hero-diagram-wide"
          viewBox="0 0 800 240"
          preserveAspectRatio="none"
        >
          <path
            className="hero-path-foundation"
            d="M0 148H100V88H300V148H500V88H680V148H800"
          />
          <path
            className="hero-path-branch"
            d="M100 148V205H35M300 88V40H400M500 148V205H590"
          />
          <path
            className="hero-signal hero-signal-echo"
            d="M100 148V88H300V148H500V88H680"
            pathLength="1"
          />
          <circle
            className="hero-node hero-node-interface"
            cx="100"
            cy="148"
            r="3"
          />
          <circle className="hero-node" cx="300" cy="88" r="3" />
          <circle className="hero-node" cx="500" cy="148" r="3" />
          <circle className="hero-node hero-node-data" cx="680" cy="88" r="3" />
        </svg>
        <svg
          className="hero-architecture hero-diagram-compact"
          viewBox="0 0 400 240"
          preserveAspectRatio="none"
        >
          <path
            className="hero-path-foundation"
            d="M0 148H100V100H280V148H400"
          />
          <path
            className="hero-signal hero-signal-echo"
            d="M100 148V100H280V148H400"
            pathLength="1"
          />
          <circle
            className="hero-node hero-node-interface"
            cx="100"
            cy="148"
            r="3"
          />
          <circle
            className="hero-node hero-node-data"
            cx="280"
            cy="100"
            r="3"
          />
        </svg>
        <div className="hero-system-labels">
          <span className="hero-label-interface">01 / Interface</span>
          <span className="hero-label-services">02 / Services</span>
          <span className="hero-label-processing">03 / AI</span>
          <span className="hero-label-data">04 / Data</span>
        </div>
      </div>
    </>
  );
}

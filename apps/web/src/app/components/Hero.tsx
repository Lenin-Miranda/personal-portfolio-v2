import { SITE } from "../data/portfolio";
import HeroInteraction from "./HeroInteraction";
import { ArrowDown, ArrowUpRight } from "./Icons";
import ParticleLogo from "./ParticleLogo";

export default function Hero() {
  return (
    <HeroInteraction>
      <div aria-hidden="true" className="hero-scene">
        <div className="hero-schematic-depth">
          <svg
            className="hero-schematic"
            preserveAspectRatio="none"
            viewBox="0 0 1440 900"
          >
            <g>
              <path d="M54 178H344V244H548" pathLength="1" />
              <path d="M886 164H1074V246H1386" pathLength="1" />
              <path d="M1004 246V340H1226V422H1386" pathLength="1" />
              <path d="M548 710H724V636H930V728H1118" pathLength="1" />
              <path d="M1118 728H1260V652H1386" pathLength="1" />
              <circle cx="344" cy="178" r="4" />
              <circle cx="548" cy="244" r="4" />
              <circle cx="1004" cy="246" r="4" />
              <circle cx="1226" cy="422" r="4" />
              <circle cx="724" cy="636" r="4" />
              <circle cx="930" cy="728" r="4" />
              <circle cx="1260" cy="652" r="4" />
            </g>
          </svg>
        </div>

        <div className="hero-scene-axis hero-scene-axis-horizontal" />
        <div className="hero-scene-axis hero-scene-axis-vertical" />

        <div className="hero-scene-readout">
          <span>Signal path</span>
          <span>Interface → services → data</span>
        </div>
      </div>

      <div aria-hidden="true" className="hero-grid-lines" />

      <div className="hero-inner">
        <div className="hero-kicker hero-load-meta">
          <p>{SITE.role}</p>
          <p>{SITE.location}</p>
        </div>

        <div className="hero-mark hero-load-mark">
          <ParticleLogo />
          <span aria-hidden="true" className="hero-mark-index">
            LM / 26
          </span>
        </div>

        <h1 className="hero-title" id="hero-title">
          <span className="hero-title-mask">
            <span className="hero-title-line hero-load-title">
              Lenin Miranda
            </span>
          </span>
          <span className="hero-title-mask hero-title-statement-mask">
            <span className="hero-title-line hero-title-statement hero-load-statement">
              builds from <span className="hero-title-keyword">interface</span>
              <br />
              to <span className="hero-title-keyword">infrastructure.</span>
            </span>
          </span>
        </h1>

        <div className="hero-intro">
          <p className="hero-load-support">
            I build product interfaces, backend services, and AI-powered
            communication workflows—currently focused on reliable systems across
            React, NestJS, and PostgreSQL.
          </p>

          <div className="hero-actions hero-load-actions">
            <a className="button button-primary" href="#work">
              Selected work
              <ArrowDown />
            </a>
            <a className="text-link" href={`mailto:${SITE.email}`}>
              Start a conversation
              <ArrowUpRight />
            </a>
          </div>
        </div>

        <div className="hero-foot hero-load-secondary">
          <p>React / NestJS / PostgreSQL / Real-time systems</p>
          <a href="#experience">
            Scroll to experience
            <ArrowDown />
          </a>
        </div>
      </div>
    </HeroInteraction>
  );
}

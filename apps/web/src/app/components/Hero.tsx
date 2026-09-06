import { SITE } from "../data/portfolio";
import HeroArchitecture from "./HeroArchitecture";
import HeroInteraction from "./HeroInteraction";
import { ArrowDown, ArrowUpRight } from "./Icons";
import MagneticLink from "./MagneticLink";
import ParticleLogo from "./ParticleLogo";
import "./hero-motion.css";

export default function Hero() {
  return (
    <HeroInteraction>
      <div aria-hidden="true" className="hero-grid-lines" />

      <div className="hero-inner">
        <div className="hero-system">
          <HeroArchitecture />

          <div className="hero-kicker">
            <p>{SITE.role}</p>
            <p>{SITE.location}</p>
          </div>

          <div className="hero-mark">
            <svg
              aria-hidden="true"
              className="hero-mark-architecture"
              viewBox="0 0 400 240"
              preserveAspectRatio="none"
            >
              <path className="hero-mark-connection" d="M0 148H36V120H65" />
              <g className="hero-construction-lanes">
                <path d="M0 67.2H400M0 120H400M0 172.8H400" />
                <path
                  className="hero-lane-ticks"
                  d="M40 63.2v8M360 63.2v8M40 116v8M360 116v8M40 168.8v8M360 168.8v8"
                />
              </g>
            </svg>
            <ParticleLogo />
            <span aria-hidden="true" className="hero-mark-index">
              LM / 26
            </span>
            <span aria-hidden="true" className="hero-label-identity">
              LM / Identity
            </span>
          </div>
        </div>

        <h1 className="hero-title" id="hero-title">
          <span className="hero-title-mask">
            <span className="hero-title-line hero-load-title">
              Lenin Miranda
            </span>
          </span>
          <span className="hero-title-statement-mask">
            <span className="hero-title-line hero-title-statement">
              <span className="hero-statement-mask">
                <span className="hero-statement-line hero-load-statement">
                  builds from{" "}
                  <span className="hero-title-keyword hero-keyword-interface">
                    interface
                  </span>
                </span>
              </span>{" "}
              <span className="hero-statement-mask">
                <span className="hero-statement-line hero-load-statement hero-load-infrastructure">
                  to{" "}
                  <span className="hero-title-keyword hero-keyword-infrastructure">
                    infrastructure.
                  </span>
                </span>
              </span>
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
            <MagneticLink className="button button-primary" href="#work">
              Selected work
              <ArrowDown />
            </MagneticLink>
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

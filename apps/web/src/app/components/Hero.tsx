import { SITE } from "../data/portfolio";
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
          <div aria-hidden="true" className="hero-path-plane">
            <svg
              className="hero-architecture"
              viewBox="0 0 800 240"
              preserveAspectRatio="none"
            >
              <path
                className="hero-path-foundation"
                d="M0 148H240V88H480V148H800"
                pathLength="1"
              />
              <path
                className="hero-path-branch hero-branch-interface"
                d="M240 148V208H80"
                pathLength="1"
              />
              <path
                className="hero-path-branch hero-branch-services"
                d="M480 148V208H660"
                pathLength="1"
              />
              <path
                className="hero-signal hero-signal-primary"
                d="M0 148H240V88H480V148H800"
                pathLength="1"
              />
              <circle
                className="hero-node hero-node-interface"
                cx="240"
                cy="148"
                r="4"
              />
              <circle
                className="hero-node hero-node-services"
                cx="480"
                cy="148"
                r="4"
              />
            </svg>
            <div className="hero-system-labels">
              <span className="hero-label-interface">01 / Interface</span>
              <span className="hero-label-services">02 / Services</span>
            </div>
          </div>

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
              <path
                className="hero-data-path"
                d="M0 148V220H360V190H400"
                pathLength="1"
              />
              <path
                className="hero-signal hero-signal-data"
                d="M0 148V220H360V190H400"
                pathLength="1"
              />
              <circle
                className="hero-node hero-node-identity"
                cx="0"
                cy="148"
                r="4"
              />
              <circle
                className="hero-node hero-node-data"
                cx="400"
                cy="190"
                r="4"
              />
            </svg>
            <ParticleLogo />
            <span aria-hidden="true" className="hero-mark-index">
              LM / 26
            </span>
            <span aria-hidden="true" className="hero-label-data">
              03 / Data
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

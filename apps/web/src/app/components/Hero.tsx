import { SITE } from "../data/portfolio";
import { ArrowDown, ArrowUpRight } from "./Icons";
import ParticleLogo from "./ParticleLogo";

export default function Hero() {
  return (
    <section aria-labelledby="hero-title" className="hero" id="top">
      <div aria-hidden="true" className="hero-grid-lines" />

      <div className="hero-inner">
        <div className="hero-kicker hero-enter hero-enter-1">
          <p>{SITE.role}</p>
          <p>{SITE.location}</p>
        </div>

        <div className="hero-mark hero-enter hero-enter-2">
          <ParticleLogo />
          <span aria-hidden="true" className="hero-mark-index">
            LM / 26
          </span>
        </div>

        <h1 className="hero-title" id="hero-title">
          <span className="hero-title-line hero-enter hero-enter-2">
            Lenin Miranda
          </span>
          <span className="hero-title-line hero-title-statement hero-enter hero-enter-3">
            builds from interface
            <br />
            to infrastructure.
          </span>
        </h1>

        <div className="hero-intro hero-enter hero-enter-4">
          <p>
            I build product interfaces, backend services, and AI-powered
            communication workflows—currently focused on reliable systems across
            React, NestJS, and PostgreSQL.
          </p>

          <div className="hero-actions">
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

        <div className="hero-foot hero-enter hero-enter-4">
          <p>React / NestJS / PostgreSQL / Real-time systems</p>
          <a href="#experience">
            Scroll to experience
            <ArrowDown />
          </a>
        </div>
      </div>
    </section>
  );
}

import { SITE } from "../data/portfolio";
import ContactForm from "./ContactForm";
import { ArrowUpRight } from "./Icons";
import Reveal from "./Reveal";

export default function ContactSection() {
  return (
    <section
      aria-labelledby="contact-title"
      className="section contact-section"
      id="contact"
    >
      <div className="section-inner">
        <div className="contact-layout">
          <Reveal className="contact-heading">
            <p className="section-index">04 / Contact</p>
            <h2 id="contact-title">
              Let’s talk about the system behind the screen.
            </h2>
            <p className="contact-deck">
              One detail at a time. Tell me who you are, what brought you here,
              and where the work could go next.
            </p>
            <a className="contact-direct-email" href={`mailto:${SITE.email}`}>
              {SITE.email}
              <ArrowUpRight />
            </a>
          </Reveal>

          <Reveal className="contact-form-column" delay={0.08}>
            <ContactForm fallbackEmail={SITE.email} />
          </Reveal>
        </div>

        <footer className="site-footer">
          <div>
            <p>{SITE.name}</p>
            <p>{SITE.role}</p>
          </div>

          <nav aria-label="Social links">
            <a href={SITE.github} rel="noreferrer noopener" target="_blank">
              GitHub
              <span className="sr-only">, opens in a new tab</span>
            </a>
            <a href={SITE.linkedin} rel="noreferrer noopener" target="_blank">
              LinkedIn
              <span className="sr-only">, opens in a new tab</span>
            </a>
            <a download="Lenin-Miranda-Resume.pdf" href={SITE.resume}>
              Résumé
            </a>
          </nav>

          <div className="footer-meta">
            <p>{SITE.location}</p>
            <p>© {new Date().getFullYear()}</p>
          </div>
        </footer>
      </div>
    </section>
  );
}

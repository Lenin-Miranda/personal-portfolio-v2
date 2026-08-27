import { CAPABILITIES, EDUCATION, PRINCIPLES } from "../data/portfolio";
import Reveal, { MaskedReveal, RevealGroup, RevealItem } from "./Reveal";

export default function AboutSection() {
  return (
    <section
      aria-labelledby="about-title"
      className="section section-paper about-section"
      id="about"
    >
      <div className="section-inner">
        <RevealGroup className="section-heading section-heading-paper about-heading">
          <RevealItem className="section-index" level="meta">
            <p>03 / About</p>
          </RevealItem>
          <MaskedReveal className="section-heading-title">
            <h2 id="about-title">A product mindset across the whole stack.</h2>
          </MaskedReveal>
          <RevealItem className="section-deck">
            <p>
              I’m a full-stack engineer based in Las Vegas. My work has moved
              through automation at scale, backend lifecycle systems, commerce,
              real-time products, and AI-connected communications—always with an
              eye on how the complete experience holds together.
            </p>
          </RevealItem>
        </RevealGroup>

        <section className="principles" aria-labelledby="principles-title">
          <RevealGroup className="subsection-heading">
            <RevealItem className="eyebrow" level="meta">
              <p>Working principles</p>
            </RevealItem>
            <MaskedReveal className="subsection-title">
              <h3 id="principles-title">
                How I move from ambiguity to release.
              </h3>
            </MaskedReveal>
          </RevealGroup>
          <ol>
            {PRINCIPLES.map((principle, index) => (
              <li key={principle.title}>
                <Reveal
                  amount={0.3}
                  className="principle"
                  delay={(index % 2) * 0.075}
                >
                  <span>{principle.number}</span>
                  <h4>{principle.title}</h4>
                  <p>{principle.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </section>

        <section className="capabilities" aria-labelledby="capabilities-title">
          <RevealGroup className="subsection-heading">
            <RevealItem className="eyebrow" level="meta">
              <p>Technical range</p>
            </RevealItem>
            <MaskedReveal className="subsection-title">
              <h3 id="capabilities-title">Tools in the context of the work.</h3>
            </MaskedReveal>
          </RevealGroup>
          <div className="capability-list">
            {CAPABILITIES.map((capability, index) => (
              <Reveal
                className="capability"
                delay={(index % 2) * 0.075}
                key={capability.label}
              >
                <h4>{capability.label}</h4>
                <p>{capability.description}</p>
                <p className="technology-line">
                  {capability.tools.join(" / ")}
                </p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="education" aria-labelledby="education-title">
          <RevealGroup className="subsection-heading">
            <RevealItem className="eyebrow" level="meta">
              <p>Education</p>
            </RevealItem>
            <MaskedReveal className="subsection-title">
              <h3 id="education-title">
                Formal foundations, continued in practice.
              </h3>
            </MaskedReveal>
          </RevealGroup>
          <div className="education-list">
            {EDUCATION.map((item, index) => (
              <Reveal
                amount={0.3}
                className="education-entry"
                delay={(index % 2) * 0.075}
                key={item.institution}
              >
                <span>{item.year}</span>
                <h4>{item.institution}</h4>
                <p>{item.detail}</p>
              </Reveal>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

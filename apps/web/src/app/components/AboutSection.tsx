import { CAPABILITIES, EDUCATION, PRINCIPLES } from "../data/portfolio";
import Reveal from "./Reveal";

export default function AboutSection() {
  return (
    <section
      aria-labelledby="about-title"
      className="section section-paper about-section"
      id="about"
    >
      <div className="section-inner">
        <Reveal className="section-heading section-heading-paper about-heading">
          <p className="section-index">03 / About</p>
          <h2 id="about-title">A product mindset across the whole stack.</h2>
          <p className="section-deck">
            I’m a full-stack engineer based in Las Vegas. My work has moved
            through automation at scale, backend lifecycle systems, commerce,
            real-time products, and AI-connected communications—always with an
            eye on how the complete experience holds together.
          </p>
        </Reveal>

        <section className="principles" aria-labelledby="principles-title">
          <Reveal className="subsection-heading">
            <p className="eyebrow">Working principles</p>
            <h3 id="principles-title">How I move from ambiguity to release.</h3>
          </Reveal>
          <ol>
            {PRINCIPLES.map((principle, index) => (
              <li key={principle.title}>
                <Reveal className="principle" delay={index * 0.045}>
                  <span>{principle.number}</span>
                  <h4>{principle.title}</h4>
                  <p>{principle.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </section>

        <section className="capabilities" aria-labelledby="capabilities-title">
          <Reveal className="subsection-heading">
            <p className="eyebrow">Technical range</p>
            <h3 id="capabilities-title">Tools in the context of the work.</h3>
          </Reveal>
          <div className="capability-list">
            {CAPABILITIES.map((capability, index) => (
              <Reveal
                className="capability"
                delay={index * 0.035}
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
          <Reveal className="subsection-heading">
            <p className="eyebrow">Education</p>
            <h3 id="education-title">
              Formal foundations, continued in practice.
            </h3>
          </Reveal>
          <div className="education-list">
            {EDUCATION.map((item) => (
              <Reveal className="education-entry" key={item.institution}>
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

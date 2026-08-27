import { EXPERIENCE } from "../data/portfolio";
import { MaskedReveal, RevealGroup, RevealItem } from "./Reveal";

export default function ExperienceSection() {
  return (
    <section
      aria-labelledby="experience-title"
      className="section section-paper experience-section"
      id="experience"
    >
      <div className="section-inner">
        <RevealGroup className="section-heading section-heading-paper">
          <RevealItem className="section-index" level="meta">
            <p>01 / Experience</p>
          </RevealItem>
          <MaskedReveal className="section-heading-title">
            <h2 id="experience-title">Where reliability became the work.</h2>
          </MaskedReveal>
          <RevealItem className="section-deck">
            <p>
              Production experience across AI communication systems, high-volume
              automation, backend lifecycle workflows, and full-stack commerce.
            </p>
          </RevealItem>
        </RevealGroup>

        <ol className="experience-list">
          {EXPERIENCE.map((experience) => (
            <li key={`${experience.company}-${experience.dates}`}>
              <RevealGroup
                amount={0.23}
                className="experience-entry"
                stagger={0.085}
              >
                <RevealItem className="experience-meta" level="meta">
                  <p>{experience.dates}</p>
                  <p>{experience.location}</p>
                </RevealItem>

                <RevealItem className="experience-position">
                  <p>{experience.company}</p>
                  <h3>{experience.role}</h3>
                  <p className="experience-summary">{experience.summary}</p>
                  <p className="experience-proof">{experience.proof}</p>
                </RevealItem>

                <RevealItem className="experience-detail">
                  <ul>
                    {experience.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                  <p className="technology-line">
                    {experience.technologies.join(" / ")}
                  </p>
                </RevealItem>
              </RevealGroup>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

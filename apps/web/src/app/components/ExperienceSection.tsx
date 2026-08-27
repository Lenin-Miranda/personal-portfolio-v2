import { EXPERIENCE } from "../data/portfolio";
import Reveal from "./Reveal";

export default function ExperienceSection() {
  return (
    <section
      aria-labelledby="experience-title"
      className="section section-paper experience-section"
      id="experience"
    >
      <div className="section-inner">
        <Reveal className="section-heading section-heading-paper">
          <p className="section-index">01 / Experience</p>
          <h2 id="experience-title">Where reliability became the work.</h2>
          <p className="section-deck">
            Production experience across AI communication systems, high-volume
            automation, backend lifecycle workflows, and full-stack commerce.
          </p>
        </Reveal>

        <ol className="experience-list">
          {EXPERIENCE.map((experience, index) => (
            <li key={`${experience.company}-${experience.dates}`}>
              <Reveal className="experience-entry" delay={index * 0.035}>
                <div className="experience-meta">
                  <p>{experience.dates}</p>
                  <p>{experience.location}</p>
                </div>

                <div className="experience-position">
                  <p>{experience.company}</p>
                  <h3>{experience.role}</h3>
                  <p className="experience-summary">{experience.summary}</p>
                  <p className="experience-proof">{experience.proof}</p>
                </div>

                <div className="experience-detail">
                  <ul>
                    {experience.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                  <p className="technology-line">
                    {experience.technologies.join(" / ")}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

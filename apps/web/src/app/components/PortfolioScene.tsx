import AboutSection from "./AboutSection";
import ContactSection from "./ContactSection";
import ExperienceSection from "./ExperienceSection";
import Hero from "./Hero";
import ProjectsShowcase from "./ProjectsShowcase";
import SiteHeader from "./SiteHeader";

export default function PortfolioScene() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main id="main-content">
        <Hero />
        <ExperienceSection />
        <ProjectsShowcase />
        <AboutSection />
        <ContactSection />
      </main>
    </div>
  );
}

import Link from "next/link";

import { ArrowLeft } from "../../components/Icons";
import SiteHeader from "../../components/SiteHeader";

export default function ProjectNotFound() {
  return (
    <div className="site-shell project-case-shell">
      <SiteHeader />
      <main className="project-not-found" id="main-content">
        <div>
          <p>404 / Project not found</p>
          <h1>This case study is not in the selected work.</h1>
          <Link className="project-back-link" href="/#work">
            <ArrowLeft />
            Return to selected work
          </Link>
        </div>
      </main>
    </div>
  );
}

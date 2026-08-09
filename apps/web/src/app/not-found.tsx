import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-[100dvh] place-items-center bg-[var(--page)] px-4">
      <div className="max-w-xl text-center">
        <p className="text-sm font-semibold text-[var(--accent)]">404</p>
        <h1 className="font-display mt-4 text-5xl tracking-[-0.04em] sm:text-6xl">
          This page is not here.
        </h1>
        <p className="mx-auto mt-5 max-w-[42ch] leading-7 text-[var(--muted)]">
          The address may have changed, or the page may not exist yet.
        </p>
        <Link
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--text)] px-5 py-3 text-sm font-semibold text-[var(--page)] active:scale-[0.98]"
          href="/"
        >
          <ArrowLeft aria-hidden="true" size={17} />
          Back home
        </Link>
      </div>
    </main>
  );
}

"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { NAV_ITEMS, SITE } from "../data/portfolio";
import { CloseIcon, MenuIcon } from "./Icons";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function SiteHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();
  const isHome = pathname === "/";
  const sectionHref = (href: string) => (isHome ? href : `/${href}`);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const menu = menuRef.current;
    const trigger = triggerRef.current;
    const backgroundElements = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".skip-link, .site-header, #main-content",
      ),
    );
    const previouslyInert = backgroundElements.map((element) =>
      element.hasAttribute("inert"),
    );
    const focusable = menu
      ? Array.from(menu.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
      : [];

    document.body.style.overflow = "hidden";
    backgroundElements.forEach((element) => element.setAttribute("inert", ""));
    focusable[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        return;
      }

      if (event.key !== "Tab" || focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      backgroundElements.forEach((element, index) => {
        if (!previouslyInert[index]) {
          element.removeAttribute("inert");
        }
      });
      window.removeEventListener("keydown", handleKeyDown);
      window.requestAnimationFrame(() => trigger?.focus());
    };
  }, [isOpen]);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="site-header">
        <Link
          aria-label="Lenin Miranda, home"
          className="brand-link"
          href={isHome ? "#top" : "/#top"}
        >
          <Image
            alt=""
            className="brand-mark"
            height={42}
            priority
            src="/brand/lenin-miranda-mark.png"
            width={42}
          />
          <span>{SITE.name}</span>
        </Link>

        <nav aria-label="Primary navigation" className="desktop-nav">
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={sectionHref(item.href)}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <a
            className="resume-link"
            download="Lenin-Miranda-Resume.pdf"
            href={SITE.resume}
          >
            Résumé <span aria-hidden="true">PDF</span>
          </a>

          <button
            aria-controls="mobile-navigation"
            aria-expanded={isOpen}
            aria-label="Open navigation menu"
            className="menu-trigger"
            onClick={() => setIsOpen(true)}
            ref={triggerRef}
            type="button"
          >
            <span>Menu</span>
            <MenuIcon />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            animate={{ opacity: 1 }}
            aria-label="Navigation menu"
            aria-modal="true"
            className="mobile-menu"
            exit={{ opacity: 0 }}
            id="mobile-navigation"
            initial={reduceMotion ? false : { opacity: 0 }}
            ref={menuRef}
            role="dialog"
            transition={{ duration: reduceMotion ? 0 : 0.22 }}
          >
            <div className="mobile-menu-topline">
              <span>{SITE.name}</span>
              <button
                aria-label="Close navigation menu"
                className="menu-close"
                onClick={() => setIsOpen(false)}
                type="button"
              >
                <span>Close</span>
                <CloseIcon />
              </button>
            </div>

            <nav aria-label="Mobile navigation">
              <ol>
                {NAV_ITEMS.map((item, index) => (
                  <motion.li
                    animate={{ opacity: 1, y: 0 }}
                    initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                    key={item.href}
                    transition={{
                      delay: reduceMotion ? 0 : 0.04 + index * 0.045,
                      duration: reduceMotion ? 0 : 0.36,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <span aria-hidden="true">0{index + 1}</span>
                    <Link
                      href={sectionHref(item.href)}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ol>
            </nav>

            <div className="mobile-menu-footer">
              <p>{SITE.role}</p>
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

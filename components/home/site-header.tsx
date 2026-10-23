"use client";

import { useEffect, useState, type FocusEvent, type KeyboardEvent, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Brand } from "@/components/brand";
import { QuoteLink } from "@/components/quote-link";
import { nav, type NavLink } from "@/lib/site";

/** Internal paths use next/link; in-page anchors use a plain <a>. */
function NavAnchor({
  link,
  className,
  onClick,
  children,
}: {
  link: NavLink;
  className?: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  return link.href.startsWith("/") ? (
    <Link href={link.href} className={className} onClick={onClick}>
      {children}
    </Link>
  ) : (
    <a href={link.href} className={className} onClick={onClick}>
      {children}
    </a>
  );
}

/** Client component: scroll state, hover/focus dropdowns, and the mobile menu. */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const [menu, setMenu] = useState<string | null>(null); // desktop dropdown that is showing
  const [mobileSub, setMobileSub] = useState<string | null>(null); // mobile section that is expanded

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
  document.body.style.overflow = open ? "hidden" : "";
  const onKey = (e: globalThis.KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
  };
  const onResize = () => window.innerWidth > 800 && setOpen(false);
  window.addEventListener("keydown", onKey);
  window.addEventListener("resize", onResize);
  return () => {
    document.body.style.overflow = "";
    window.removeEventListener("keydown", onKey);
    window.removeEventListener("resize", onResize);
  };
}, [open]);

  return (
    <header className={`main-header${stuck ? " is-stuck" : ""}`}>
      <div className="page-width main-header-inner">
        <Brand light />
        <nav className="desktop-nav" aria-label="Main navigation">
          {nav.map((n, i) => {
            const link = (
              <a
                href={n.href}
                className={i === 0 ? "active" : ""}
                aria-haspopup={n.menu ? "true" : undefined}
                aria-expanded={n.menu ? menu === n.label : undefined}
                onClick={() => setMenu(null)}
              >
                {n.label}
                {n.menu && <ChevronDown size={14} className="nav-chevron" />}
              </a>
            );
            if (!n.menu) return <a key={n.href} href={n.href} className={i === 0 ? "active" : ""}>{n.label}</a>;
            const isOpen = menu === n.label;
            return (
              <div
                key={n.href}
                className={`nav-item${isOpen ? " is-open" : ""}`}
                onMouseEnter={() => setMenu(n.label)}
                onMouseLeave={() => setMenu(null)}
                onFocus={() => setMenu(n.label)}
                onBlur={(e: FocusEvent<HTMLDivElement>) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setMenu(null);
                }}
                onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
                  if (e.key === "Escape") setMenu(null);
                }}
              >
                {link}
                <div className={`nav-menu${isOpen ? " is-open" : ""}`}>
                  <div className={`nav-menu-panel nav-menu-${n.menu.variant}`}>
                    {n.menu.groups.map((g, gi) => (
                      <div className="nav-menu-group" key={g.title ?? gi}>
                        {g.title && <p className="nav-menu-title">{g.title}</p>}
                        <ul>
                          {g.links.map((l) => (
                            <li key={l.label}>
                              <NavAnchor link={l} className="nav-menu-link" onClick={() => setMenu(null)}>
                                <strong>{l.label}</strong>
                                {l.text && <span>{l.text}</span>}
                              </NavAnchor>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    {n.menu.cta && (
                      <NavAnchor link={n.menu.cta} className="nav-menu-cta" onClick={() => setMenu(null)}>
                        {n.menu.cta.label}
                        <ArrowRight size={15} />
                      </NavAnchor>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>
        <QuoteLink className="header-quote" />
        <Button
          className="mobile-menu"
          variant="ghost"
          size="icon"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </Button>
        <div
          className={`mobile-backdrop${open ? " is-open" : ""}`}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
        <nav
          id="mobile-drawer"
          className={`mobile-drawer${open ? " is-open" : ""}`}
          aria-label="Mobile navigation"
          inert={!open}
        >
          <div className="mobile-drawer-top">
            <Brand light />
            <button
              type="button"
              className="mobile-drawer-close"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              <X size={24} />
            </button>
          </div>

          <div className="mobile-drawer-links">
            {nav.map((n) =>
              n.menu ? (
                <div className={`mobile-group${mobileSub === n.label ? " is-open" : ""}`} key={n.href}>
                  <button
                    type="button"
                    className="mobile-row"
                    aria-expanded={mobileSub === n.label}
                    aria-controls={`mobile-sub-${n.label}`}
                    onClick={() => setMobileSub(mobileSub === n.label ? null : n.label)}
                  >
                    {n.label}
                    <span className="mobile-chevron">
                      <ChevronDown size={18} />
                    </span>
                  </button>
                  <div className="mobile-sub-wrap" id={`mobile-sub-${n.label}`}>
                    <div className="mobile-sub-inner">
                      <div className="mobile-sub">
                        <a href={n.href} className="mobile-sub-all" onClick={() => setOpen(false)}>
                          View all {n.label.toLowerCase()}
                          <ArrowRight size={15} />
                        </a>
                        {n.menu.groups
                          .flatMap((g) => g.links)
                          .map((l) => (
                            <NavAnchor key={l.label} link={l} onClick={() => setOpen(false)}>
                              {l.label}
                            </NavAnchor>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <a key={n.href} href={n.href} className="mobile-row" onClick={() => setOpen(false)}>
                  {n.label}
                </a>
              ),
            )}
          </div>

          <div className="mobile-drawer-cta">
            <QuoteLink />
          </div>
        </nav>
      </div>
    </header>
  );
}
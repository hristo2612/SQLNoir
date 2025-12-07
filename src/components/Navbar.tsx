"use client";

import { useEffect, useState, type ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Share2, Home, FolderOpen, LifeBuoy, BookOpen } from "lucide-react";
import { track } from "@vercel/analytics/react";
import { supabase } from "@/lib/supabase";
import { SharePopup } from "./SharePopup";
import { UserMenu } from "./auth/UserMenu";

type NavLink = {
  label: string;
  href: string;
  activeMatch?: string | string[];
  external?: boolean;
};

interface NavbarProps {
  title: string;
  links: NavLink[];
  titleHref?: string;
  showShare?: boolean;
}

const matchesPath = (pathname: string, pattern: string) => {
  if (!pattern) return false;
  if (pattern === "/") return pathname === "/";
  if (pathname === pattern) return true;
  const normalized = pattern.endsWith("/") ? pattern : `${pattern}/`;
  return pathname.startsWith(normalized);
};

export function Navbar({
  title,
  links,
  titleHref,
  showShare = false,
}: NavbarProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareContext, setShareContext] = useState("navbar");

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => setUser(session?.user ?? null))
      .catch(() => setUser(null));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isActive = (link: NavLink) => {
    const targets = Array.isArray(link.activeMatch)
      ? link.activeMatch
      : link.activeMatch
        ? [link.activeMatch]
        : [link.href];

    return targets.some((target) => matchesPath(pathname, target));
  };

  const handleNavClick = (target: string) => {
    track("nav_click", { target, page: pathname });
  };

  return (
    <div className="bg-amber-50/80 border-b border-amber-200 backdrop-blur-sm relative z-50">
      <SharePopup
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        context={shareContext}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {titleHref ? (
          <Link
            href={titleHref}
            className="text-amber-900 font-detective text-xl hover:text-amber-700 transition-colors"
            onClick={() => handleNavClick("title")}
          >
            {title}
          </Link>
        ) : (
          <div className="text-amber-900 font-detective text-xl">{title}</div>
        )}

        <div className="flex items-center gap-2 sm:hidden">
          <UserMenu user={user} onSignOut={() => setUser(null)} />
          <button
            type="button"
            onClick={() => setIsMenuOpen((v) => !v)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-200 text-amber-900 font-detective border border-amber-300 shadow-sm transition-colors duration-200"
          >
            <span className="text-sm">Menu</span>
            <span className="text-lg leading-none">•••</span>
          </button>
        </div>

        <nav className="hidden sm:flex items-center gap-2">
          {links.map((link) => {
            const active = isActive(link);
            const className = `inline-flex items-center gap-2 px-3 py-2 rounded-lg font-detective transition-colors duration-200 border ${
              active
                ? "bg-amber-200 text-amber-900 border-amber-300"
                : "bg-amber-100 hover:bg-amber-200 text-amber-900 border-transparent"
            }`;

            const iconMap: Record<string, ComponentType<{ className?: string }>> = {
              Home,
              Cases: FolderOpen,
              Help: LifeBuoy,
              Journal: BookOpen,
            };
            const Icon = iconMap[link.label];

            const content = (
              <span className="inline-flex items-center gap-2">
                {Icon ? <Icon className="w-4 h-4" /> : null}
                <span>{link.label}</span>
              </span>
            );

            if (link.external) {
              return (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                >
                  {content}
                </a>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={className}
                onClick={() => handleNavClick(link.label.toLowerCase())}
              >
                {content}
              </Link>
            );
          })}

          {showShare && (
            <button
              type="button"
              onClick={() => {
                setShareContext("navbar");
                setIsShareOpen(true);
                track("share_open", { context: "navbar", page: pathname });
              }}
              className="inline-flex items-center justify-center px-3 py-2 rounded-lg font-detective bg-amber-100 hover:bg-amber-200 text-amber-900 border border-transparent transition-colors duration-200"
              >
              <Share2 className="w-4 h-4" />
            </button>
          )}

          <UserMenu user={user} onSignOut={() => setUser(null)} />
        </nav>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden absolute left-0 right-0 top-full z-50 border-b border-amber-200">
          <div className="max-w-7xl mx-auto bg-amber-50/95 border-t border-amber-200 px-4 py-3 grid gap-2">
            {links.map((link) => {
              const active = isActive(link);
              const baseClasses =
                "w-full inline-flex items-center justify-between px-4 py-3 rounded-lg font-detective transition-colors duration-200 border shadow-sm";
              const className = active
                ? `${baseClasses} bg-amber-200 text-amber-900 border-amber-300`
                : `${baseClasses} bg-amber-100 text-amber-900 border-transparent hover:bg-amber-200`;

              const iconMap: Record<string, ComponentType<{ className?: string }>> = {
                Home,
                Cases: FolderOpen,
                Help: LifeBuoy,
                Journal: BookOpen,
              };
              const Icon = iconMap[link.label];

              const content = (
                <>
                  <span className="inline-flex items-center gap-2">
                    {Icon ? <Icon className="w-4 h-4" /> : <span className="text-sm">•</span>}
                    <span>{link.label}</span>
                  </span>
                  <span className="text-xs opacity-70">→</span>
                </>
              );

              if (link.external) {
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={className}
                    onClick={() => handleNavClick(link.label.toLowerCase())}
                  >
                    {content}
                  </a>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={className}
                  onClick={() => handleNavClick(link.label.toLowerCase())}
                >
                  {content}
                </Link>
              );
            })}

            {showShare && (
              <button
                type="button"
                onClick={() => {
                  setShareContext("navbar-mobile");
                  setIsShareOpen(true);
                  track("share_open", { context: "navbar-mobile", page: pathname });
                }}
                className="w-full inline-flex items-center justify-between px-4 py-3 rounded-lg font-detective transition-colors duration-200 border shadow-sm bg-amber-100 text-amber-900 hover:bg-amber-200"
              >
                <span className="inline-flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

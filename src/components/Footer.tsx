"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations();
  return (
    <footer className="bg-amber-100 border-t border-amber-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-amber-800">
        <span>{t('footer.copyright', { year: new Date().getFullYear() })}</span>
        <nav className="flex items-center gap-4">
          <Link
            href="/privacy"
            className="hover:text-amber-900 underline underline-offset-2"
          >
            {t('footer.privacy')}
          </Link>
          <Link
            href="/terms"
            className="hover:text-amber-900 underline underline-offset-2"
          >
            {t('footer.terms')}
          </Link>
          <Link
            href="/contact"
            className="hover:text-amber-900 underline underline-offset-2"
          >
            {t('footer.contact')}
          </Link>
        </nav>
      </div>
    </footer>
  );
}

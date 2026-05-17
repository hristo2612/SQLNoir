const siteUrl = "https://www.sqlnoir.com";

/**
 * Returns the URL path prefix for a given locale.
 * English (default) has no prefix; other locales get "/{locale}".
 */
export function localePrefix(locale: string): string {
  return locale === "en" ? "" : `/${locale}`;
}

/**
 * Builds locale-aware canonical path and hreflang alternates for metadata.
 */
export function localeAlternates(path: string, locale: string) {
  const prefix = localePrefix(locale);
  return {
    canonical: `${prefix}${path}`,
    languages: {
      en: path,
      "pt-br": `/pt-br${path}`,
      "zh-CN": `/zh-CN${path}`,
      "x-default": path,
    },
  };
}

export { siteUrl };

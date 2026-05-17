import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "pt-br", "zh-CN"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});

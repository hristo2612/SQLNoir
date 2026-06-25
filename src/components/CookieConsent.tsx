"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const t = useTranslations("cookieConsent");

  useEffect(() => {
    if (!localStorage.getItem("cookie-consent")) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-amber-900 text-amber-50"
      style={{
        paddingBottom: "max(0.625rem, env(safe-area-inset-bottom))",
      }}
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-2.5 px-4 pt-2.5 sm:flex-row sm:items-center sm:justify-center sm:gap-3 sm:pt-2.5">
        <p className="text-pretty text-sm leading-snug">
          {t("message")}{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-2 hover:text-amber-200"
          >
            {t("privacyLink")}
          </Link>
        </p>
        <button
          type="button"
          onClick={() => {
            localStorage.setItem("cookie-consent", "true");
            setVisible(false);
            window.dispatchEvent(new Event("cookie-consent-granted"));
          }}
          className="w-full shrink-0 rounded bg-amber-50 px-4 py-2 text-sm font-medium text-amber-900 transition-[background-color,transform] hover:bg-amber-200 active:scale-[0.96] sm:w-auto sm:py-1.5"
        >
          {t("accept")}
        </button>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { supabase } from "../../lib/supabase";
import {
  clearPasswordRecoveryPending,
  isPasswordRecoveryPending,
  MIN_PASSWORD_LENGTH,
  validateNewPassword,
} from "../../lib/password-recovery";

const inputClass =
  "w-full px-3 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white";

export function PasswordRecoveryModal() {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleClose = () => {
    if (loading) return;
    clearPasswordRecoveryPending();
    setPassword("");
    setConfirmPassword("");
    setError("");
    setLoading(false);
    setSuccess(false);
    setIsOpen(false);
  };

  useEffect(() => {
    if (!supabase) return;
    const resetAndSetOpen = (open: boolean) => {
      clearPasswordRecoveryPending();
      setPassword("");
      setConfirmPassword("");
      setError("");
      setLoading(false);
      setSuccess(false);
      setIsOpen(open);
    };
    if (isPasswordRecoveryPending()) {
      resetAndSetOpen(true);
    }
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        resetAndSetOpen(true);
      } else if (event === "SIGNED_OUT") {
        resetAndSetOpen(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!supabase) {
      setError(t("auth.authNotAvailable"));
      return;
    }

    setError("");
    const validationError = validateNewPassword(password, confirmPassword);
    if (validationError) {
      setError(
        validationError === "weakPassword"
          ? t("auth.weakPassword")
          : t("auth.passwordsDoNotMatch")
      );
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        if (error.message === "Password should be at least 6 characters") {
          throw new Error(t("auth.weakPassword"));
        }
        if (error.message === "New password should be different from the old password.") {
          throw new Error(t("auth.samePasswordError"));
        }
        throw error;
      }

      setPassword("");
      setConfirmPassword("");
      setSuccess(true);

      if (
        typeof window !== "undefined" &&
        window.location?.hash?.includes("type=recovery") &&
        typeof window.history?.replaceState === "function"
      ) {
        window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("auth.genericError"));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-amber-50 rounded-xl shadow-2xl border border-amber-200 w-full max-w-md overflow-hidden">
        <div className="px-5 py-4 border-b border-amber-200 flex justify-between items-center">
          <h2 className="text-xl font-detective text-amber-900">{t("auth.setNewPassword")}</h2>
          <button type="button" onClick={handleClose} className="text-amber-900 hover:text-amber-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          {error && (
            <div className="px-4 py-3 rounded mb-5 bg-red-100 border border-red-300 text-red-800">{error}</div>
          )}

          {success ? (
            <div className="space-y-4">
              <div className="px-4 py-3 rounded bg-green-100 border border-green-300 text-green-800">
                {t("auth.passwordUpdated")}
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="w-full py-2 px-4 rounded-lg font-detective text-white bg-amber-600 hover:bg-amber-500 transition-colors"
              >
                {t("common.close")}
              </button>
            </div>
          ) : (
            <>
              <p className="text-sm text-amber-800 mb-4">{t("auth.setNewPasswordDescription")}</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="recovery-new-password" className="block text-sm font-detective text-amber-800 mb-1">
                    {t("auth.newPassword")}
                  </label>
                  <input
                    id="recovery-new-password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputClass}
                    required
                    minLength={MIN_PASSWORD_LENGTH}
                  />
                  <p className="mt-1 text-xs text-amber-700">{t("auth.passwordHint")}</p>
                </div>

                <div>
                  <label htmlFor="recovery-confirm-password" className="block text-sm font-detective text-amber-800 mb-1">
                    {t("auth.confirmPassword")}
                  </label>
                  <input
                    id="recovery-confirm-password"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={inputClass}
                    required
                    minLength={MIN_PASSWORD_LENGTH}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2 px-4 rounded-lg font-detective text-white transition-colors ${
                    loading ? "bg-amber-400 cursor-not-allowed" : "bg-amber-600 hover:bg-amber-500"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {t("auth.processing")}
                    </span>
                  ) : (
                    <span>{t("auth.updatePassword")}</span>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

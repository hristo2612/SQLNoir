"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { supabase } from "../../lib/supabase";
import { trackSignUpCompleted } from "../../lib/posthog-events";
import { useTranslations } from "next-intl";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const t = useTranslations();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Much simpler implementation using a direct call to Supabase
  const handleGoogleSignIn = async () => {
    if (!supabase) {
      setError(t('auth.authNotAvailable'));
      return;
    }

    try {
      setGoogleLoading(true);
      setError("");

      const redirectTo =
        process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_URL ||
        (typeof window !== "undefined"
          ? window.location.origin
          : process.env.NEXT_PUBLIC_SITE_URL || "https://www.sqlnoir.com");

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectTo || undefined,
        },
      });

      if (error) throw error;

      // The auth redirect will happen automatically, no need to call onClose
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError(
        err instanceof Error
          ? err.message
          : t('auth.googleSignInError')
      );
      setGoogleLoading(false);
    }
  };

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setError("");
      setGoogleLoading(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!supabase) {
      setError(t('auth.authNotAvailable'));
      return;
    }

    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          // Handle specific error cases
          switch (error.message) {
            case "Invalid login credentials":
              throw new Error(t('auth.invalidCredentials'));
            case "Email not confirmed":
              throw new Error(t('auth.emailNotConfirmed'));
            default:
              throw error;
          }
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) {
          // Handle signup specific errors
          switch (error.message) {
            case "User already registered":
              throw new Error(t('auth.accountExists'));
            case "Password should be at least 6 characters":
              throw new Error(t('auth.weakPassword'));
            default:
              throw error;
          }
        } else {
          // Show success message for sign up
          trackSignUpCompleted();
          setError("success:" + t('auth.accountCreated'));
          setIsLogin(true);
          setPassword("");
          setLoading(false);
          return;
        }
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('auth.genericError'));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-amber-50 rounded-xl shadow-2xl border border-amber-200 w-full max-w-md overflow-hidden">
        <div className="px-5 py-4 border-b border-amber-200 flex justify-between items-center">
          <h2 className="text-xl font-detective text-amber-900">
            {isLogin ? t('auth.welcomeBack') : t('auth.joinInvestigation')}
          </h2>
          <button
            onClick={onClose}
            className="text-amber-900 hover:text-amber-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          {error && (
            <div
              className={`px-4 py-3 rounded mb-5 ${
                error.startsWith("success:")
                  ? "bg-green-100 border border-green-300 text-green-800"
                  : "bg-red-100 border border-red-300 text-red-800"
              }`}
            >
              {error.replace("success:", "")}
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 bg-white rounded-lg
                     font-detective border-2 border-gray-300 hover:bg-gray-50 transition-colors mb-5
                     ${
                       googleLoading
                         ? "opacity-70 cursor-not-allowed"
                         : "hover:shadow-md"
                     }`}
          >
            {googleLoading ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-amber-500 rounded-full animate-spin"></div>
            ) : (
              <FcGoogle className="w-6 h-6" />
            )}
            <span className="text-gray-700 text-base">
              {isLogin ? t('auth.signInWithGoogle') : t('auth.signUpWithGoogle')}
            </span>
          </button>

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-amber-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-amber-50 text-amber-700 font-medium">
                {t('auth.orContinueWithEmail')}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-detective text-amber-800 mb-1">
                {t('auth.email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:ring-2
                         focus:ring-amber-500 focus:border-amber-500 bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-detective text-amber-800 mb-1">
                {t('auth.password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:ring-2
                         focus:ring-amber-500 focus:border-amber-500 bg-white"
                required
                minLength={6}
              />
              <p className="mt-1 text-xs text-amber-700">
                {!isLogin && t('auth.passwordMinLength')}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded-lg font-detective text-white transition-colors
                       ${
                         loading
                           ? "bg-amber-400 cursor-not-allowed"
                           : "bg-amber-600 hover:bg-amber-500"
                       }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t('auth.processing')}
                </span>
              ) : (
                <span>
                  {isLogin ? t('auth.signInWithEmail') : t('auth.signUpWithEmail')}
                </span>
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                  setPassword("");
                }}
                className="text-amber-700 hover:text-amber-600 text-sm underline-offset-2 hover:underline"
              >
                {isLogin
                  ? t('auth.noAccount')
                  : t('auth.hasAccount')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}

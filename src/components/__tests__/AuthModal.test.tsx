import React from "react";
import { act, create, type ReactTestRenderer } from "react-test-renderer";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const authApi = vi.hoisted(() => ({
  signInWithPassword: vi.fn(),
  signUp: vi.fn(),
  signInWithOAuth: vi.fn(),
  resetPasswordForEmail: vi.fn(),
}));

vi.mock("react-dom", () => ({
  createPortal: (node: React.ReactNode) => node,
}));
vi.mock("@/lib/supabase", () => ({
  supabase: { auth: authApi },
}));
vi.mock("../../lib/supabase", () => ({
  supabase: { auth: authApi },
}));
vi.mock("@/lib/posthog-events", () => ({
  trackSignUpCompleted: vi.fn(),
  trackLogin: vi.fn(),
}));
vi.mock("../../lib/posthog-events", () => ({
  trackSignUpCompleted: vi.fn(),
  trackLogin: vi.fn(),
}));
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

import { AuthModal } from "../auth/AuthModal";

function extractText(node: unknown): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (node && typeof node === "object" && "children" in node) {
    return extractText((node as { children: unknown }).children);
  }
  return "";
}

function findButtonByText(renderer: ReactTestRenderer, text: string) {
  return renderer.root.findAllByType("button").find((btn) =>
    extractText(btn.children).includes(text)
  );
}

describe("AuthModal", () => {
  let renderer: ReactTestRenderer;
  let onClose: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    onClose = vi.fn();
    vi.stubGlobal("document", { body: {} });
    vi.stubGlobal("window", { location: { origin: "https://www.sqlnoir.com" } });
    authApi.signInWithPassword.mockResolvedValue({ error: null });
    authApi.signUp.mockResolvedValue({ error: null });
    authApi.resetPasswordForEmail.mockResolvedValue({ error: null });
    act(() => {
      renderer = create(<AuthModal isOpen={true} onClose={onClose} />);
    });
  });

  afterEach(() => {
    act(() => renderer.unmount());
    vi.unstubAllGlobals();
  });

  it("uses auth.passwordHint instead of missing auth.passwordMinLength during registration", () => {
    const toggleBtn = findButtonByText(renderer, "auth.noAccount");
    expect(toggleBtn).toBeDefined();
    act(() => toggleBtn!.props.onClick());

    const output = JSON.stringify(renderer.toJSON());
    expect(output).toContain("auth.passwordHint");
    expect(output).not.toContain("auth.passwordMinLength");
  });

  it("requires matching confirm password on sign up before calling supabase.auth.signUp", async () => {
    const toggleBtn = findButtonByText(renderer, "auth.noAccount");
    act(() => toggleBtn!.props.onClick());

    const inputs = renderer.root.findAllByType("input");
    expect(inputs).toHaveLength(3);
    const [emailInput, passwordInput, confirmInput] = inputs;

    act(() => {
      emailInput.props.onChange({ target: { value: "detective@example.com" } });
      passwordInput.props.onChange({ target: { value: "secret123" } });
      confirmInput.props.onChange({ target: { value: "different123" } });
    });

    await act(async () => {
      await renderer.root.findByType("form").props.onSubmit({ preventDefault() {} });
    });

    expect(authApi.signUp).not.toHaveBeenCalled();
    expect(JSON.stringify(renderer.toJSON())).toContain("auth.passwordsDoNotMatch");

    act(() => {
      confirmInput.props.onChange({ target: { value: "secret123" } });
    });

    await act(async () => {
      await renderer.root.findByType("form").props.onSubmit({ preventDefault() {} });
    });

    expect(authApi.signUp).toHaveBeenCalledWith({
      email: "detective@example.com",
      password: "secret123",
    });
    expect(JSON.stringify(renderer.toJSON())).toContain("auth.accountCreated");
  });

  it("supports requesting a password reset email from login mode", async () => {
    const emailInput = renderer.root.findByProps({ type: "email" });
    act(() => {
      emailInput.props.onChange({ target: { value: "detective@example.com" } });
    });

    const forgotBtn = findButtonByText(renderer, "auth.forgotPassword");
    expect(forgotBtn).toBeDefined();
    act(() => forgotBtn!.props.onClick());

    expect(JSON.stringify(renderer.toJSON())).toContain("auth.resetPassword");
    expect(renderer.root.findAllByProps({ type: "password" })).toHaveLength(0);

    await act(async () => {
      await renderer.root.findByType("form").props.onSubmit({ preventDefault() {} });
    });

    expect(authApi.resetPasswordForEmail).toHaveBeenCalledWith(
      "detective@example.com",
      { redirectTo: "https://www.sqlnoir.com" }
    );
    expect(JSON.stringify(renderer.toJSON())).toContain("auth.resetPasswordEmailSent");
    expect(onClose).not.toHaveBeenCalled();
  });

  it("shows Supabase error message when password reset request fails", async () => {
    authApi.resetPasswordForEmail.mockResolvedValueOnce({
      error: new Error("Email rate limit exceeded"),
    });

    const forgotBtn = findButtonByText(renderer, "auth.forgotPassword");
    act(() => forgotBtn!.props.onClick());

    const emailInput = renderer.root.findByProps({ type: "email" });
    act(() => {
      emailInput.props.onChange({ target: { value: "detective@example.com" } });
    });

    await act(async () => {
      await renderer.root.findByType("form").props.onSubmit({ preventDefault() {} });
    });

    expect(JSON.stringify(renderer.toJSON())).toContain("Email rate limit exceeded");
  });
});

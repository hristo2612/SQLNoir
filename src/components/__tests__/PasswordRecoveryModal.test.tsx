import React from "react";
import { act, create, type ReactTestRenderer } from "react-test-renderer";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearPasswordRecoveryPending,
  markPasswordRecoveryPending,
} from "@/lib/password-recovery";

const authState = vi.hoisted(() => ({
  callback: null as ((event: string, session: unknown) => void) | null,
  updateUser: vi.fn(),
  unsubscribe: vi.fn(),
}));

vi.mock("react-dom", () => ({
  createPortal: (node: React.ReactNode) => node,
}));
vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      onAuthStateChange: (cb: (event: string, session: unknown) => void) => {
        authState.callback = cb;
        return { data: { subscription: { unsubscribe: authState.unsubscribe } } };
      },
      updateUser: authState.updateUser,
    },
  },
}));
vi.mock("../../lib/supabase", () => ({
  supabase: {
    auth: {
      onAuthStateChange: (cb: (event: string, session: unknown) => void) => {
        authState.callback = cb;
        return { data: { subscription: { unsubscribe: authState.unsubscribe } } };
      },
      updateUser: authState.updateUser,
    },
  },
}));
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

import { PasswordRecoveryModal } from "../auth/PasswordRecoveryModal";

describe("PasswordRecoveryModal", () => {
  let renderer: ReactTestRenderer;

  beforeEach(() => {
    vi.clearAllMocks();
    clearPasswordRecoveryPending();
    authState.callback = null;
    authState.updateUser.mockResolvedValue({ error: null });
    vi.stubGlobal("document", { body: {} });
    vi.stubGlobal("window", {
      location: { pathname: "/", search: "", hash: "" },
      history: { replaceState: vi.fn() },
    });
  });

  afterEach(() => {
    if (renderer) {
      act(() => renderer.unmount());
    }
    clearPasswordRecoveryPending();
    vi.unstubAllGlobals();
  });

  it("stays closed until a PASSWORD_RECOVERY event arrives", () => {
    act(() => {
      renderer = create(<PasswordRecoveryModal />);
    });
    expect(renderer.toJSON()).toBeNull();

    act(() => {
      authState.callback?.("PASSWORD_RECOVERY", { user: { id: "u1" } });
    });
    expect(JSON.stringify(renderer.toJSON())).toContain("auth.setNewPassword");
    expect(JSON.stringify(renderer.toJSON())).toContain("auth.passwordHint");
  });

  it("opens on mount if PASSWORD_RECOVERY was captured before mount", () => {
    markPasswordRecoveryPending();
    act(() => {
      renderer = create(<PasswordRecoveryModal />);
    });
    expect(JSON.stringify(renderer.toJSON())).toContain("auth.setNewPassword");
  });

  it("validates matching password and length before calling updateUser", async () => {
    act(() => {
      renderer = create(<PasswordRecoveryModal />);
    });
    act(() => {
      authState.callback?.("PASSWORD_RECOVERY", { user: { id: "u1" } });
    });

    const [newInput, confirmInput] = renderer.root.findAllByType("input");
    act(() => {
      newInput.props.onChange({ target: { value: "123" } });
      confirmInput.props.onChange({ target: { value: "123" } });
    });
    await act(async () => {
      await renderer.root.findByType("form").props.onSubmit({ preventDefault() {} });
    });
    expect(authState.updateUser).not.toHaveBeenCalled();
    expect(JSON.stringify(renderer.toJSON())).toContain("auth.weakPassword");

    act(() => {
      newInput.props.onChange({ target: { value: "newsecret1" } });
      confirmInput.props.onChange({ target: { value: "newsecret2" } });
    });
    await act(async () => {
      await renderer.root.findByType("form").props.onSubmit({ preventDefault() {} });
    });
    expect(authState.updateUser).not.toHaveBeenCalled();
    expect(JSON.stringify(renderer.toJSON())).toContain("auth.passwordsDoNotMatch");
  });

  it("updates the password via supabase.auth.updateUser and clears recovery hash", async () => {
    const replaceState = vi.fn();
    vi.stubGlobal("window", {
      location: { pathname: "/", search: "", hash: "#access_token=abc&type=recovery" },
      history: { replaceState },
    });

    act(() => {
      renderer = create(<PasswordRecoveryModal />);
    });
    act(() => {
      authState.callback?.("PASSWORD_RECOVERY", { user: { id: "u1" } });
    });

    const [newInput, confirmInput] = renderer.root.findAllByType("input");
    act(() => {
      newInput.props.onChange({ target: { value: "newsecret123" } });
      confirmInput.props.onChange({ target: { value: "newsecret123" } });
    });
    await act(async () => {
      await renderer.root.findByType("form").props.onSubmit({ preventDefault() {} });
    });

    expect(authState.updateUser).toHaveBeenCalledWith({ password: "newsecret123" });
    expect(JSON.stringify(renderer.toJSON())).toContain("auth.passwordUpdated");
    expect(replaceState).toHaveBeenCalledWith(null, "", "/");
  });

  it("maps same-password error and closes on SIGNED_OUT", async () => {
    authState.updateUser.mockResolvedValueOnce({
      error: new Error("New password should be different from the old password."),
    });

    act(() => {
      renderer = create(<PasswordRecoveryModal />);
    });
    act(() => {
      authState.callback?.("PASSWORD_RECOVERY", { user: { id: "u1" } });
    });

    const [newInput, confirmInput] = renderer.root.findAllByType("input");
    act(() => {
      newInput.props.onChange({ target: { value: "samepass123" } });
      confirmInput.props.onChange({ target: { value: "samepass123" } });
    });
    await act(async () => {
      await renderer.root.findByType("form").props.onSubmit({ preventDefault() {} });
    });

    expect(JSON.stringify(renderer.toJSON())).toContain("auth.samePasswordError");

    act(() => {
      authState.callback?.("SIGNED_OUT", null);
    });
    expect(renderer.toJSON()).toBeNull();
  });
});

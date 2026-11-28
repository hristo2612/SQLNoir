import React from "react";
import { act, create, type ReactTestRenderer } from "react-test-renderer";
import { afterEach, describe, expect, it, vi } from "vitest";
import enMessages from "../../../messages/en.json";
import ptBrMessages from "../../../messages/pt-br.json";
import zhCnMessages from "../../../messages/zh-CN.json";

const state = vi.hoisted(() => ({
  messages: {} as Record<string, unknown>,
}));

function lookupMessage(messages: Record<string, unknown>, key: string): string {
  const value = key.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object" && part in acc) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, messages);
  if (typeof value !== "string") {
    throw new Error(`Missing translation key: ${key}`);
  }
  return value;
}

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => lookupMessage(state.messages, key),
}));

vi.mock("@/components/Navbar", () => ({
  Navbar: () => <nav data-testid="navbar" />,
}));

vi.mock("@/i18n/navigation", () => ({
  Link: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock("@vercel/analytics/react", () => ({
  track: vi.fn(),
}));

import { HelpPageClient } from "../HelpPageClient";

function extractText(node: unknown): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (node && typeof node === "object" && "children" in node) {
    return extractText((node as { children: unknown }).children);
  }
  return "";
}

describe("HelpPageClient", () => {
  let renderer: ReactTestRenderer | null = null;

  afterEach(() => {
    if (renderer) {
      act(() => renderer!.unmount());
      renderer = null;
    }
  });

  function renderWithMessages(messages: Record<string, unknown>) {
    state.messages = messages;
    act(() => {
      renderer = create(<HelpPageClient />);
    });
    return renderer!;
  }

  it("links /cases to the case files and /blog to Detective's Journal without duplicate words in English", () => {
    const tree = renderWithMessages(enMessages);
    const links = tree.root.findAllByType("a");
    const casesLink = links.find((a) => a.props.href === "/cases");
    const blogLink = links.find((a) => a.props.href === "/blog");

    expect(casesLink).toBeDefined();
    expect(blogLink).toBeDefined();
    expect(extractText(casesLink!.children)).toBe("the case files");
    expect(extractText(blogLink!.children)).toBe("Detective's Journal");

    const header = tree.root.findByType("header");
    const paragraphs = header.findAllByType("p");
    const introText = extractText(paragraphs[1].children).replace(/\s+/g, " ").trim();
    expect(introText).toBe(
      "Start a new investigation in the case files or browse tips in the Detective's Journal."
    );
    expect(introText).not.toMatch(/\bthe\s+the\b/i);
  });

  it("renders distinct localized /cases and /blog links in pt-br and zh-CN", () => {
    const cases = [
      {
        messages: ptBrMessages,
        casesText: "arquivos de caso",
        blogText: "Diário do Detetive",
        expectedIntro:
          "Comece uma nova investigação nos arquivos de caso ou navegue pelas dicas no Diário do Detetive.",
      },
      {
        messages: zhCnMessages,
        casesText: "案件档案",
        blogText: "侦探手记",
        expectedIntro: "去开启一个新调查： 案件档案 或在以下地方翻翻提示： 侦探手记.",
      },
    ];

    for (const tc of cases) {
      const tree = renderWithMessages(tc.messages);
      const links = tree.root.findAllByType("a");
      const casesLink = links.find((a) => a.props.href === "/cases");
      const blogLink = links.find((a) => a.props.href === "/blog");

      expect(extractText(casesLink!.children)).toBe(tc.casesText);
      expect(extractText(blogLink!.children)).toBe(tc.blogText);
      expect(extractText(blogLink!.children)).not.toBe(extractText(casesLink!.children));

      const header = tree.root.findByType("header");
      const paragraphs = header.findAllByType("p");
      const introText = extractText(paragraphs[1].children).replace(/\s+/g, " ").trim();
      expect(introText).toBe(tc.expectedIntro);

      act(() => tree.unmount());
      renderer = null;
    }
  });
});

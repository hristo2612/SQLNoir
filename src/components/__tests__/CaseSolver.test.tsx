import React from "react";
import { act, create, type ReactTestInstance, type ReactTestRenderer } from "react-test-renderer";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { getAllCases } from "@/lib/case-utils";

vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key }));
vi.mock("@vercel/analytics/react", () => ({ track: vi.fn() }));
vi.mock("@/lib/posthog-events", () => ({ trackCaseStarted: vi.fn() }));
vi.mock("../case-study/CaseBrief", () => ({
  CaseBrief: () => <div data-panel="brief">brief-panel</div>,
}));
vi.mock("../case-study/SQLWorkspace", () => ({
  SQLWorkspace: () => <div data-panel="workspace">workspace-panel</div>,
}));
vi.mock("../case-study/DatabaseSchema", () => ({
  DatabaseSchema: () => <div data-panel="schema">schema-panel</div>,
}));
vi.mock("../case-study/SolutionSubmission", () => ({
  SolutionSubmission: () => <div data-panel="submit">submit-panel</div>,
}));

import { CaseNotes } from "../case-study/CaseNotes";
import { CaseSolver } from "../CaseSolver";

const caseData = getAllCases().find((c) => c.id === "case-001")!;
const storage = new Map<string, string>();
let renderer: ReactTestRenderer;

function hasClass(node: ReactTestInstance, token: string): boolean {
  const cls = typeof node.props.className === "string" ? node.props.className : "";
  return cls.split(/\s+/).includes(token);
}

function getText(node: ReactTestInstance | string): string {
  if (typeof node === "string") return node;
  return node.children.map((child) => getText(child)).join("");
}

function getMobileNavButtons(): ReactTestInstance[] {
  const mobileHeader = renderer.root.find(
    (node) => node.type === "div" && hasClass(node, "lg:hidden")
  );
  const mobileNav = mobileHeader.find(
    (node) => node.type === "div" && hasClass(node, "overflow-x-auto")
  );
  return mobileNav.findAllByType("button");
}

function getDesktopNavButtons(): ReactTestInstance[] {
  const desktopNav = renderer.root.find(
    (node) =>
      node.type === "div" &&
      hasClass(node, "hidden") &&
      hasClass(node, "lg:block") &&
      hasClass(node, "border-b")
  );
  const tabRow = desktopNav.find(
    (node) => node.type === "div" && node.props.className === "flex"
  );
  return tabRow.findAllByType("button");
}

function getPanelWrapper(panelContent: ReactTestInstance): ReactTestInstance {
  let curr = panelContent.parent;
  while (curr && curr.type !== "div") {
    curr = curr.parent;
  }
  return curr!;
}

function getNotesPanelWrappers(): ReactTestInstance[] {
  return renderer.root.findAllByType(CaseNotes).map((node) => node.parent!);
}

beforeEach(() => {
  vi.clearAllMocks();
  storage.clear();
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
    removeItem: (key: string) => storage.delete(key),
  });
  act(() => {
    renderer = create(
      <CaseSolver caseData={caseData} onBack={vi.fn()} onSolve={vi.fn()} />
    );
  });
});

afterEach(() => {
  act(() => renderer.unmount());
  vi.unstubAllGlobals();
});

it("keeps the Notes tab accessible in narrow-viewport navigation below 1024px", () => {
  const mobileButtons = getMobileNavButtons();
  const desktopButtons = getDesktopNavButtons();

  expect(mobileButtons).toHaveLength(desktopButtons.length);
  expect(mobileButtons).toHaveLength(5);

  const notesButton = mobileButtons.find(
    (btn) => btn.props["aria-label"] === "caseSolver.notes"
  );
  expect(notesButton).toBeDefined();

  // Notes panel starts hidden while Brief is active
  expect(hasClass(getNotesPanelWrappers()[0], "hidden")).toBe(true);

  act(() => {
    notesButton!.props.onClick();
  });

  // Notes button now shows its label and active state, and Notes panel is visible
  const activeNotesButton = getMobileNavButtons().find(
    (btn) => btn.props["aria-label"] === "caseSolver.notes"
  )!;
  expect(getText(activeNotesButton)).toContain("caseSolver.notes");
  expect(hasClass(getNotesPanelWrappers()[0], "hidden")).toBe(false);

  const briefPanel = renderer.root.find((n) => n.props["data-panel"] === "brief");
  expect(hasClass(getPanelWrapper(briefPanel), "hidden")).toBe(true);
});

it("switches the visible primary pane when clicking Notes in narrow navigation after desktop side-by-side Tab 2 selection", () => {
  const desktopHeader = renderer.root.find(
    (node) =>
      node.type === "div" &&
      hasClass(node, "hidden") &&
      hasClass(node, "lg:block") &&
      hasClass(node, "max-w-7xl")
  );
  const sideBySideButton = desktopHeader
    .findAllByType("button")
    .find((btn) => getText(btn).includes("caseSolver.sideBySide"))!;

  act(() => {
    sideBySideButton.props.onClick();
  });

  const desktopNav = renderer.root.find(
    (node) =>
      node.type === "div" &&
      hasClass(node, "hidden") &&
      hasClass(node, "lg:block") &&
      hasClass(node, "border-b")
  );
  const tab2Selector = desktopNav
    .findAllByType("button")
    .find((btn) => getText(btn) === "caseSolver.tab2")!;

  act(() => {
    tab2Selector.props.onClick();
  });

  // Now click Notes in the narrow-viewport navigation (< 1024px where secondary pane is hidden)
  const mobileNotesButton = getMobileNavButtons().find(
    (btn) => btn.props["aria-label"] === "caseSolver.notes"
  );
  expect(mobileNotesButton).toBeDefined();

  act(() => {
    mobileNotesButton!.props.onClick();
  });

  // Primary pane's Notes wrapper must be visible
  const [primaryNotesWrapper] = getNotesPanelWrappers();
  expect(hasClass(primaryNotesWrapper, "hidden")).toBe(false);
});

it("preserves desktop side-by-side Tab 2 selection when clicking Notes in desktop navigation", () => {
  const desktopHeader = renderer.root.find(
    (node) =>
      node.type === "div" &&
      hasClass(node, "hidden") &&
      hasClass(node, "lg:block") &&
      hasClass(node, "max-w-7xl")
  );
  const sideBySideButton = desktopHeader
    .findAllByType("button")
    .find((btn) => getText(btn).includes("caseSolver.sideBySide"))!;

  act(() => {
    sideBySideButton.props.onClick();
  });

  const desktopNav = renderer.root.find(
    (node) =>
      node.type === "div" &&
      hasClass(node, "hidden") &&
      hasClass(node, "lg:block") &&
      hasClass(node, "border-b")
  );
  const tab2Selector = desktopNav
    .findAllByType("button")
    .find((btn) => getText(btn) === "caseSolver.tab2")!;

  act(() => {
    tab2Selector.props.onClick();
  });

  const desktopNotesButton = getDesktopNavButtons().find((btn) =>
    getText(btn).includes("caseSolver.notes")
  )!;

  act(() => {
    desktopNotesButton.props.onClick();
  });

  const notesWrappers = getNotesPanelWrappers();
  expect(notesWrappers).toHaveLength(2);
  expect(hasClass(notesWrappers[0], "hidden")).toBe(true);
  expect(hasClass(notesWrappers[1], "hidden")).toBe(false);
});

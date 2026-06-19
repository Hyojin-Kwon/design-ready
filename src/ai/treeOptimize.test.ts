// treeOptimize 회귀 테스트. 특히 "잘림은 repeat-collapse 이후 최종 단계" 순서 보장.

import { describe, expect, test } from "vitest";
import type { SerializedNode } from "./conversionSerialize";
import { optimizeTree } from "./treeOptimize";

function child(i: number, over: Partial<SerializedNode> = {}): SerializedNode {
  return {
    id: `n${i}`,
    type: "INSTANCE",
    name: `Item ${i}`,
    width: 100,
    height: 40,
    x: 0,
    y: i * 40,
    componentRef: { name: "ListRow" },
    ...over,
  };
}

function root(children: SerializedNode[]): SerializedNode {
  return { id: "root", type: "FRAME", name: "Root", width: 100, height: 4000, children };
}

describe("optimizeTree truncation ordering", () => {
  test("200 repeating items collapse to repeatCount — no truncation", () => {
    const children = Array.from({ length: 200 }, (_, i) => child(i));
    const { tree, stats } = optimizeTree(root(children));

    // 반복 압축이 먼저 적용되어 자식 수가 80 이하로 줄었으므로 잘림이 없어야 한다.
    expect(stats.truncatedChildren).toBe(0);
    expect(tree.children!.some((c) => c.id === "__truncated__")).toBe(false);
    // 대표 노드에 repeatCount가 붙는다.
    const withRepeat = tree.children!.find((c) => typeof c.repeatCount === "number");
    expect(withRepeat?.repeatCount).toBe(200);
    expect(stats.collapsedRepeats).toBeGreaterThan(0);
  });

  test("100 unique (non-repeating) children truncate to 80 + marker", () => {
    const children = Array.from({ length: 100 }, (_, i) =>
      // 숫자접미사가 없는 고유 이름이라 repeat-collapse 대상이 아니다.
      child(i, { name: `Card_${i}_box`, componentRef: undefined, type: "FRAME" }),
    );
    const { tree, stats } = optimizeTree(root(children));

    expect(stats.truncatedChildren).toBe(20);
    const last = tree.children![tree.children!.length - 1];
    expect(last.id).toBe("__truncated__");
    expect(last.name).toContain("20");
  });

  test("under-limit unique children are untouched", () => {
    const children = Array.from({ length: 10 }, (_, i) =>
      // 숫자접미사가 없는 고유 이름이라 repeat-collapse 대상이 아니다.
      child(i, { name: `Card_${i}_box`, componentRef: undefined, type: "FRAME" }),
    );
    const { tree, stats } = optimizeTree(root(children));

    expect(stats.truncatedChildren).toBe(0);
    expect(tree.children!.some((c) => c.id === "__truncated__")).toBe(false);
  });
});

describe("optimizeTree occlusion dedup", () => {
  function band(id: string, name: string, y: number, h: number): SerializedNode {
    return {
      id,
      type: "INSTANCE",
      name,
      componentRef: { name },
      x: 0,
      y,
      width: 375,
      height: h,
    };
  }

  test("stacked same-component duplicates at identical bounds → occluded one dropped, topmost kept", () => {
    // 두 BottomNav가 같은 위치에 겹쳐 쌓임(뱃지 유/무 두 상태). 사이에 Header.
    const navA = band("navA", "Bottom Navigation", 728, 84);
    const header = band("header", "Header", 0, 44);
    const navB = band("navB", "Bottom Navigation", 728, 84);
    const screen: SerializedNode = {
      id: "root",
      type: "FRAME",
      name: "Screen",
      width: 375,
      height: 812,
      children: [navA, header, navB],
    };

    const { tree, stats } = optimizeTree(screen);

    expect(stats.occludedDuplicates).toBe(1);
    const navs = tree.children!.filter((c) => c.name === "Bottom Navigation");
    expect(navs.length).toBe(1);
    expect(navs[0].id).toBe("navB"); // 최상단(나중 index)이 남는다
    expect(tree.children!.some((c) => c.name === "Header")).toBe(true);
  });

  test("overlapping but DIFFERENT components are NOT deduped", () => {
    const badge = band("a", "Badge", 0, 20);
    const avatar = band("b", "Avatar", 0, 20);
    const screen: SerializedNode = {
      id: "root",
      type: "FRAME",
      name: "Screen",
      width: 375,
      height: 100,
      children: [badge, avatar],
    };

    const { tree, stats } = optimizeTree(screen);

    expect(stats.occludedDuplicates).toBe(0);
    expect(tree.children!.length).toBe(2);
  });

  test("same component at DIFFERENT positions is NOT deduped", () => {
    const a = band("a", "Tab", 0, 40);
    const b = band("b", "Tab", 100, 40); // 다른 y → 겹치지 않음
    const screen: SerializedNode = {
      id: "root",
      type: "FRAME",
      name: "Screen",
      width: 375,
      height: 200,
      children: [a, b],
    };

    const { tree, stats } = optimizeTree(screen);

    expect(stats.occludedDuplicates).toBe(0);
    expect(tree.children!.length).toBe(2);
  });
});

describe("optimizeTree content-aware repeat collapse", () => {
  // 같은 컴포넌트(Chip) 인스턴스지만 라벨 텍스트가 다른 탭/칩.
  function chip(id: string, label: string, x: number): SerializedNode {
    return {
      id,
      type: "INSTANCE",
      name: "Chip",
      width: 80,
      height: 35,
      x,
      y: 0,
      componentRef: { name: "Chip" },
      children: [
        {
          id: `${id}-t`,
          type: "TEXT",
          name: "label",
          width: 60,
          height: 18,
          text: { chars: label, fontSize: 13, fontWeight: 600 },
        },
      ],
    };
  }
  function bar(children: SerializedNode[]): SerializedNode {
    return { id: "root", type: "FRAME", name: "Tabs", width: 375, height: 49, children };
  }

  test("동일 컴포넌트라도 텍스트가 다른 형제는 collapse하지 않는다 (탭/리스트 누락 방지)", () => {
    const tree0 = bar([
      chip("a", "Favorites", 0),
      chip("b", "OpenChats", 84),
      chip("c", "Groups", 168),
      chip("d", "Events", 252),
    ]);
    const { tree, stats } = optimizeTree(tree0);

    expect(stats.collapsedRepeats).toBe(0);
    expect(tree.children!.length).toBe(4);
    // 네 탭의 라벨이 전부 보존된다.
    expect(tree.children!.map((c) => c.children![0].text!.chars)).toEqual([
      "Favorites",
      "OpenChats",
      "Groups",
      "Events",
    ]);
    expect(tree.children!.some((c) => typeof c.repeatCount === "number")).toBe(false);
  });

  test("컴포넌트 + 텍스트까지 동일한 진짜 반복은 여전히 collapse된다", () => {
    const tree0 = bar([
      chip("a", "Tag", 0),
      chip("b", "Tag", 84),
      chip("c", "Tag", 168),
      chip("d", "Tag", 252),
    ]);
    const { tree, stats } = optimizeTree(tree0);

    expect(stats.collapsedRepeats).toBeGreaterThan(0);
    const rep = tree.children!.find((c) => typeof c.repeatCount === "number");
    expect(rep?.repeatCount).toBe(4);
  });
});

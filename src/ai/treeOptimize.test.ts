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
    ...over
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
      child(i, { name: `Card_${i}_box`, componentRef: undefined, type: "FRAME" })
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
      child(i, { name: `Card_${i}_box`, componentRef: undefined, type: "FRAME" })
    );
    const { tree, stats } = optimizeTree(root(children));

    expect(stats.truncatedChildren).toBe(0);
    expect(tree.children!.some((c) => c.id === "__truncated__")).toBe(false);
  });
});

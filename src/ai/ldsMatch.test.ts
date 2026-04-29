// 매처 회귀 테스트. 룰 변경 시 npm test로 즉시 검증.
// 케이스는 실제로 부딪힌 false-positive/true-positive를 누적해 라벨링.

import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { findExactLdsMatch, findLdsMatch, setExtraFigmaPool } from "./ldsMatch";

const FIXTURES = [
  { name: "TEST_Header / NavigationBar / BackButton", key: "k_header_back" },
  { name: "TEST_Notification - OFF", key: "k_noti_off" },
  { name: "TEST_Title + Body Bold", key: "k_title_bold" },
  { name: "TEST_Button / Primary", key: "k_btn_primary" }
];

beforeEach(() => {
  setExtraFigmaPool(FIXTURES);
});

afterEach(() => {
  setExtraFigmaPool([]);
});

describe("findExactLdsMatch", () => {
  test("정확 일치는 매칭 + key 반환", () => {
    const r = findExactLdsMatch("TEST_Header / NavigationBar / BackButton");
    expect(r).not.toBeNull();
    expect(r?.match).toBe("TEST_Header / NavigationBar / BackButton");
    expect(r?.key).toBe("k_header_back");
    expect(r?.score).toBe(1);
  });

  test("형제 variant는 매칭 안 됨 (OFF2 vs OFF)", () => {
    // 디태치 의심 노드의 핵심 안전 케이스 — 100% exact만 통과해야 함.
    expect(findExactLdsMatch("TEST_Notification - OFF2")).toBeNull();
  });

  test("형제 variant는 매칭 안 됨 (Title+Body3 vs Title Bold)", () => {
    expect(findExactLdsMatch("TEST_Title + Body3")).toBeNull();
  });

  test("대소문자 무시", () => {
    const r = findExactLdsMatch("test_notification - off");
    expect(r?.match).toBe("TEST_Notification - OFF");
  });

  test("주변 공백 무시", () => {
    const r = findExactLdsMatch("  TEST_Button / Primary  ");
    expect(r?.match).toBe("TEST_Button / Primary");
  });

  test("빈 입력은 null", () => {
    expect(findExactLdsMatch("")).toBeNull();
    expect(findExactLdsMatch("   ")).toBeNull();
  });
});

describe("findLdsMatch (fuzzy, naming 카테고리 전용)", () => {
  test("정확 일치는 score=1", () => {
    const r = findLdsMatch("TEST_Header / NavigationBar / BackButton");
    expect(r).not.toBeNull();
    expect(r?.score).toBe(1);
  });

  test("쿼리 토큰이 0개면 null", () => {
    expect(findLdsMatch("")).toBeNull();
    // 모두 stopword/숫자라 토큰 0개 — null이어야 함
    expect(findLdsMatch("the and or")).toBeNull();
  });

  test("형제 variant 케이스는 fuzzy로도 OFF에 매칭되지 않아야 함", () => {
    // OFF2 vs OFF: terminal divergence 페널티가 작동해서 OFF로 매칭되면 안 됨.
    // (다른 후보에 더 적합한 매칭이 있다면 그쪽이 best가 됨 — 어쨌든 OFF는 아님)
    const r = findLdsMatch("TEST_Notification - OFF2");
    if (r) {
      expect(r.match).not.toBe("TEST_Notification - OFF");
    }
  });
});

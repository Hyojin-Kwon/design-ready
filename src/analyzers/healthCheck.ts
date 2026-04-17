import type { HealthReport, Issue } from "../types";
import { isComponentInternal, isInsideHidden, walk } from "../utils/nodeTraversal";
import { computeCategoryScores, computeScore } from "../utils/scoring";
import { checkDefaultNaming, checkDetachedInstance } from "../rules/namingRules";
import { checkGroupNestingDepth, checkMissingAutoLayout } from "../rules/layoutRules";
import { checkStyleOrTokenMissing } from "../rules/styleRules";
import {
  checkEmptyFrame,
  checkHiddenSubtreeRoot,
  checkNearlyInvisible
} from "../rules/hygieneRules";

const ACTIVE_CHECKS: Array<(node: SceneNode) => Issue | null> = [
  checkDefaultNaming,
  checkDetachedInstance,
  checkMissingAutoLayout,
  checkGroupNestingDepth,
  checkEmptyFrame,
  checkNearlyInvisible,
  checkStyleOrTokenMissing
];

export function runHealthCheck(root: BaseNode): HealthReport {
  const issues: Issue[] = [];
  let totalNodes = 0;
  walk(root, (node) => {
    if (isComponentInternal(node)) return;
    if (isInsideHidden(node)) return;
    totalNodes += 1;

    if (node.visible === false) {
      const issue = checkHiddenSubtreeRoot(node);
      if (issue) issues.push(issue);
      return;
    }

    for (const check of ACTIVE_CHECKS) {
      const issue = check(node);
      if (issue) issues.push(issue);
    }
  });
  return {
    score: computeScore(totalNodes, issues),
    totalNodes,
    issues,
    categoryScores: computeCategoryScores(totalNodes, issues)
  };
}

import type { HealthReport, Issue } from "../types";
import { isComponentInternal, isInsideHidden, walk } from "../utils/nodeTraversal";
import { computeCategoryScores, computeScore } from "../utils/scoring";
import { checkDefaultNaming, checkDetachedInstance } from "../rules/namingRules";
import {
  checkAbsoluteInsideAutoLayout,
  checkGroupNestingDepth,
  checkMissingAutoLayout,
} from "../rules/layoutRules";
import {
  checkEffectTokenMissing,
  checkRadiusTokenMissing,
  checkStrokeTokenMissing,
  checkStyleOrTokenMissing,
  createSpacingTokenCheck,
  hasSpacingVariablesInFile,
} from "../rules/styleRules";
import {
  checkEmptyFrame,
  checkHiddenSubtreeRoot,
  checkNearlyInvisible,
} from "../rules/hygieneRules";
import {
  checkSubpixelPosition,
  checkSubpixelSize,
  checkSubpixelSpacing,
} from "../rules/precisionRules";
import {
  checkIconWithoutVector,
  checkOversizedRaster,
  checkRasterInIconSlot,
} from "../rules/assetRules";
import { checkSingleChildWrapper } from "../rules/wrapperRules";

export function runHealthCheck(root: BaseNode): HealthReport {
  const checkSpacingToken = createSpacingTokenCheck(hasSpacingVariablesInFile());
  const activeChecks: Array<(node: SceneNode) => Issue | null> = [
    checkDefaultNaming,
    checkDetachedInstance,
    checkMissingAutoLayout,
    checkAbsoluteInsideAutoLayout,
    checkGroupNestingDepth,
    checkEmptyFrame,
    checkNearlyInvisible,
    checkStyleOrTokenMissing,
    checkStrokeTokenMissing,
    checkEffectTokenMissing,
    checkRadiusTokenMissing,
    checkSpacingToken,
    checkSubpixelSpacing,
    checkSubpixelPosition,
    checkSubpixelSize,
    checkRasterInIconSlot,
    checkIconWithoutVector,
    checkOversizedRaster,
    checkSingleChildWrapper,
  ];

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

    for (const check of activeChecks) {
      const issue = check(node);
      if (issue) issues.push(issue);
    }
  });
  return {
    score: computeScore(totalNodes, issues),
    totalNodes,
    issues,
    categoryScores: computeCategoryScores(totalNodes, issues),
  };
}

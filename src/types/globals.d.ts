// 빌드 타임에 esbuild가 주입 (esbuild.config.mjs의 define 참고).
// DESIGN_READY_DEV=true → true, 그 외 → false.
declare const __DEV__: boolean;

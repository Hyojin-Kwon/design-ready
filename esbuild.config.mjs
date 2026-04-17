import * as esbuild from "esbuild";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const watch = process.argv.includes("--watch");

const outDir = resolve(__dirname, "dist");
await mkdir(outDir, { recursive: true });

const codeOptions = {
  entryPoints: [resolve(__dirname, "src/code.ts")],
  bundle: true,
  outfile: resolve(outDir, "code.js"),
  platform: "browser",
  target: "es2017",
  format: "iife",
  logLevel: "info"
};

const uiJsPath = resolve(outDir, ".ui.js");
const uiCssPath = resolve(outDir, ".ui.css");
const uiOptions = {
  entryPoints: [resolve(__dirname, "src/ui/main.tsx")],
  bundle: true,
  outfile: uiJsPath,
  platform: "browser",
  target: "es2017",
  format: "iife",
  jsx: "automatic",
  jsxImportSource: "preact",
  loader: { ".css": "css" },
  logLevel: "info"
};

async function emitUiHtml() {
  const htmlTemplate = await readFile(resolve(__dirname, "src/ui/index.html"), "utf8");
  const js = await readFile(uiJsPath, "utf8");
  let css = "";
  try {
    css = await readFile(uiCssPath, "utf8");
  } catch {
    // css is optional
  }
  const html = htmlTemplate
    .replace("<!-- INLINE_CSS -->", `<style>${css}</style>`)
    .replace("<!-- INLINE_JS -->", `<script>${js}</script>`);
  await writeFile(resolve(outDir, "ui.html"), html, "utf8");
  console.log("[ui] wrote dist/ui.html");
}

if (watch) {
  const codeCtx = await esbuild.context(codeOptions);
  const uiCtx = await esbuild.context({
    ...uiOptions,
    plugins: [
      {
        name: "emit-html",
        setup(build) {
          build.onEnd(async (result) => {
            if (result.errors.length === 0) await emitUiHtml();
          });
        }
      }
    ]
  });
  await codeCtx.watch();
  await uiCtx.watch();
  console.log("watching...");
} else {
  await esbuild.build(codeOptions);
  await esbuild.build(uiOptions);
  await emitUiHtml();
}

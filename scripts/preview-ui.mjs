// 플러그인 UI(dist/ui.html) 로컬 미리보기용 초경량 정적 서버.
// Figma 브리지 없이 UI 셸(탭/버튼/빈 상태)을 브라우저에서 확인하는 용도.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname } from "node:path";

// 선택 인자: argv[2]=서빙할 dist 디렉토리, argv[3]=포트. (다른 브랜치/워크트리 빌드 미리보기용)
const ROOT = process.argv[2]
  ? resolve(process.argv[2])
  : resolve(import.meta.dirname, "..", "dist");
const PORT = Number(process.argv[3] || process.env.PORT) || 5180;
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".json": "application/json",
};

createServer(async (req, res) => {
  let path = decodeURIComponent((req.url || "/").split("?")[0]);
  if (path === "/" || path === "") path = "/ui.html";
  try {
    const file = resolve(ROOT, "." + path);
    if (!file.startsWith(ROOT)) {
      res.writeHead(403);
      res.end("forbidden");
      return;
    }
    const data = await readFile(file);
    res.writeHead(200, { "content-type": TYPES[extname(file)] || "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("not found");
  }
}).listen(PORT, () => {
  console.log(`plugin-ui preview on http://localhost:${PORT}/ui.html`);
});

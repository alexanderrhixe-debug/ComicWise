// scripts/update-imports-to-aliases.ts
// Script to update all relative imports/exports to use tsconfig path aliases
// Usage: pnpm tsx scripts/update-imports-to-aliases.ts

import fs from "fs";
import { glob } from "glob";
import path from "path";

// Map of alias to real path (should match tsconfig.json)
const aliasMap: Record<string, string> = {
  "@/": "src/",
  "components/": "src/components/",
  "lib/": "src/lib/",
  "hooks/": "src/hooks/",
  "types/": "src/types/",
  "db/": "src/db/",
  "services/": "src/services/",
  "stores/": "src/stores/",
  "app-config": "src/app-config",
  "ui/": "src/components/ui/",
  "actions/": "src/lib/actions/",
  utils: "src/lib/utils",
  auth: "src/lib/auth",
  "styles/": "src/styles/",
  "assets/": "src/assets/",
  "config/": "src/config/",
};

const exts = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"];

function getAliasForPath(importPath: string, fileDir: string): string | null {
  const absImport = path.resolve(fileDir, importPath);
  for (const [alias, real] of Object.entries(aliasMap)) {
    const absAlias = path.resolve(process.cwd(), real);
    if (absImport.startsWith(absAlias)) {
      const rel = path.relative(absAlias, absImport).replace(/\\/g, "/");
      return alias + rel;
    }
  }
  return null;
}

async function updateFileImports(file: string) {
  let code = await fs.promises.readFile(file, "utf8");
  const dir = path.dirname(file);
  code = code.replace(
    /(from|import|require\()\s*['"](\.\.?\/[^'"]+)['"]/g,
    (match, keyword, importPath) => {
      const alias = getAliasForPath(importPath, dir);
      if (alias) {
        return match.replace(importPath, alias);
      }
      return match;
    }
  );
  await fs.promises.writeFile(file, code, "utf8");
}

async function main() {
  const files = await glob("{src,tests}/**/*.{ts,tsx,js,jsx,mjs,cjs}");
  for (const file of files) {
    await updateFileImports(file);
  }
  console.log("✅ All imports/exports updated to use path aliases.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

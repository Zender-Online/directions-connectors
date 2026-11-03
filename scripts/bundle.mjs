// Builds dist/connectors-bundle.json: everything one tag publishes, with each file's hash.
// Deterministic (no clock): the same tree always gives the same bundle.
import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";

import { repositoryFiles } from "./files.mjs";

const tag = process.argv[2];
if (!tag) {
  console.error("usage: node scripts/bundle.mjs <tag>");
  process.exit(1);
}

const sha256 = (text) => createHash("sha256").update(text).digest("hex");
const entries = repositoryFiles().map((file) => ({
  kind: file.kind,
  id: file.data.id,
  sha256: sha256(file.text),
  content: file.data,
}));
const bundle = {
  format: 1,
  tag,
  catalogs: entries.filter((e) => e.kind === "catalog").map(({ kind, ...e }) => e),
  connectors: entries.filter((e) => e.kind === "connector").map(({ kind, ...e }) => e),
};

mkdirSync("dist", { recursive: true });
const text = `${JSON.stringify(bundle, null, 2)}\n`;
writeFileSync("dist/connectors-bundle.json", text);
writeFileSync("dist/connectors-bundle.json.sha256", `${sha256(text)}  connectors-bundle.json\n`);
console.log(`dist/connectors-bundle.json ${bundle.catalogs.length} catalogs, ${bundle.connectors.length} connectors`);

import { readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { parse } from "yaml";

/** Every catalog and connector file, read and parsed, in a fixed order. */
export function repositoryFiles(root = ".") {
  const files = [];
  for (const kind of ["catalog", "connector"]) {
    const dir = join(root, `${kind}s`);
    for (const name of readdirSync(dir).filter((n) => n.endsWith(".yaml")).sort()) {
      const path = join(dir, name);
      const text = readFileSync(path, "utf8");
      files.push({ kind, path, id: basename(name, ".yaml"), text, data: parse(text) });
    }
  }
  return files;
}

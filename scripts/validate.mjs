// Validates every file against the schemas exported from the Directions monorepo.
// The engine validates again when it loads a tag; this is what keeps a bad file out of a PR.
import { readFileSync } from "node:fs";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

import { repositoryFiles } from "./files.mjs";

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
const validators = {
  catalog: ajv.compile(JSON.parse(readFileSync("schema/catalog.schema.json", "utf8"))),
  connector: ajv.compile(JSON.parse(readFileSync("schema/connector.schema.json", "utf8"))),
};

const errors = [];
const seen = new Map();
for (const file of repositoryFiles()) {
  const validate = validators[file.kind];
  if (!validate(file.data)) {
    for (const e of validate.errors) errors.push(`${file.path}: ${e.instancePath || "/"} ${e.message}`);
    continue;
  }
  if (file.data.id !== file.id) errors.push(`${file.path}: id "${file.data.id}" differs from the file name`);
  const key = `${file.kind}:${file.data.id}`;
  if (seen.has(key)) errors.push(`${file.path}: id already used by ${seen.get(key)}`);
  seen.set(key, file.path);
  if (file.data.connector === "curated") {
    const ids = new Set();
    for (const dataset of file.data.datasets) {
      if (ids.has(dataset.id)) errors.push(`${file.path}: dataset "${dataset.id}" repeated`);
      ids.add(dataset.id);
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`${seen.size} files valid`);

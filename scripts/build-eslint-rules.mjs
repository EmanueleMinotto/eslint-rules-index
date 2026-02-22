/**
 * Builds a JSON file with all ESLint rules:
 * - Core rules from the `eslint` package
 * - Plugin rules from installed eslint-plugin-* (and @scope/eslint-plugin-*) dependencies
 *
 * Install plugins (e.g. eslint-plugin-depend) then run: npm run build:rules
 */
import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

const require = createRequire(import.meta.url);
const { builtinRules } = require("eslint/use-at-your-own-risk");

const ESLINT_DOC_BASE = "https://eslint.org/docs/latest/rules";
const OUT_PATH = path.join(process.cwd(), "src", "data", "eslint-rules.json");
const PROJECT_ROOT = path.join(process.cwd());
const NODE_MODULES = path.join(PROJECT_ROOT, "node_modules");

/** @type {Array<{ id: string, package: string, url: string, description: string|null, deprecated: boolean, type: string|null, fixable: string|null, hasSuggestions: boolean, category: string|null }>} */
const rules = [];

function ruleMeta(rule) {
  const type = rule?.meta?.type ?? null;
  const fixable = rule?.meta?.fixable ?? null;
  const hasSuggestions = !!rule?.meta?.hasSuggestions;
  const category = rule?.meta?.docs?.category ?? null;
  return { type, fixable, hasSuggestions, category };
}

// ---- Core ESLint rules ----
for (const [ruleId, rule] of builtinRules.entries()) {
  const url =
    rule?.meta?.docs?.url || `${ESLINT_DOC_BASE}/${ruleId}`;
  const { type, fixable, hasSuggestions, category } = ruleMeta(rule);
  rules.push({
    id: ruleId,
    package: "eslint",
    url,
    description: rule?.meta?.docs?.description || null,
    deprecated: !!rule?.meta?.deprecated,
    type,
    fixable,
    hasSuggestions,
    category,
  });
}

// ---- Plugin prefix from package name: eslint-plugin-depend -> depend, @scope/eslint-plugin-x -> x ----
function getPluginPrefix(packageName) {
  const match = packageName.match(/(?:^@[^/]+\/)?eslint-plugin-(.+)$/);
  return match ? match[1] : packageName;
}

// ---- Discover eslint-plugin-* in dependencies ----
const pkgPath = path.join(PROJECT_ROOT, "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
const deps = { ...pkg.dependencies, ...pkg.devDependencies };
const pluginPackages = Object.keys(deps || {}).filter(
  (name) =>
    name.startsWith("eslint-plugin-") || /^@[^/]+\/eslint-plugin-.+$/.test(name)
);

// Plugins that throw when loaded (e.g. missing peer deps); add back here if you reinstall them
const SKIP_PLUGINS = new Set([]);

// ---- Load rules from each plugin (supports both CJS and ESM) ----
for (const packageName of pluginPackages) {
  if (SKIP_PLUGINS.has(packageName)) {
    console.warn(`Skipping plugin ${packageName} (in skip list).`);
    continue;
  }
  const pluginPath = path.join(NODE_MODULES, packageName);
  if (!fs.existsSync(pluginPath)) continue;

  try {
    let plugin;
    try {
      const pkgJsonPath = path.join(pluginPath, "package.json");
      const pluginPkg = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8"));
      let entryPath;
      try {
        entryPath = require.resolve(packageName);
      } catch {
        const entry = pluginPkg.main || pluginPkg.module || "index.js";
        entryPath = path.join(pluginPath, entry);
      }
      const isEsm =
        pluginPkg.type === "module" || entryPath.endsWith(".mjs");
      if (isEsm) {
        const mod = await import(pathToFileURL(entryPath).href);
        plugin = mod.default ?? mod;
      } else {
        plugin = require(entryPath);
      }
    } catch (err) {
      console.warn(`Could not load plugin ${packageName}:`, err.message);
      continue;
    }

    const pluginRules = plugin?.rules || plugin?.default?.rules;
    if (!pluginRules || typeof pluginRules !== "object") {
      console.warn(`Plugin ${packageName} has no .rules object, skipping.`);
      continue;
    }

    const prefix = getPluginPrefix(packageName);
    for (const [ruleName, ruleValue] of Object.entries(pluginRules)) {
      const rule =
        typeof ruleValue === "function"
          ? ruleValue
          : ruleValue?.default ?? ruleValue;
      const fullId = `${prefix}/${ruleName}`;
      const url =
        rule?.meta?.docs?.url ||
        (packageName.startsWith("@")
          ? `https://www.npmjs.com/package/${packageName}`
          : `https://www.npmjs.com/package/${packageName}#rules`);
      const { type, fixable, hasSuggestions, category } = ruleMeta(rule);
      rules.push({
        id: fullId,
        package: packageName,
        url,
        description: rule?.meta?.docs?.description || null,
        deprecated: !!rule?.meta?.deprecated,
        type,
        fixable,
        hasSuggestions,
        category,
      });
    }
  } catch (err) {
    console.warn(`Error processing plugin ${packageName}:`, err.message);
  }
}

rules.sort((a, b) => a.id.localeCompare(b.id));

const pluginCount = new Set(rules.map((r) => r.package)).size;

const dir = path.dirname(OUT_PATH);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}
const output = { rules, pluginCount };
fs.writeFileSync(OUT_PATH, JSON.stringify(output, null, 2), "utf8");
console.log(
  `Wrote ${rules.length} rules (${pluginCount} plugin(s)) to ${OUT_PATH}`
);

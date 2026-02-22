# ESLint Rules Index

A Next.js app that displays a table of **ESLint rules**: core rules plus rules from any installed ESLint plugins, with their source package and links to documentation.

## Stack

- **Next.js** (App Router)
- **Mantine UI** – components and theme
- **Mantine DataTable** – sortable, paginated table
- **Vercel** – hosting

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm run start
```

## Including plugin rules

Rules are collected from:

1. **ESLint core** – built-in rules from the `eslint` package
2. **Installed plugins** – any dependency or devDependency whose name is `eslint-plugin-*` or `@scope/eslint-plugin-*`

To add rules from a plugin, install it and regenerate the rules list:

```bash
npm install eslint-plugin-depend --save-dev
npm run build:rules
```

Then rebuild or refresh the app. The table will show both core rules and rules from `eslint-plugin-depend` (and any other installed plugins). Each rule row shows the **package** that provides it (e.g. `eslint` or `eslint-plugin-depend`).

## Updating the rules list

The table data is generated into `src/data/eslint-rules.json`. Regenerate it whenever you:

- Upgrade ESLint
- Add or remove an ESLint plugin

```bash
npm run build:rules
```

The script supports both CommonJS and ESM plugins. It uses Node’s `require.resolve()` so plugins that only expose an entry via `exports` (e.g. `eslint-plugin-functional`) are loaded correctly.

### Plugins that may be skipped

Some installed plugins are omitted from the index when they cannot be loaded or do not expose a `.rules` object:

| Reason | What to do |
|--------|------------|
| **No `.rules` object** | Plugin is a config/processor only (e.g. `eslint-plugin-diff`, `eslint-plugin-markdown`). Nothing to change. |
| **Missing peer dependency** | Install the peer (e.g. `svelte` for `eslint-plugin-svelte`). The repo adds `svelte` so that plugin is included. |
| **Skip list** | Plugins that throw on load (e.g. `eslint-plugin-flowtype-errors` needs `flow-bin`) are listed in `scripts/build-eslint-rules.mjs` as `SKIP_PLUGINS`. Remove from the list and install any required peer to include them. |
| **Incompatible deps** | e.g. `eslint-plugin-tailwindcss` with Tailwind v4, or ESM-only internals. Fix would be upstream or an optional alternate dependency. |

Run `npm run build:rules` and check the console for “Could not load plugin …” or “has no .rules object” to see which plugins are skipped.

## Deploy on Vercel

1. Connect the repository to [Vercel](https://vercel.com).
2. Deploy uses the config in `vercel.json` (Next.js).
3. No environment variables are required.

**Note:** The rules list is built at **build time** from the dependencies in the repo. To include a plugin in production, add it to `package.json` (e.g. `devDependencies`), run `npm run build:rules`, and commit the updated `src/data/eslint-rules.json` (and `package.json` / `package-lock.json`). Vercel will then run `npm run build`, which uses that JSON; you can add a `prebuild` script that runs `build:rules` if you prefer to regenerate on each deploy.

## Data shape

Each rule in the table has:

- **Rule** – rule id (e.g. `eqeqeq` or `depend/ban-dependencies`) with link to docs; “Deprecated” badge when applicable
- **Package** – package that provides the rule (`eslint` for core, or e.g. `eslint-plugin-depend`)
- **Description** – from the rule’s metadata
- **Documentation** – link to the official or plugin doc URL

Core rules use `eslint/use-at-your-own-risk` (`builtinRules`); plugin rules are loaded from installed `eslint-plugin-*` packages.

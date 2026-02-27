# AGENTS.md

## Purpose

This repository-level guide is written for autonomous coding agents (and humans) that will operate on this project. It documents how to build, lint, test, and the coding-style expectations so agents can make safe, consistent changes.

## How to run (quick)

- Install dependencies:
  - pnpm install

- Development server:
  - pnpm run dev
    - runs: node ./scripts/set-env-version.js && node ./scripts/open-document.js && vite

- Build / preview:
  - pnpm run build # full build (runs type-check first)
  - pnpm run build-only # build without type-check
  - pnpm run preview # run vite preview

- Type checking:
  - pnpm run type-check
  - This runs: vue-tsc --noEmit -p tsconfig.app.json --composite false

- Lint and formatting:
  - pnpm run lint # run oxlint (fast linter used in this project)
  - pnpm run lint:fix # run oxlint --fix
  - pnpm run format # runs: prettier --write src/

- Tests (vitest):
  - pnpm run test # runs: vitest run
  - pnpm run testOnline # runs vitest in watch/dev mode

## Run a single test file or test

- Run a single test file (example):
  - pnpm exec vitest run src/components/common/date-range-shortcuts/**tests**/index.test.ts
  - or: pnpm exec vitest src/components/common/date-range-shortcuts/**tests**/index.test.ts

- Run a single test by name (match):
  - pnpm exec vitest -t "renders 7 default" # partial/regex match of the test title
  - or use pnpm scripts: pnpm run test -- -t "partial name"

## Notes about testing setup

- The repo contains vitest.config.ts and vitest.setup.ts
  - environment: jsdom
  - setupFiles: ./vitest.setup.ts (contains common mocks)
  - vitest excludes configDefaults.exclude plus custom excludes (e2e, node_modules, dist, .vscode, some packages)
  - TypeScript config for tests: tsconfig.vitest.json (extends tsconfig.app.json)

## Linting (oxlint)

- This project uses oxlint (devDependency) for linting, configured in oxlint.config.ts.
  - Run: npm run lint or npx oxlint path/to/file.ts
  - Auto-fix: npm run lint:fix or npx oxlint --fix

- Key rules (project configuration summary):
  - correctness: warn
  - suspicious: warn
  - perf: warn
  - Specific rule overrides include:
    - eslint/no-unused-vars: error
    - no-console: off (console allowed during development)
    - no-debugger: error
    - eqeqeq: error (use ===)
    - no-var: error (prefer let/const)

## Code style and conventions

This repository follows a Vue 3 + TypeScript style with Prettier, oxlint rules and conventional Vue patterns. Agents should obey the following conventions when modifying or creating files.

Formatting (Prettier)

- Source file: .prettierrc.js
- Key settings:
  - semi: false (no semicolons)
  - tabWidth: 4
  - useTabs: false (spaces)
  - singleQuote: false (double quotes)
  - printWidth: 160
  - trailingComma: all
  - arrowParens: always

Typescript / Types

- Use strict typings where practical. The project uses TypeScript 5.x and vue-tsc for checks.
- Prefer explicit return types on exported functions and components.
- When adding new types/interfaces, keep them colocated with the feature (e.g., in a types.ts or nearby module) unless shared widely.
- Use tsconfig.app.json and tsconfig.vitest.json for test-specific typing rules.

Imports and module style

- The repo uses ESM (package.json: "type": "module").
- Prefer absolute imports via configured paths where available (see tsconfig.app.json). Use relative imports for local siblings.
- Keep import groups in this order: 1) builtin node modules, 2) external packages, 3) internal absolute imports, 4) relative imports (../ then ./). Insert one blank line between groups.
- Avoid large default exports for utility collections; prefer named exports for clarity and tree-shaking.

Vue conventions

- Single File Components (.vue) should follow the <script setup lang="ts"> pattern where possible.
- Component props should be typed and validated; use defineProps with explicit types when feasible.
- Expose emits with defineEmits and apply types to emitted payloads.
- Keep template class names and CSS selectors stable; tests depend on certain class names (e.g., .shortcut-item).

Naming conventions

- Files: kebab-case for vue components and utilities (e.g., date-range-shortcuts, my-component.vue).
- Test files: place next to the code in **tests** or use \*.test.ts suffix. Existing examples: src/utils/dateTime.test.ts and **tests**/index.test.ts
- Types: PascalCase for interfaces and types (e.g., DateShortcut)
- Variables: camelCase
- Components: PascalCase (component file names kebab-case is acceptable; registered components use PascalCase)

Error handling and logging

- Prefer returning Result-like values or throwing meaningful Error instances for unexpected failures.
- Do not swallow errors silently. If catch is needed, handle the error or rethrow. Avoid empty catch blocks.
- Use console.\* sparingly but allowed during development; production-critical code should avoid noisy logs. oxlint config currently allows console.

Tests and mocks

- Tests use vitest + @vue/test-utils. Use describe/it/expect from vitest. See src/\*\*/**tests** examples.
- The repo includes a vitest.setup.ts where common module mocks are declared. Reuse that file for global setup.
- Mock external UI libraries or hard-to-init modules in tests (see vi.mock entries in vitest.setup.ts).

Repository patterns to follow

- Keep features modular: small utilities under src/utils, packages under src/pkg, components under src/components
- When adding new command scripts, add entries to package.json scripts with clear names and document them here.

## Cursor / Copilot rules

- Cursor rules (.cursor/) and Copilot instructions (.github/copilot-instructions.md) were searched for but not found in this repository. If you add those files, list them here so automated agents can read them.

## Files of note (examples)

- package.json (scripts): dev, build, preview, type-check, lint, lint:fix, format, test, testOnline
- .prettierrc.js : formatting rules
- oxlint.config.ts : lint rules and ignorePatterns
- vitest.config.ts and vitest.setup.ts : test runtime and mocks
- tsconfig.vitest.json : test TS config
- Example test files:
  - src/components/common/date-range-shortcuts/**tests**/index.test.ts
  - src/utils/dateTime.test.ts
  - many other src/\*_/**test**/_.test.ts files

## Agent responsibilities

- Always run lints and tests locally after changes: npm run lint && npm run test (or target tests changed).
- Respect Prettier formatting on write. Run npm run format if unsure.
- For TypeScript changes run: npm run type-check
- When adding new files, add relevant unit tests and update any tsconfig include/excludes if needed.

## If something is missing

- If agents detect other configuration files or tooling (ESLint, .editorconfig, .cursorrules, Copilot rules), update this AGENTS.md and add a short summary entry.

## Contact / Author

- Author: 焦棚子 <jiaopengzi@outlook.com> (from package.json)

-- End of AGENTS.md --

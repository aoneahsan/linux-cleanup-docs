# Package and build notes

The local site uses Yarn 4 and Docusaurus 3. The dependency roles are recorded in `package.json`: Docusaurus
builds the static site, React renders its pages, the local-search theme indexes published docs, and TypeScript
checks the config and source.

The `build` script disables Node's experimental Web Storage global during static rendering. On Node 26,
Docusaurus's `eval` dependency enumerates that global and Node prints an `ExperimentalWarning` when no
`--localstorage-file` is set. Static rendering does not need Web Storage. Recheck this setting when
Docusaurus stops enumerating the global or Node makes Web Storage non-experimental; then remove the flag.

## 2026-11-16 — Node 26.13.1 and latest stable

- Node 26.13.1 LTS: `.nvmrc` added, `engines.node` `>=18.0.0` → `>=26.13.1`.
- `npx -y npm-check-updates -u`: Docusaurus 3.10.1 → 3.10.2, React 19.2.7 → 19.3.1, local search 0.55.3, and
  TypeScript 6.0 → **7.0.2**. This site has no typescript-eslint and no Capacitor, so the fleet's 6.0 pin does not
  apply here.
- TypeScript 7 removed `baseUrl`, which `@docusaurus/tsconfig` still sets (TS5102). The package and the `extends`
  are gone; `tsconfig.json` carries the same options without `baseUrl` (relative `paths` still resolve), and the old
  `ignoreDeprecations` line went with it. A planted type error in `sidebars.ts` fails `yarn typecheck`.

# Package and build notes

The local site uses Yarn 4 and Docusaurus 3. The dependency roles are recorded in `package.json`: Docusaurus
builds the static site, React renders its pages, the local-search theme indexes published docs, and TypeScript
checks the config and source.

The `build` script disables Node's experimental Web Storage global during static rendering. On Node 26,
Docusaurus's `eval` dependency enumerates that global and Node prints an `ExperimentalWarning` when no
`--localstorage-file` is set. Static rendering does not need Web Storage. Recheck this setting when
Docusaurus stops enumerating the global or Node makes Web Storage non-experimental; then remove the flag.

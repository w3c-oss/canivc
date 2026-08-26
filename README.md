# Can I VC?

## Contributing
Contributions are welcome and encouraged!  Please follow [best practices for contributing to open-source code on GitHub](https://docs.github.com/en/get-started/exploring-projects-on-github/finding-ways-to-contribute-to-open-source-on-github).

This site is built with [11ty](https://11ty.dev/) and hosted on GitHub Pages.

To build the site locally you will need Node.js and npm. If you have Node, run
the following in your local working copy directory:
```sh
$ npm i
$ npm run serve # or `build` for just file generation
```

If all worked as hoped, you can visit https://localhost:8080/ to test the site.

## Data Source

The content of canivc.com is aggregated from W3C Verifiable Credential and
Credential Community Group test suite report results. The list of currently
configured test suite report URLs can be found in `src/_data/results.js`.

Set `CANIVC_LOCAL_REPORTS=1` (`npm run build:local` / `npm run serve:local`)
to read each suite's report from a sibling checkout's `reports/index.json`
instead of fetching the published copy — useful for previewing the effect of
local test runs before they're published. This assumes the suite repos are
checked out next to `canivc` (as siblings under the same parent directory);
any suite without a local report present falls back to its published URL.
To populate or refresh a suite's local report, run its own `npm test`.

## License
[BSD-3-Clause](LICENSE.md) © 2023 Digital Bazaar, Inc.

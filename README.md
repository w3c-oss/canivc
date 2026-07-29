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

## Scripts

The `scripts/` directory has a couple of helpers to rerun the test suites and
check their statuses. Both require the
[GitHub CLI](https://cli.github.com/) (`gh`), authenticated against GitHub (as
someone who can do these same actions in the UI, of course).

- `scripts/rerun-test-reports.sh` — triggers a fresh run of each test suite's
  report-generation workflow (normally only runs on a weekly schedule), so
  you can force an ad-hoc update without clicking through the GitHub UI.
  ```sh
  $ scripts/rerun-test-reports.sh                        # rerun all suites
  $ scripts/rerun-test-reports.sh vc-di-ecdsa-test-suite # rerun just one
  $ scripts/rerun-test-reports.sh --list                 # list known suites
  ```

- `scripts/test-report-status.sh` — shows the status of each test suite's
  most recent report-generation run, so you can check whether it (or a
  rerun triggered above) succeeded.
  ```sh
  $ scripts/test-report-status.sh        # status of all known suites
  $ scripts/test-report-status.sh --json # status as JSON, for scripting
  ```

Run either script with `--help` for full usage.

## License
[BSD-3-Clause](LICENSE.md) © 2023 Digital Bazaar, Inc.

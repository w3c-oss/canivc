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

## License

The original license of the project was [BSD-3-Clause](LICENSE.md) © 2023 Digital Bazaar, Inc. However, W3C is investigating new licensing.

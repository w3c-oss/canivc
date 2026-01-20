import EleventyFetch from '@11ty/eleventy-fetch';

const specUrls = [
  'https://w3c.github.io/vc-data-model-2.0-test-suite/index.json',
  'https://w3c.github.io/vc-di-ecdsa-test-suite/index.json',
  'https://w3c.github.io/vc-di-ed25519signature2020-test-suite/index.json',
  'https://w3c.github.io/vc-di-eddsa-test-suite/index.json',
  'https://w3c.github.io/vc-di-bbs-test-suite/index.json',
  'https://w3c-ccg.github.io/did-key-test-suite/index.json',
  'https://w3c-ccg.github.io/vc-api-issuer-test-suite/index.json',
  'https://w3c-ccg.github.io/vc-api-verifier-test-suite/index.json',
  'https://w3c.github.io/vc-bitstring-status-list-test-suite/index.json',
  'https://w3c.github.io/vc-jose-cose-test-suite/index.json'
];

// Helper function: Remove company name suffix (Digital Bazaar: P-256)
const removeCompanySuffix = company => {
  const suffix = ': P-';
  const indexToRemove = company.indexOf(suffix);
  return indexToRemove > -1 ? company.slice(0, indexToRemove) : company;
};

// Organize data into company test results by test type
const extractCompanyResultsByTestType = results => {
  // Helper function: Extract all test results for each test
  const getTestResults = (all, currentSuite) => {
    const {title, tests} = currentSuite;
    return {
      ...all,
      [removeNameSuffix(title)]: tests.reduce((all, test) => {
        const testState = test.state;
        all[testState] = all[testState] ? all[testState] + 1 : 1;
        return {total: tests.length, ...all};
      }, {})
    };
  };

  // Organize all test suite data by test type (Issuer, Verifier, etc)
  const testSuiteDataByTestType = results
    .flatMap(r => r.matrices)
    .reduce((all, testSuiteData) => {
      const testType = testSuiteData.columnLabel;
      return {...all, [testType]: [...(all[testType] || []), testSuiteData]};
    }, {});

  // Organize each test suite result by test type (Issuer, Verifier, etc)
  const testResultsByTestType = Object.keys(testSuiteDataByTestType).reduce(
    (all, testType) => {
      return {
        ...all,
        [testType]: testSuiteDataByTestType[testType].map(({suites}) => {
          return suites.reduce(getTestResults, {});
        })
      };
    },
    {}
  );

  // Format each company name and their test results under each test type
  const companyResultsByTestType = Object.keys(testResultsByTestType).reduce(
    (allTestTypes, testType) => {
      const companyTotals = testResultsByTestType[testType]
        .reduce((all, testResults) => {
          Object.keys(testResults).forEach(company => {
            all[company] = all[company] ?
              {
                ...all[company],
                ...Object.keys(testResults[company]).reduce(
                  (allStates, state) => {
                    const previousCount = all[company]?.[state] || 0;
                    const count = testResults[company]?.[state] || 0;
                    return {...allStates, [state]: previousCount + count};
                  }, {})
              } :
              testResults[company];
          });
          return all;
        }, {});

      // Organize company data and sort by most tests passed
      allTestTypes[testType] = Object.keys(companyTotals).map(companyName => {
        const defaultValues = {passed: 0, failed: 0, total: 0, pending: 0};
        return {
          text: companyName,
          ...defaultValues,
          ...companyTotals[companyName]
        };
      }).sort((a, b) => (b.passed || 0) - (a.passed || 0));
      return allTestTypes;
    },
    {}
  );

  return companyResultsByTestType;
};

// Organize data into company names containing tests
const extractTestsByCompany = results => {
  // Consolidate all tests
  const allTests = results.flatMap(result => {
    const shortName = result.respecConfig.shortName;
    return result.matrices.map(test => ({...test, shortName}));
  });
  // Organize all tests by company name
  const companies = allTests.reduce((all, current) => {
    const {columnLabel, title, shortName} = current;
    // Temporary fix to match slugified url
    const shortNameSlug = shortName.replace('.', '-');
    const url = `/reports/${shortNameSlug}/suites`;
    const labelAndLink = {label: title, url};
    current.columns.forEach(companyName => {
      companyName = removeNameSuffix(companyName);
      if(!all[companyName]?.[columnLabel]) {
        all[companyName] = {...all[companyName], [columnLabel]: [labelAndLink]};
      } else {
        all[companyName][columnLabel].push(labelAndLink);
      }
    });
    return all;
  }, {});
  return companies;
};

const collectSpecListByGroup = results => {
  return results.flatMap(result => {
    const rv = result.respecConfig;
    rv.group = rv.github.split('/')[3];
    return rv;
  });
};

// Company names containing tests passed in percentages and test names
const getSpiderResults = results => {
  const testTitlesByType = {};
  // Iterate through matrices to organize test titles by type
  results.forEach(result => {
    result.matrices.forEach(m => {
      const type = m.columnLabel;
      testTitlesByType[type] = testTitlesByType[type] ?
        [...testTitlesByType[type], m.title] : [m.title];
    });
  });
  // Create structure for each vendor to organize their passing percentage
  const vendorStructure = Object.keys(testTitlesByType).reduce((all, key) => ({
    ...all,
    [key]: testTitlesByType[key].sort((a, b) => a.localeCompare(b))
      .reduce((all, title) => {
        return ({...all, [title]: null});
      }, {})
  }), {});
  // Sort and stringify list of titles to pass as prop to canvas element
  const labels = Object.keys(testTitlesByType).reduce((all, key) => ({
    ...all, [key]: JSON.stringify(
      testTitlesByType[key].sort((a, b) => a.localeCompare(b))
    )
  }), {});
  // Test types and passing percentages by vendor names
  const vendorResults = {};
  results.forEach(result => {
    result.matrices.forEach(matrix => {
      const testName = matrix.title;
      const type = matrix.columnLabel;
      matrix.suites = matrix.suites ?? [];
      matrix.suites.forEach(suite => {
        const vendor = removeNameSuffix(suite.title);
        const passed = suite.tests
          .filter(test => test.state === 'passed').length;
        const total = suite.tests.length;
        const percentage = Math.round((passed / total) * 100);
        if(!vendorResults[vendor]) {
          vendorResults[vendor] = JSON.parse(JSON.stringify(vendorStructure));
        }
        vendorResults[vendor][type][testName] = percentage;
      });
    });
  });
  return {labels, vendorResults};
};

/**
 * Removes P-256 & P-384 name extension.
 *
 * @param {string} name - Example: Digital Bazaar: P-256.
 * @returns {string} Returns name example: Digital Bazaar.
 */
function removeNameSuffix(name) {
  // Remove P-256 & P-384 vendor name extension
  const endIdx = name.indexOf(': P-') > -1 ?
    name.indexOf(': P-') : name.length;
  return name.slice(0, endIdx);
}

/**
 * Removes the "interop" matrices because they have no "suites" (columns)
 * and their rows are structured differently than all other matrices. Also
 * removes "at risk" sections which are W3C process specific.
 *
 * @param {Array} results - Results from urls.
 * @returns {Array} Results without interop matrices.
 */
function removeSomeTestSections(results) {
  const curatedResults = results.map(result => ({
    ...result,
    matrices: result.matrices.filter(matrix => {
      const testName = matrix.title.toLowerCase();
      return !testName.includes('interop') && !testName.includes('at risk');
    })
  }));
  return curatedResults;
}

/**
 * Build a mapping of implementers keyed by vendor name.
 * Each vendor maps to an object containing a `specs` array
 * listing spec titles that vendor implements along with stats.
 *
 * @param {Array} results - Results fetched from spec index.json files.
 * @returns {object} Mapping of vendor name to objects with a `specs` array.
 */
function implementersOfSpecs(results) {
  const map = {};
  results.forEach(result => {
    const specTitle = result.respecConfig?.title || result.title || '';
    const specShort = result.respecConfig?.shortName || '';
    const specGroup = result.respecConfig?.group;
    (result.matrices || []).forEach(matrix => {
      (matrix.suites || []).forEach(suite => {
        const vendor = removeNameSuffix(suite.title);
        if(!map[vendor]) {
          map[vendor] = {
            groups: new Set(),
            specs: [],
            totals: {passed: 0, failed: 0, pending: 0, total: 0}
          };
        }

        // find or create spec entry
        let specEntry = map[vendor].specs.find(s => (
          (specShort && s.shortName === specShort) ||
          (!specShort && s.title === specTitle)
        ));
        if(!specEntry) {
          specEntry = {
            title: specTitle,
            shortName: specShort,
            group: specGroup,
            stats: {passed: 0, failed: 0, pending: 0, total: 0}
          };
          map[vendor].specs.push(specEntry);
          map[vendor].groups.add(specGroup);
        }

        // aggregate counts from this suite into the spec entry
        const tests = suite.tests || [];
        const passed = tests.filter(t => t.state === 'passed').length;
        const failed = tests.filter(t => t.state === 'failed').length;
        const pending = tests.filter(t => t.state === 'pending').length;
        const total = tests.length;
        specEntry.stats.passed += passed;
        specEntry.stats.failed += failed;
        specEntry.stats.pending += pending;
        specEntry.stats.total += total;
        specEntry.stats.passPercentage = specEntry.stats.total === 0 ? 0 :
          Math.round((specEntry.stats.passed / specEntry.stats.total) * 100);

        // aggregate counts into vendor totals
        map[vendor].totals.passed += passed;
        map[vendor].totals.failed += failed;
        map[vendor].totals.pending += pending;
        map[vendor].totals.total += total;
      });
    });
  });
  Object.values(map).forEach(v => {
    v.specs.sort((a, b) => a.title.localeCompare(b.title));
    // turn groups into an array for JSON serialization
    v.groups = Array.from(v.groups).sort();
  });
  return map;
}

// Repeated fetch
export default async function() {
  /* This returns a promise */
  const promises = specUrls.map(url =>
    EleventyFetch(url, {
      duration: '1w', // save for 1 week
      type: 'json' // we’ll parse JSON for you
    })
  );

  let results = await Promise.allSettled(promises);

  // Handle rejected request
  results = results.reduce((all, result) => {
    if(result.status !== 'fulfilled') {
      console.error('Failed to fetch resource:', result.reason);
    }
    return result.status !== 'fulfilled' ? all : [...all, result.value];
  }, []);

  /* Temporarily remove interop and at risk matrices */
  results = removeSomeTestSections(results);

  return {
    all: results,
    vendorChartData: getSpiderResults(results),
    testsByCompany: extractTestsByCompany(results),
    companiesByTestType: extractCompanyResultsByTestType(results),
    specsByGroup: collectSpecListByGroup(results),
    implementersOfSpecs: implementersOfSpecs(results),
    specsImplementedBy: results.map(result => ({
      title: result.title,
      implementations: [
        ...(new Set(result.matrices[0].columns.map(removeCompanySuffix)))
      ]
    }))
  };
}

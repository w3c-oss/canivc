/**
 * BarRating component displays a bar of test statistics. Colors are defined
 * in `src/assets/css/site.css`.
 *
 * @param {object} stats - Test statistics.
 * @param {number} stats.passed - Number of tests passed.
 * @param {number} stats.pending - Number of tests pending.
 * @param {number} stats.failed - Number of tests failed.
 * @param {number} stats.total - Total number of tests.
 * @param {string} width - Width of component, defaults to 100%.
 * @returns {string} BarRating component for ScoreList.
 */
function BarRating(stats, width = '100%') {
  const {passed, pending, failed, total} = stats;
  // Percentage of test passed, pending, & failed
  const passedWidth = Math.round(passed / total * 100);
  const pendingWidth = Math.round(pending / total * 100);
  const failedWidth = Math.round(failed / total * 100);
  return `<div class="bar" style="width: ${width};"` +
    ` title="${passed} passed, ${pending} pending, ${failed} failed">` +
    `<span class="passed" style="width: ${passedWidth}%;"></span>` +
    `<span class="pending" style="width: ${pendingWidth}%;"></span>` +
    `<span class="failed" style="width: ${failedWidth}%;"></span>` +
    `</div>`;
}

export default BarRating;

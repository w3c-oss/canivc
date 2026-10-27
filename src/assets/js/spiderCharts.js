/* global Chart */
const ctx = Array.from(document.querySelectorAll('.spider-chart'));

// Chart global defaults
Chart.defaults.font.size = 16;
Chart.defaults.plugins.legend.align = 'end';

// Iterate over each context
ctx.forEach(elementCtx => {
  // Parse the JSON props
  let data = JSON.parse(elementCtx.dataset.chartValues);
  const labels = JSON.parse(elementCtx.dataset.chartLabels);

  // Add zeros for null values
  data = data.map(datum => datum === null ? 0 : datum);

  // Colors
  const white = '#FFFFFF';
  const brandTeal = 'rgb(35, 121, 120)';
  const brandTealTransparent = 'rgba(35, 121, 120, 0.2)';

  // Build chart
  new Chart(elementCtx, {
    type: 'radar',
    data: {
      labels,
      datasets: [
        {
          data,
          fill: true,
          pointBorderColor: white,
          label: '% of Tests Passed',
          borderColor: brandTeal,
          pointHoverBackgroundColor: white,
          pointBackgroundColor: brandTeal,
          pointHoverBorderColor: brandTeal,
          backgroundColor: brandTealTransparent
        }
      ]
    },
    options: {
      spanGaps: true,
      elements: {
        line: {
          borderWidth: 3
        }
      },
      scales: {
        r: {
          suggestedMin: 0,
          suggestedMax: 100,
          pointLabels: {font: {size: 12}},
          ticks: {
            // Return every other tick value
            callback: (value, index) => index % 2 ? '' : value
          }
        }
      }
    }
  });
});

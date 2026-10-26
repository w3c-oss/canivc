---
pagination:
  data: results.all
  size: 1
  alias: report
permalink: "/reports/{{ report.respecConfig.shortName | slugify }}/"
breadcrumbs:
  - href: /reports/
    title: Reports
eleventyComputed:
  title: "{{ report.respecConfig.title }}"
  description: "Test suite results and implementation statistics for {{ report.respecConfig.title }}."
---

{% include "components/ReportDetails.html"
    details: report.respecConfig
    showLinks: true %}

<div class="grid two">
  <div class="card-box">
    <h2>Test Matrices</h2>
    <ul class="link-list">
    {%- for matrix in report.matrices -%}
      <li><a href="suites/{{ matrix.title | slugify }}">{{ matrix.title }}</a></li>
    {%- endfor -%}
    </ul>
  </div>

  {%- assign currentSpec = results.specsImplementedBy | where: 'title', report.respecConfig.title | first -%}
  {%- if currentSpec.implementations.length > 0 -%}
  <div class="card-box">
    <div class="row between" style="margin-bottom: 1rem">
      <h2 style="margin: 0">Implementations</h2>
      <div class="button-group">
        <button id="sortAlphabeltically" class="button active" title="Sort Alphabetically" aria-label="Sort Alphabetically">A–Z</button>
        <button id="sortByPassPercentage" class="button" title="Sort by Percentage Passed" aria-label="Sort by Percentage Passed">%</button>
      </div>
    </div>
    <div class="table-wrap">
      <table id="impl-table">
        {%- for imp in currentSpec.implementations -%}
        <tr>
          <td class="collapsing">
            <a href="/implementations/{{ imp | slugify }}">{{ imp }}</a>
          </td>
          <td>
            {%- assign stats = results.implementersOfSpecs[imp].specs | find: 'shortName', report.respecConfig.shortName | map: 'stats' | first -%}
            {%- BarRating stats -%}
          </td>
          <td class="collapsing"><span class="passPercentage">{{ stats.passPercentage }}</span>%</td>
        </tr>
        {%- endfor -%}
      </table>
    </div>
  </div>
  {%- endif -%}
</div>

<script>
  document.getElementById('sortAlphabeltically')
    .addEventListener('click', function() {
      sortTable(0);
      this.nextElementSibling.classList.remove('active');
      this.classList.add('active');
    });
  document.getElementById('sortByPassPercentage')
    .addEventListener('click', function() {
      sortTable(2);
      this.previousElementSibling.classList.remove('active');
      this.classList.add('active');
    });

  function sortTable(columnIndex) {
    const table = document.getElementById('impl-table');
    const rows = Array.from(table.rows);

    rows.sort((a, b) => {
      const aText = a.cells[columnIndex].innerText;
      const bText = b.cells[columnIndex].innerText;

      if (columnIndex === 2) { // Numeric sort for pass percentage
        return parseFloat(bText) - parseFloat(aText);
      } else { // Alphabetic sort
        return aText.localeCompare(bText);
      }
    });

    // Re-append sorted rows to the table
    rows.forEach(row => table.appendChild(row));
  }
</script>

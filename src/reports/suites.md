---js
{
  pagination: {
    before: function(paginationData) {
      let suites = [];
      // add respecConfig.shortName to each matrix
      paginationData.forEach((suite) => {
        let matrices = suite.matrices;
        const matricesMapped = matrices.map((matrix) => {
          matrix.reportDetails = suite.respecConfig;
          matrix.reportDetails.title = suite.title;
          return matrix;
        });
        suites = suites.concat(matricesMapped);
      });
      // combine matricies into single array and output suites
      return suites;
    },
    data: "results.all",
    size: 1,
    alias: "matrix"
  },
  permalink: "/reports/{{ matrix.reportDetails.shortName | slugify }}/suites/{{ matrix.title | slugify }}/",
  eleventyComputed: {
    breadcrumbs: [
      {
        href: "/reports/",
        title: "Reports"
      },
      {
        href: "/reports/{{ matrix.reportDetails.shortName | slugify }}/",
        title: "{{ matrix.reportDetails.title }}"
      }
    ]
  }
}
---

{% include "components/ReportDetails.html"
    details: matrix.reportDetails
    showLinks: true %}

<h2>
  {{ matrix.title }}
  <a href="{{ matrix.reportDetails.edDraftURI }}#{{ matrix.title | url_encode | replace: '+', '%20' }}" aria-label="View in specification" title="View in specification">↗</a>
</h2>

<section id="{{ matrix.title | slugify }}">
  <div class="table-wrap">
    <table class="matrix">
      <thead>
        <tr>
          <th rowspan="2" style="width: 20%">{{ matrix.rowLabel }}</th>
          <th colspan={{ matrix.columns.length }} >{{ matrix.columnLabel }}</th>
        </tr>
        <tr>
        {% for column in matrix.columns %}
          <th><a href="/implementations/{{ column | removeSuffix | slugify  }}">{{ column }}</a></th>
        {% endfor %}
        </tr>
      </thead>
      <tbody>
      {% for row in matrix.rows %}
        <tr>
          <!--This is the name of the test-->
          <td>{{ row.id }} {% if row.link %}<a href="{{ row.link }}" aria-label="View test source" title="View test source">↗</a>{% endif %}</td>
          <!--These contain if the test passed, failed, or was skipped-->
          {% for cell in row.cells %}
            <td class="status {{ cell.state | getStatusColors }} {{ cell.optional | getOptional }}">
            <!-- Add tooltip for errors -->
              <div class="cell" {% if cell.err %} data-tooltip="{{ cell.err.message | removeQuotes }}" {% endif %}>
                <div>{{ cell.state | getStatusMark }}</div>
              </div>
            </td>
          {% endfor %}
        </tr>
      {% endfor %}
      </tbody>
    </table>
  </div>
  <div>
    <div>
      <div>
      {% if matrix.images %}
        {% for image in matrix.images %}
          <img src={{ image.src }} />
          {% for data in image.meta %}
            <div>
              {{ data }}
            </div>
          {% endfor %}
        {% endfor %}
      {% endif %}
      </div>
      <div>
      {% if matrix.reportData %}
        {% for report in reportData %}
          {% if report.details %}
            <details>
              <summary>{{ report.label }}</summary>
              <pre>{{ report.data }}</pre>
            </details>
          {% else %}
            <pre>{{ report.data }}</pre>
          {% endif %}
        {% endfor %}
      {% endif %}
      </div>
    </div>
  </div>
</section>

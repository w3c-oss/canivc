---
pagination:
  data: implementations
  size: 1
  alias: vendor
permalink: "/implementations/{{ vendor | slugify }}/"
eleventyComputed:
  title: "{{ vendor }} Implementation Report"
  description: "Verifiable Credential test suite results and statistics for {{ vendor }}."
---

{% assign info = implementations[vendor] %}
{% assign testCategories = results.testsByCompany[vendor] %}

<div class="page-title">
  <h1>{{ vendor }}</h1>
  <details class="menu-pop">
    <summary class="button" title="Implementation source files">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/></svg>
      Source
    </summary>
    <div class="pop">
      {%- for group in results.implementersOfSpecs[vendor].groups reversed -%}
      <a href="https://github.com/{{ group }}/vc-test-suite-implementations/blob/main/implementations/{{ vendor | replace: ', Inc.', '' | replace: ' ', '' }}.json" target="_blank" rel="noopener">{{ group }}</a>
      {%- endfor -%}
    </div>
  </details>
</div>

<div class="card-box">
  <!-- Spider Chart -->
  <div class="chart-wrap">
    <div>
      {% assign chartValues = results.implementersOfSpecs[vendor].specs | map: 'stats.passPercentage' | getPercentages %}
      {% assign chartLabels =  results.implementersOfSpecs[vendor].specs | map: 'title' | json | replace: ' Interoperability Report', '' %}
      <canvas
        class="spider-chart"
        data-chart-values='{{chartValues}}'
        data-chart-labels='{{chartLabels}}'></canvas>
    </div>
  </div>
  <div class="stat-grid">
    {%- liquid
        assign issuerResults = results.companiesByTestType['Issuer'] | findObjectByProperty: "text", vendor
        assign verifierResults = results.companiesByTestType['Verifier'] | findObjectByProperty: "text", vendor
        assign implementationResults = results.companiesByTestType['Implementation'] | findObjectByProperty: "text", vendor

        assign definedResultsCount = 0
        if issuerResults
          assign definedResultsCount = definedResultsCount | plus: 1
        endif
        if verifierResults
          assign definedResultsCount = definedResultsCount | plus: 1
        endif
        if implementationResults
          assign definedResultsCount = definedResultsCount | plus: 1
        endif
    -%}

    {%- if issuerResults.total > 0 %}
    <div{% if definedResultsCount == 1 %} class="full"{% endif %}>
      <div class="divider-label">Issuer</div>
      <div class="bar-section">
              {%- include "components/BarRatingKey.html" stats: issuerResults -%}
        {%- BarRating issuerResults -%}
      </div>
    </div>
    {%- endif -%}

    {%- if verifierResults.total > 0 -%}
    <div{% if definedResultsCount == 1 %} class="full"{% endif %}>
      <div class="divider-label">Verifier</div>
      <div class="bar-section">
              {%- include "components/BarRatingKey.html" stats: verifierResults -%}
        {%- BarRating verifierResults -%}
      </div>
    </div>
    {%- endif -%}

    {%- if implementationResults.total > 0 -%}
    <div{% if definedResultsCount == 1 or definedResultsCount == 3 %} class="full"{% endif %}>
      <div class="divider-label">Other</div>
      <div class="bar-section">
              {%- include "components/BarRatingKey.html" stats: implementationResults -%}
        {%- BarRating implementationResults -%}
      </div>
    </div>
    {%- endif -%}
  </div>
</div>

<h2 style="margin-top: 2rem">Specifications Tested
  {%- if results.implementersOfSpecs[vendor].totals %}
  <span class="sub" title="Tests Passed / Total Tests">
    {{ results.implementersOfSpecs[vendor].totals.passed }} tests passed / {{ results.implementersOfSpecs[vendor].totals.total }} total
  </span>
  {%- endif -%}
</h2>
<div class="card-box">
  {%- assign specs = results.implementersOfSpecs[vendor].specs -%}
  {%- for spec in specs -%}
  <div class="spec-row">
    <a href="/reports/{{spec.shortName | slugify}}">{{ spec.title }}</a>
    <div class="bar-cell">{%- BarRating spec.stats '100%' -%}</div>
    <div class="count">{{ spec.stats.passed }} / {{ spec.stats.total }}</div>
  </div>
  {%- endfor -%}
</div>

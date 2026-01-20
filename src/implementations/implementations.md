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

<h1 class="ui centered header" style="padding-left: 2.5em">
  {{ vendor }}
  <div class="ui simple right floated icon dropdown button">
    <i class="cogs icon"></i>
    <div class="left menu">
      {%- for group in results.implementersOfSpecs[vendor].groups reversed -%}
      <a class="item" href="https://github.com/{{ group }}/vc-test-suite-implementations/blob/main/implementations/{{ vendor | replace: ', Inc.', '' | replace: ' ', '' }}.json" target="_blank" rel="noopener">
        {{ group }}
      </a>
      {%- endfor -%}
    </div>
  </div>
</h1>

<div class="ui very padded segment">
  <!-- Spider Chart -->
  <div class="ui one column centered grid">
    <div class="column">
      {% assign chartValues = results.implementersOfSpecs[vendor].specs | map: 'stats.passPercentage' | getPercentages %}
      {% assign chartLabels =  results.implementersOfSpecs[vendor].specs | map: 'title' | json | replace: ' Interoperability Report', '' %}
      <canvas
        class="spider-chart"
        style="max-height: 400px"
        data-chart-values='{{chartValues}}'
        data-chart-labels='{{chartLabels}}'></canvas>
    </div>
  </div>
  <div class="ui stackable grid">
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
    <div class="{% if definedResultsCount == 1 %}sixteen{% else %}eight{% endif %} wide column">
      <div class="ui horizontal divider header">
        <span class="ui small grey italic text">Issuer</span>
      </div>
      <div style="display: flex; justify-content: center; margin-bottom: 32px">
      {%- include "components/BarRatingKey.html" stats: issuerResults -%}
      </div>
      <div style="display: flex; justify-content: center">
      {%- BarRating issuerResults -%}
      </div>
    </div>
    {%- endif -%}

    {%- if verifierResults.total > 0 -%}
    <div class="{% if definedResultsCount == 1 %}sixteen{% else %}eight{% endif %} wide column">
      <div class="ui horizontal divider header">
        <span class="ui small grey italic text">Verifier</span>
      </div>
      <div style="display: flex; justify-content: center; margin-bottom: 32px">
      {%- include "components/BarRatingKey.html" stats: verifierResults -%}
      </div>
      <div style="display: flex; justify-content: center">
      {%- BarRating verifierResults -%}
      </div>
    </div>
    {%- endif -%}

    {%- if implementationResults.total > 0 -%}
    <div class="{% if definedResultsCount == 1 or definedResultsCount == 3 %}sixteen{% else %}eight{% endif %} wide column">
      <div class="ui horizontal divider header">
        <span class="ui small grey italic text">Other</span>
      </div>
      <div style="display: flex; justify-content: center; margin-bottom: 32px">
      {%- include "components/BarRatingKey.html" stats: implementationResults -%}
      </div>
      <div style="display: flex; justify-content: center">
      {%- BarRating implementationResults -%}
      </div>
    </div>
    {%- endif -%}
  </div>
</div>

<h3 class="ui header">Specifcations Tested
  {%- if results.implementersOfSpecs[vendor].totals %}
    <span class="sub header" title="Tests Passed / Total Tests">
      {{ results.implementersOfSpecs[vendor].totals.passed }} tests passed / {{ results.implementersOfSpecs[vendor].totals.total }} total
    </span>
  {% endif -%}
</h3>
<div class="ui stackable grid">
  {%- assign specs = results.implementersOfSpecs[vendor].specs -%}
  {%- for spec in specs -%}
    <div class="row">
      <div class="seven wide column">
        <a class="ui medium header" href="/reports/{{spec.shortName | slugify}}">
          {{ spec.title }}
        </a>
      </div>
      <div class="four wide column">
        {%- BarRating spec.stats '100%' -%}
      </div>
      <div class="two wide column">{{ spec.stats.passed }} / {{ spec.stats.total }}</div>
    </div>
  {%- endfor %}
</div>
